<script setup lang="ts">
import {useDisplayStore} from '../store/displayStore'

const {titles} = defineProps<{titles: string[]}>();
    
const currentDisplay = useDisplayStore()
</script>

<template>
    <header class="w-full relative flex justify-center mt-[5%] landscape:mt-[2%]">
        <div class="relative w-screen">
            <h2 v-for="(title, i) in titles" :key="title"
                class="absolute text-[9vw] md:text-[6vw] landscape:text-[3vw] font-bold left-1/2 -translate-x-1/2 font-fancy transition duration-500"
                :class="i == currentDisplay.display ? 'opacity-1' : 'opacity-0'" v>
                {{title}}
            </h2>
        </div>
        <img src="../assets/love.svg" 
             class="absolute h-6 md:h-10 top-[15%] right-[6%]">
    </header>
</template>
