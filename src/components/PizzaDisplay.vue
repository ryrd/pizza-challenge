<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {useDisplayStore, useAddedToppingStore} from '../store/displayStore'
import gsap from 'gsap';

interface props {
    data: {
        name:string, 
        price: number, 
        img: string
    }[],
    topping: {
        name: string;
        price: number;
        imgTop: string;
        img: string;
        selected: boolean;
    }[]
}

const {data, topping} = defineProps<props>()

const currentDisplay = useDisplayStore()
const useAddedTopping = useAddedToppingStore()

const pizzaSlider = ref<HTMLDivElement|null>(null)
const pizzaSlideDetector = ref<HTMLDivElement|null>(null)

const plate = ref<HTMLImageElement|null>(null)
const leafage = ref<HTMLDivElement|null>(null)

const pizzaRef = ref<HTMLImageElement|null>(null)
const pizzaToppingRef = ref<HTMLDivElement|null>(null)

const totalToppingsPrice = ref<number>(0)

type sizeType = 'S' | 'M' | 'L'
let currentPizzaSize : 1 | 1.2 | 1.4 = 1
const pizzaSize = ref<sizeType>('S')
const addedSizePrice = ref<number>(0)

const orangeBtn = ref<HTMLButtonElement|null>(null)

const newPrice =  ref<number>(data[currentDisplay.display].price + addedSizePrice.value + totalToppingsPrice.value)
const oldPrice = ref<number>(data[currentDisplay.display].price + addedSizePrice.value + totalToppingsPrice.value) 

const counterAnim: Function = (start: number, end: number): void => {
    let startTimestamp: number = null;
    const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;

        const progress = (timestamp - startTimestamp) / 500;

        newPrice.value = parseFloat((progress*(end-start)+start).toFixed(2));
        
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
};

const setSize = (newSize: sizeType , increasePrice: number) => {
    pizzaSize.value = newSize
    addedSizePrice.value = increasePrice
    
    const pizzaResizeAnim = gsap.timeline()

    switch (newSize) {
        case 'S':
            currentPizzaSize = 1
            pizzaResizeAnim
                .to(plate.value, {
                    scale: 1,
                    ease: "power4.out",
                    duration: .8,
                })
                .to([pizzaRef.value, pizzaToppingRef.value], {
                    scale: currentPizzaSize,
                    ease: "power4.out",
                    duration: .8,
                }, '-=.6')
                .to(orangeBtn.value, {
                    left: '0%',
                    x: '0%',
                    ease: "power4.out",
                    duration: .8,
                },'-=1.8')
            break

        case 'M':
            currentPizzaSize = 1.2
            pizzaResizeAnim
                .to(plate.value, {
                    scale: 1.2,
                    ease: "power4.out",
                    duration: .8,
                })
                .to([pizzaRef.value, pizzaToppingRef.value], {
                    scale: currentPizzaSize,
                    ease: "power4.out",
                    duration: .8,
                }, '-=.6')
                .to(orangeBtn.value, {
                    left: '50%',
                    x: '-50%',
                    ease: "power4.out",
                    duration: .8,
                },'-=1.8')
            break

        case 'L':
            currentPizzaSize = 1.4
            pizzaResizeAnim
                .to(plate.value, {
                    scale: 1.4,
                    ease: "power4.out",
                    duration: .8,
                })
                .to([pizzaRef.value, pizzaToppingRef.value], {
                    scale: currentPizzaSize,
                    ease: "power4.out",
                    duration: .8,
                }, '-=.6')
                .to(orangeBtn.value, {
                    left: '100%',
                    x: '-100%',
                    ease: "power4.out",
                    duration: .8,
                },'-=1.8')
            break

        default:
            break
    }

    counterAnim(newPrice.value, data[currentDisplay.display].price+addedSizePrice.value+totalToppingsPrice.value)
}

let touchStart : number, touchEnd : number
onMounted(() => {
    pizzaSlideDetector.value?.addEventListener('touchstart', e => {
        touchStart = e.changedTouches[0].screenX;
    })

    pizzaSlideDetector.value?.addEventListener('touchend', e => {
        touchEnd = e.changedTouches[0].screenX;
        swiped()
    })

    pizzaSlideDetector.value?.addEventListener('mousedown', e => {
        touchStart = e.clientX;
    })
    
    pizzaSlideDetector.value?.addEventListener('mouseup', e => {
        touchEnd = e.clientX;
        swiped()
    })
})

