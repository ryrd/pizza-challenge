<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useToppingDisplayStore} from '../store/displayStore'
import gsap from 'gsap';

interface toppingProps {
    topping: Array<{
        name : string,
        price : number,
        img: string
    }>
}

const {topping} = defineProps<toppingProps>()

const useToppingDisplay = useToppingDisplayStore()

const toppingSlider = ref<HTMLDivElement|null>(null)
let currentToppingSize : 1 | 1.25 | 1.5 = 1

onMounted(() => {
    toppingSlider.value?.addEventListener('touchstart', e => {
        touchStart = e.changedTouches[0].screenX;
    })

    toppingSlider.value?.addEventListener('touchend', e => {
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
    
    if (touchEnd > touchStart) {
        if (useToppingDisplay.toppingDisplay === 0) return
        
        useToppingDisplay.changeToppingDisplay(-1)
        slideTopping('right')
    }
}
const slideTopping = (direction: 'left' | 'right') => {
    console.log(direction)
}

</script>

<template>
<div class="pt-4">
    <div class="text-center font-fancy text-lg pt-8">
        0/3
    </div>

    <div class="flex pt-1" ref="toppingSlider">
        <img v-for="(top,i) in topping" 
             :key="top.name"
             :src="`src/assets/${top.img}`" 
             class="mr-[5vw] h-12 drop-shadow-lg transition duration-500 ease-in-out"
             :class="i === useToppingDisplay.toppingDisplay ? 
                            'h-24' : 
                            i === useToppingDisplay.toppingDisplay-1 || i === useToppingDisplay.toppingDisplay+1 ? 
                                'h-16' :
                                'h-12'"
             >
    </div>
</div>
</template>

<!--  -->