<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useToppingDisplayStore, useAddedToppingStore} from '../store/displayStore'
import gsap from 'gsap';

interface toppingProps {
    topping: Array<{
        name : string,
        price : number,
        imgTop: string,
        img: string,
        selected : boolean
    }>
}

const {topping} = defineProps<toppingProps>()

const useToppingDisplay = useToppingDisplayStore()
const useAddedTopping = useAddedToppingStore()

const toppingContainer = ref<HTMLDivElement|null>(null)
const toppingSlider = ref<HTMLDivElement|null>(null)
const toppingMenu = ref<HTMLButtonElement[]|null>(null)
const toppingSlideAmount = 100/topping.length
let outsideMain3Topping: HTMLButtonElement[]
let touchStart : number, touchEnd : number

onMounted(() => {
    gsap.set(toppingSlider.value, {
        x : `-${useToppingDisplay.toppingDisplay*toppingSlideAmount}%`
    })

    toppingMenu.value[useToppingDisplay.toppingDisplay-1] && gsap.set(toppingMenu.value[useToppingDisplay.toppingDisplay-1].children, {
        scale:  1.4,
        y: '10%',
    })
    toppingMenu.value[useToppingDisplay.toppingDisplay+1] && gsap.set(toppingMenu.value[useToppingDisplay.toppingDisplay+1].children, {
        scale: 1.4,
        y: '10%',
    })
    gsap.set(toppingMenu.value[useToppingDisplay.toppingDisplay].children, {
        scale: 2,
        y: '25%',
    })

    toppingContainer.value?.addEventListener('touchstart', e => {
        touchStart = e.changedTouches[0].screenX;
    })
    
    toppingContainer.value?.addEventListener('touchend', e => {
        touchEnd = e.changedTouches[0].screenX;
        swiped()
    })

    toppingContainer.value?.addEventListener('mousedown', e => {
        touchStart = e.clientX;
    })
    
    toppingContainer.value?.addEventListener('mouseup', e => {
        touchEnd = e.clientX;
        swiped()
    })
})

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

    const outsideMain3Topping: number[] = toppingMenu.value.map((tp, indx) => indx).filter(i => i !== useToppingDisplay.toppingDisplay-1 && i !== useToppingDisplay.toppingDisplay && i !== useToppingDisplay.toppingDisplay+1)
   
    outsideMain3Topping.forEach((i: number) => {
        gsap.to(toppingMenu.value[i].children, {
            scale:  1,
            y: '0%',
            ease: "power4.out",
            duration: .8,
        })
    });

    toppingMenu.value[useToppingDisplay.toppingDisplay-1] && gsap.to(toppingMenu.value[useToppingDisplay.toppingDisplay-1].children, {
        scale:  1.4,
        y: '10%',
        ease: "power4.out",
        duration: .8,
    })
    toppingMenu.value[useToppingDisplay.toppingDisplay+1] && gsap.to(toppingMenu.value[useToppingDisplay.toppingDisplay+1].children, {
        scale: 1.4,
        y: '10%',
        ease: "power4.out",
        duration: .8,
    })
    gsap.to(toppingMenu.value[useToppingDisplay.toppingDisplay].children, {
        scale: 2,
        y: '25%',
        ease: "power4.out",
        duration: .8,
    })
}

const totalSelectedToppingRef = ref<number>(0)
const toppingClick = (menu: string, i: number) => {
    if ( totalSelectedToppingRef.value === 3 && !topping[i].selected) return
    
    gsap.to(toppingMenu.value[i].children, {
        opacity: topping[i].selected ? 1 : .5,
        ease: "power4.out",
        duration: .4,
    })
    
    topping[i].selected = !topping[i].selected
    
    topping[i].selected ? useAddedTopping.addTopping(menu) : useAddedTopping.removeTopping(menu)
    
    totalSelectedToppingRef.value = topping.filter(top => top.selected === true).length
}
</script>

<template>
<div class="h-full flex flex-col justify-center items-center mb-5">
    <div class="text-center font-fancy text-[120%]">
        {{totalSelectedToppingRef}}/3
    </div>
    
    <div class="pt-1 relative topping-container" ref="toppingContainer">
        <img src="/curve.svg" class="absolute left-0 -bottom-[90%] w-full -translate-y-1/4 landscape:-translate-y-0"/>
        <div class="translate-x-[50%] -translate-y-[40%]">
            <div class="flex h-[10vh]"
                 :class="`w-[${topping.length*25}vw]`"
                 ref="toppingSlider">
                <button v-for="(top,i) in topping" 
                        :key="top.name"
                        class="-translate-x-[50%] flex justify-center items-center"
                        @click="i === useToppingDisplay.toppingDisplay && toppingClick(top.name,i)"
                        ref="toppingMenu">
                    <img :src="`/${top.imgTop}`" 
                         class="drop-shadow-lg origin-top w-[45%]"
                    >
                </button>
            </div>
        </div>
         <button class="bg-black bg-opacity-95 hover:bg-opacity-80 absolute left-1/2 rounded -bottom-[70%] -translate-x-1/2 flex justify-center items-center h-10 w-[38%] md:h-14 md:w-[22%] landscape:w-[30%] landscape:translate-y-[40%] py-5">
            <img src="/cart.svg" class="w-[16%] mr-3">
            <span class="text-white font-fancy md:text-[120%]">add to cart</span>
         </button>
    </div>
</div>
</template>

<style>
.topping-container{
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
}
</style>