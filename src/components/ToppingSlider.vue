<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useToppingDisplayStore} from '../store/displayStore'
import gsap from 'gsap';

interface toppingProps {
    topping: Array<{
        name : string,
        price : number,
        img: string,
        selected : boolean
    }>
}

const {topping} = defineProps<toppingProps>()

const useToppingDisplay = useToppingDisplayStore()

const toppingContainer = ref<HTMLDivElement|null>(null)
const toppingSlider = ref<HTMLDivElement|null>(null)
const toppingMenu = ref<HTMLButtonElement[]|null>(null)
const toppingSlideAmount = 100/topping.length
let outsideMain3Topping: HTMLButtonElement[]

onMounted(() => {
    outsideMain3Topping = toppingMenu.value?.filter((tp, i) => i !== useToppingDisplay.toppingDisplay-1 && i !== useToppingDisplay.toppingDisplay && i !== useToppingDisplay.toppingDisplay+1)

    gsap.set(toppingSlider.value, {
        x : `-${useToppingDisplay.toppingDisplay*toppingSlideAmount}%`
    })

    toppingMenu.value[useToppingDisplay.toppingDisplay-1] && gsap.set(toppingMenu.value[useToppingDisplay.toppingDisplay-1].children, {
        scale:  .75,
        y: '10%',
    })
    toppingMenu.value[useToppingDisplay.toppingDisplay+1] && gsap.set(toppingMenu.value[useToppingDisplay.toppingDisplay+1].children, {
        scale: .75,
        y: '10%',
    })
    gsap.set(toppingMenu.value[useToppingDisplay.toppingDisplay].children, {
        scale: 1,
        y: '25%',
    })

    toppingContainer.value?.addEventListener('touchstart', e => {
        touchStart = e.changedTouches[0].screenX;
    })
    
    toppingContainer.value?.addEventListener('touchend', e => {
        touchEnd = e.changedTouches[0].screenX;
        swiped()
    })
})

let touchStart : number, touchEnd : number
const swiped = () => {
    if (touchEnd < touchStart) {
        if (useToppingDisplay.toppingDisplay === topping.length-1) return
        
        useToppingDisplay.changeToppingDisplay(1)
        slideTopping('left')
    }
    else if (touchEnd > touchStart) {
        if (useToppingDisplay.toppingDisplay === 0) return
        
        useToppingDisplay.changeToppingDisplay(-1)
        slideTopping('right')
    }
}

const slideTopping = (direction: 'left' | 'right') => {
    if (direction === 'left'){
        gsap.to(toppingSlider.value, {
            x : `-=${toppingSlideAmount}%`,
            ease: "power4.out",
            duration: .9,
        })
    }
    else if (direction === 'right'){
        gsap.to(toppingSlider.value, {
            x : `+=${toppingSlideAmount}%`,
            ease: "power4.out",
            duration: .9,
        })
    }
    outsideMain3Topping = toppingMenu.value.filter((tp, i) => i !== useToppingDisplay.toppingDisplay-1 && i !== useToppingDisplay.toppingDisplay && i !== useToppingDisplay.toppingDisplay+1)

    gsap.to(outsideMain3Topping, {
        scale:  .5,
        y: '0%',
        ease: "power4.out",
        duration: .8,
    })

    toppingMenu.value[useToppingDisplay.toppingDisplay-1] && gsap.to(toppingMenu.value[useToppingDisplay.toppingDisplay-1].children, {
        scale:  .75,
        y: '10%',
        ease: "power4.out",
        duration: .8,
    })
    toppingMenu.value[useToppingDisplay.toppingDisplay+1] && gsap.to(toppingMenu.value[useToppingDisplay.toppingDisplay+1].children, {
        scale: .75,
        y: '10%',
        ease: "power4.out",
        duration: .8,
    })
    gsap.to(toppingMenu.value[useToppingDisplay.toppingDisplay].children, {
        scale: 1,
        y: '25%',
        ease: "power4.out",
        duration: .8,
    })
}

const totalSelectedToppingRef = ref<number>(0)
const toppingClick = (menu: string, i : number) => {
    if ( totalSelectedToppingRef.value === 3 && !topping[i].selected) return
    
    gsap.to(toppingMenu.value[i], {
        opacity: topping[i].selected ? 1 : .5,
        ease: "power4.out",
        duration: .4,
    })
    
    topping[i].selected = !topping[i].selected
    
    totalSelectedToppingRef.value = topping.filter(top => top.selected === true).length
}

</script>

<template>
<div class="pt-4">
    <div class="text-center font-fancy text-lg pt-8 pb-3">
        {{totalSelectedToppingRef}}/3
    </div>
    
    <div class="pt-1 relative" ref="toppingContainer">
        <img src="../assets/curve.svg" class="absolute left-0 -bottom-[65%] w-full-translate-y-1/2"/>
        <div class="translate-x-[50vw]">
            <div class="flex h-[10vh]"
                 :class="`w-[${topping.length*25}vw]`"
                 ref="toppingSlider">
                <button v-for="(top,i) in topping" 
                     :key="top.name"
                     class="-translate-x-[50%]"
                     @click="i === useToppingDisplay.toppingDisplay && toppingClick(top.name,i)"
                     ref="toppingMenu">
                    <img :src="`src/assets/${top.img}`" 
                         class="drop-shadow-lg origin-top scale-50"
                    >
                </button>
            </div>
        </div>
         <button class="bg-black bg-opacity-95 hover:bg-opacity-80 absolute left-1/2 rounded -bottom-3/4 -translate-x-1/2 flex justify-center items-center h-10 w-[38vw] py-5">
            <img src="../assets/cart.svg" class="w-[16%] mr-2">
            <span class="text-white font-fancy">add to cart</span>
         </button>
    </div>
</div>
</template>