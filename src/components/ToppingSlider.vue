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
const toppingSlideAmount = 100/topping.length
let currentToppingSize : 1 | 1.25 | 1.5 = 1

onMounted(() => {
    gsap.set(toppingSlider.value, {
        x : `-${useToppingDisplay.toppingDisplay*toppingSlideAmount}%`
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
}

const toppingMenu = ref<HTMLButtonElement[]|null>(null)
const toppingClick = (menu: string, i : number) => {
    const totalSelectedTopping = topping.filter(top => top.selected === true).length
    
    if ( totalSelectedTopping === 3 && !topping[i].selected) return
    
    gsap.to(toppingMenu.value[i], {
        opacity: !topping[i].selected ? .5 : 1,
        ease: "power4.out",
        duration: .4,
    })
    
    topping[i].selected = !topping[i].selected
    
}

</script>

<template>
<div class="pt-4">
    <div class="text-center font-fancy text-lg pt-8 pb-3">
        0/3
    </div>
    
    <div class="pt-1" ref="toppingContainer">
        <div class="translate-x-[50vw]">
            <div class="flex w-[150%]"
                 ref="toppingSlider">
                <button v-for="(top,i) in topping" 
                     :key="top.name"
                     class="px-[5vw] -translate-x-[50%]"
                     @click="i === useToppingDisplay.toppingDisplay && toppingClick(top.name,i)"
                     ref="toppingMenu">
                    <img :src="`src/assets/${top.img}`" 
                         class="drop-shadow-lg origin-top"
                    >
                </button>
            </div>
        </div>
    </div>
            <!-- :class="i === useToppingDisplay.toppingDisplay ? 
                           'h-24' : 
                           i === useToppingDisplay.toppingDisplay-1 || i === useToppingDisplay.toppingDisplay+1 ? 
                               'h-16' :
                               'h-12'" -->
</div>
</template>