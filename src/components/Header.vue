<template>
    <header class="w-screen h-[50px] relative flex justify-center mt-7">
        <div class="relative w-screen">
            <h2 v-for="(title,i) in titles" :key="title"
                class="absolute text-3xl font-bold left-1/2 -translate-x-1/2 font-fancy transition"
                :class="i === active ? 'opacity-1' : 'opacity-0'">
                {{title}}
            </h2>
        </div>
        <img src="../assets/heart.png" 
             class="absolute h-[25px] right-6">
    </header>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const {titles} = defineProps<{titles: Array<string>}>();

let active = 0
</script>

<style scoped>

</style>