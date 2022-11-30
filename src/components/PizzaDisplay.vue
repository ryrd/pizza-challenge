<template>
    <main class="relative h-[70vh] pt-12">
        <div class="relative h-[50%] flex justify-center items-center">
            
            <div class="absolute left-0 w-screen h-full">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-8 absolute right-8 top-20">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-7 absolute right-20 top-6 rotate-45">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-8 absolute right-8 bottom-10 rotate-90">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-7 absolute left-12 bottom-24">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-5 absolute left-20 bottom-10 rotate-125">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-7 absolute left-8 bottom-12 rotate-45">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-5 absolute left-12 top-12 rotate-45">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-5 absolute left-1/2 bottom-1 rotate-90">
                <img src="../assets/leaf.webp" class="drop-shadow-2xl w-5 absolute left-36 top-1 rotate-45">
            </div>

            <img src="../assets/plate.webp"
                 class="w-[60%] absolute t-1/2 drop-shadow-lg"
                 ref="plate">
            
            <div class="absolute h-[90%] top-0 left-0 flex items-center t-1/2 mt-[3%]"
            :class="`w-[${100*data.length}%]`"
            ref="pizzaSlider">

                <div v-for="pizza in data" :key="pizza.name"
                    class="w-screen flex justify-center">
                    <img class="w-[55%]" :src="`src/assets/${pizza.img}`" ref="pizzaRef">
                </div>

            </div>
            
            <div class="absolute left-0 w-screen h-full flex justify-around items-center">
                <button class="bg-white backdrop-blur opacity-90 flex justify-center items-center rounded-full shadow-xl w-8 h-8 p-1 -translate-x-4 border border-black border-opacity-5">
                    <img src="../assets/minus.svg" class="w-[80%]">
                </button>
                <button class="bg-white backdrop-blur opacity-90 flex justify-center items-center rounded-full shadow-xl w-8 h-8 p-1 translate-x-4 border border-black border-opacity-5">
                    <img src="../assets/plus.svg" class="w-[80%]">
                </button>
            </div>

        </div>

        <div class="flex justify-center items-center pt-12">
            <h2 class="text-[10vw] font-fancy font-bold text-4xl">
                {{data[active].price + addedSizePrice}}
            </h2>
        </div>

        <div class="flex justify-center items-center pt-3 font-fancy">
            <button class="rounded-full flex justify-center items-center h-10 w-10 p-3 m-3 transition"
                    :class="pizzaSize === 'S' ? 'bg-orange-600 text-white font-bold' : 'bg-white border border-black border-opacity-20'"
                    @click="setSize('S', 0)">
                S
            </button>
            <button class="rounded-full flex justify-center items-center h-10 w-10 p-3 m-3 transition"
                    :class="pizzaSize === 'M' ? 'bg-orange-600 text-white font-bold' : 'bg-white border border-black border-opacity-20'"
                    @click="setSize('M', 1)">
                M
            </button>
            <button class="rounded-full flex justify-center items-center h-10 w-10 p-3 m-3 transition"
                    :class="pizzaSize === 'L' ? 'bg-orange-600 text-white font-bold' : 'bg-white border border-black border-opacity-20'"
                    @click="setSize('L', 1.5)">
                L
            </button>
        </div>

    </main>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import gsap from 'gsap';

interface props {
    data: Array<{
        name:string, 
        price: number, 
        img: string
    }>
}
const {data} = defineProps<props>()

const pizzaSlider = ref<HTMLDivElement|null>(null)
const plate = ref<HTMLImageElement|null>(null)
const pizzaRef = ref<HTMLImageElement|null>(null)
const pizzaResizeAnim = gsap.timeline();
const active = 0

type sizeType = 'S' | 'M' | 'L'

const pizzaSize = ref<sizeType>('S')

const addedSizePrice = ref<number>(0)

const setSize = (newSize: sizeType , increasePrice: number) => {
    pizzaSize.value = newSize
    addedSizePrice.value = increasePrice

    switch (newSize) {
        case 'S':
            pizzaResizeAnim
                .to(plate.value, {
                    scale: 1,
                    ease: "power4.out",
                    duration: .8,
                })
                .to(pizzaRef.value, {
                    scale: 1,
                    ease: "power4.out",
                    duration: .8,
                }, '-=.6')
            break

        case 'M':
            pizzaResizeAnim
                .to(plate.value, {
                    scale: 1.25,
                    ease: "power4.out",
                    duration: .8,
                }).to(pizzaRef.value, {
                    scale: 1.25,
                    ease: "power4.out",
                    duration: .8,
                }, '-=.6')
            break

        case 'L':
            pizzaResizeAnim
                .to(plate.value, {
                    scale: 1.5,
                    ease: "power4.out",
                    duration: .8,
                }).to(pizzaRef.value, {
                    scale: 1.5,
                    ease: "power4.out",
                    duration: .8,
                }, '-=.6')
            break

        default:
            break
    }
}

// onMounted(() => {
//     gsap.to(pizzaSlider.value, {
//         x: `-${100*active}vw`,
//         ease: "power4.out",
//         duration: .8,
//     })
// })
</script>

<style scoped>
</style>