let previousAddedLength: number,
    newAddedLength = 0

watch(useAddedTopping.addedTopping, () => {
    previousAddedLength = newAddedLength
    newAddedLength = useAddedTopping.addedTopping.length

    if (newAddedLength > previousAddedLength){
        const newAdded = useAddedTopping.addedTopping[useAddedTopping.addedTopping.length-1]
        gsap.fromTo(`#topping-${newAdded}`, 
        {   scale: currentPizzaSize*2.2   }, 
        {
            scale: currentPizzaSize*1,
            ease: "power4.out",
            duration: .8,  
        })
        gsap.to(`#topping-${newAdded}`, {
            opacity: 1,
            ease: "power4.out",
            duration: 1.2,
        })
        const toppingPrice = topping.find(top => top.name === newAdded).price
        totalToppingsPrice.value += toppingPrice
    }
    else if (newAddedLength < previousAddedLength){
        const removed = useAddedTopping.removedTopping
        gsap.to(`#topping-${removed}`, {
            scale: currentPizzaSize*2.2,
            ease: "power4.out",
            duration: .8,
        })
        gsap.to(`#topping-${removed}`, {
            opacity: 0,
            ease: "power4.out",
            duration: 1.2,
        })
        
        const toppingPrice = topping.find(top => top.name === removed).price
        totalToppingsPrice.value -= toppingPrice
    }

    counterAnim(newPrice.value, data[currentDisplay.display].price+addedSizePrice.value+totalToppingsPrice.value)
})

const swiped = () => {
    if (touchEnd < touchStart) {
        if (currentDisplay.display === data.length-1) return
        
        currentDisplay.changeDisplay(1)
        slidePizza('left')
    }
    
    if (touchEnd > touchStart) {
        if (currentDisplay.display === 0) return
        
        currentDisplay.changeDisplay(-1)
        slidePizza('right')
    }
}

const sliderTimelineAnim = gsap.timeline()

const slidePizza = (direction: 'left' | 'right') => {
    const orientation = window.matchMedia("(orientation: portrait)").matches ? 100 : 60

    sliderTimelineAnim
        .to([pizzaRef.value, pizzaToppingRef.value], {
            scale: currentPizzaSize*.8,
            ease: "power4.out",
            duration: .5,
        })
        .to([pizzaRef.value, pizzaToppingRef.value], {
            scale: currentPizzaSize,
            ease: "power4.out",
            duration: .5,
        }, '-=.4')
        .to(pizzaSlider.value, {
            x: `-${orientation*currentDisplay.display}vw`,
            ease: "power4.out",
            duration: .8,
        }, '<')

    if(direction === 'right'){
        gsap.to(plate.value, {
            rotate: '-=20deg',
            ease: "power4.out",
            duration: .8,
        })
        gsap.to(leafage.value, {
            rotate: '-=45deg',
            ease: "power4.out",
            duration: 1.2,
            delay: .1
        })
    }
    else if(direction === 'left'){
        gsap.to(plate.value, {
            rotate: '+=20deg',
            ease: "power4.out",
            duration: .8,
        })
        gsap.to(leafage.value, {
            rotate: '+=45deg',
            ease: "power4.out",
            duration: 1.2,
            delay: .1
        })
    }

    counterAnim(newPrice.value, data[currentDisplay.display].price+addedSizePrice.value+totalToppingsPrice.value)
}
</script>

