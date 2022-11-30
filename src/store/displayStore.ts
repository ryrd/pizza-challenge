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