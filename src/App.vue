<script setup lang="ts">
import Header from './components/Header.vue';
import PizzaDisplay from './components/PizzaDisplay.vue';

import {data, topping} from './Data'

// console.log({data, topping})
const titles = data.map(d => d.name)

</script>

<template>
  <div class="bg-white h-screen w-screen flex flex-col">
    <Header :titles="titles"/>
    <pizzaDisplay :data="data"/>
  </div>
</template>

<style>

</style>