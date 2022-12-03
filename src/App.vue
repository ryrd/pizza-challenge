<script setup lang="ts">
import Header from './components/Header.vue';
import PizzaDisplay from './components/PizzaDisplay.vue';
import ToppingSlider from './components/ToppingSlider.vue';
import {data, topping} from './Data'

const titles = data.map(d => d.name)

</script>

<template>
<div class="bg-white h-screen w-screen flex flex-col">
  <Header :titles="titles"/>
  <pizzaDisplay :data="data"/>
  <toppingSlider :topping="topping"/>
</div>
</template>

<style>

</style>