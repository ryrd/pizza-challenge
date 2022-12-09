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
        toppingDisplay : 2
    }),
    actions: {
        changeToppingDisplay(index : number){
            this.toppingDisplay += index
        }
    }
})

export const useAddedToppingStore = defineStore('addedTopping', {
    state: () => ({
        addedTopping : [],
        removedTopping : '' 
    }),
    actions: {
        addTopping(top : string){
            this.addedTopping.push(top)
        },
        removeTopping(top : string){
            this.addedTopping.splice(this.addedTopping.indexOf(top), 1)
            this.removedTopping = top
        }
    }
})