<template>
<main class="relative h-full pt-[5%] landscape:pt-0 landscape:overflow-hidden">
    <div class="relative h-[50%] landscape:h-[65%] flex justify-center items-center">
        
        <div class="absolute left-1/2 -translate-x-1/2 w-[90%] landscape:w-[50%] h-[180%] landscape:h-[70%]" ref="leafage">
            <img src="/leaf.webp" class="drop-shadow-2xl w-8 absolute right-8 top-20">
            <img src="/leaf.webp" class="drop-shadow-2xl w-7 absolute right-20 top-6 rotate-45">
            <img src="/leaf.webp" class="drop-shadow-2xl w-8 absolute right-8 bottom-10 rotate-90">
            <img src="/leaf.webp" class="drop-shadow-2xl w-7 absolute left-12 bottom-24">
            <img src="/leaf.webp" class="drop-shadow-2xl w-5 absolute left-20 bottom-10 rotate-125">
            <img src="/leaf.webp" class="drop-shadow-2xl w-7 absolute left-8 bottom-12 rotate-45">
            <img src="/leaf.webp" class="drop-shadow-2xl w-5 absolute left-12 top-12 rotate-45">
            <img src="/leaf.webp" class="drop-shadow-2xl w-5 absolute left-1/2 bottom-1 rotate-90">
            <img src="/leaf.webp" class="drop-shadow-2xl w-5 absolute left-36 top-1 rotate-45">
        </div>

        <img src="/plate.webp"
             class="w-[60%] landscape:w-[40%] landscape:top-[15%] absolute drop-shadow-lg"
             ref="plate">

        <div class="w-full h-[200%] landscape:h-[100%] absolute left-1/2 -translate-x-1/2 z-20" ref="pizzaSlideDetector"/>

        <div class="absolute h-[90%] landscape:h-full top-0 left-0 flex items-center t-1/2 mt-[3%]"
             :class="`w-[${100*data.length}%]`"
             ref="pizzaSlider">

            <div v-for="pizza in data" :key="pizza.name"
                 class="w-screen landscape:w-[60vw] flex justify-center -translate-y-[3%] landscape:translate-y-[0%]">

                <img class="w-[55%] landscape:w-[35%]" :src="`/${pizza.img}`" ref="pizzaRef"/>

                <div v-for="top in topping" :key="top.name"
                     class="h-full absolute left-1/2 top-3 landscape:top-0 -translate-x-1/2 opacity-0 landscape:w-[35%] landscape:flex landscape:items-center" 
                     :id="`topping-${top.name}`"
                     ref="pizzaToppingRef">
                    <img :src="`/${top.img}`" class="absolute left-1/2 -translate-x-1/2">
                    <img :src="`/${top.img}`" class="rotate-180">
                </div>
            </div>

        </div>        
        
        <button class="absolute left-[18%] landscape:top-[55%] bg-white backdrop-blur opacity-90 flex justify-center items-center rounded-full shadow-xl w-8 h-8 p-1 -translate-x-4 border border-black border-opacity-5 z-30">
            <img src="/minus.svg" class="w-[80%]">
        </button>
        <button class="absolute right-[18%] landscape:top-[55%] bg-white backdrop-blur opacity-90 flex justify-center items-center rounded-full shadow-xl w-8 h-8 p-1 translate-x-4 border border-black border-opacity-5 z-30">
            <img src="/plus.svg" class="w-[80%]">
        </button>
        
    </div>

    <div class="flex justify-center items-center pt-[20%] landscape:pt-[8%]">
        <h2 class="text-[180%] font-fancy font-bold">
            ${{newPrice}}
        </h2>
    </div>

    <div class="flex justify-between items-center w-1/2 landscape:w-[35%] landscape:pt-[1%] max-w-md font-fancy relative left-1/2 -translate-x-1/2">
        <button class="rounded-full flex justify-center items-center h-10 w-10 p-3 mr-3 transition bg-transparent border border-black border-opacity-20 z-10"
                @click="setSize('S', 0)">
            S
        </button>
        <button class="rounded-full flex justify-center items-center h-10 w-10 p-3 m-3 transition bg-transparent border border-black border-opacity-20 z-10"
                @click="setSize('M', 1)">
            M
        </button>
        <button class="rounded-full flex justify-center items-center h-10 w-10 p-3 ml-3 transition bg-transparent border border-black border-opacity-20 z-10"
                @click="setSize('L', 1.5)">
            L
        </button>
        <button class="rounded-full absolute h-10 w-10 p-3 bg-yellow-500 z-0 transition-all duration-300 ease-in-out" ref="orangeBtn">
            &nbsp;
        </button>
    </div>
</main>
</template>

<style scoped>
.pizza-slides{
    -khtml-user-select: none;
    -o-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
</style>