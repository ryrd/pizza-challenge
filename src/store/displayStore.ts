import { defineStore } from "pinia";

export const useDisplayStore = defineStore('display', {
    state: () => ({
        display : 0
    }),
    actions: {
        changeDisplay(index : number){
            this.display += index
        }
    }
})

export const useToppingDisplayStore = defineStore('toppingDisplay', {
    state: () => ({
        toppingDisplay : 1
    }),
    actions: {
        changeToppingDisplay(index : number){
            this.toppingDisplay += index
        }
    }
})