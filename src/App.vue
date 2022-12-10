<script setup lang="ts">
import Header from './components/Header.vue';
import PizzaDisplay from './components/PizzaDisplay.vue';
import ToppingSlider from './components/ToppingSlider.vue';
import {data, topping} from './Data'

const titles = data.map(d => d.name)
</script>

<template>
<div class="bg-white h-screen w-screen grid-area">
  <div class="grid-top">
    <Header :titles="titles"/>
  </div>
  <div class="grid-center">
    <pizzaDisplay :data="data" :topping="topping"/>
  </div>
  <div class="grid-bottom">
    <toppingSlider :topping="topping"/>
  </div>
</div>
</template>

<style>
.grid-area{
  display: grid;
  grid-template-areas: "grid-top"
                       "grid-center"
                       "grid-bottom";
}

@media (orientation: landscape) {
  .grid-area{
    grid-template-areas: "grid-top grid-top" 
                         "grid-center grid-bottom";
  }
  .grid-top{
    width: 100vw;
    height: 15vh;
    /* background: yellow; */
  }
  .grid-center{
    width: 60vw;
    height: 85vh;
    background: orange;
  }
  .grid-bottom{
    width: 35vw;
    height: 85vh;
    background: blue;
  }
}

.grid-top{
  grid-area: grid-top;
}

.grid-center{
  grid-area: grid-center;
}

.grid-bottom{
  grid-area: grid-bottom;
}
</style>