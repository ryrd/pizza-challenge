<script setup lang="ts">
import { defineProps } from 'vue'
import {useDisplayStore} from '../store/displayStore'

const {titles} = defineProps<{titles: Array<string>}>();
    
const currentDisplay = useDisplayStore()
</script>

<template>
    <header class="w-screen h-[50px] relative flex justify-center mt-7">
        <div class="relative w-screen">
            <h2 v-for="(title, i) in titles" :key="title"
                class="absolute text-[9vw] font-bold left-1/2 -translate-x-1/2 font-fancy transition duration-500"
                :class="i == currentDisplay.display ? 'opacity-1' : 'opacity-0'">
                {{title}}
            </h2>
        </div>
        <img src="../assets/heart.png" 
             class="absolute h-[8vw] right-6">
    </header>
</template>
