import type { Recursos } from "@/types"
import type { StateCreator } from "zustand"

export type recursoSliceType = {
    recursos: Recursos
    fetchRecursos: () => Promise<void>
}

export const createRecursoSlice : StateCreator<recursoSliceType> = (set) => ({
    recursos: [],

    fetchRecursos: async () => {
        
    }
})