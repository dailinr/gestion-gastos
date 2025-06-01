import { getRecursos } from "@/Services/recurso-service"
import type { Recursos, RecursosPaginacion } from "@/types"
import type { StateCreator } from "zustand"

export type recursoSliceType = {
    // recursosCompleto: RecursosPaginacion
    gastos: Recursos
    ingresos: Recursos
    fetchRecursos: () => Promise<void>
}

export const createRecursoSlice : StateCreator<recursoSliceType> = (set) => ({
    // recursosCompleto: {} as RecursosPaginacion,
    gastos: {} as Recursos,
    ingresos: {} as Recursos,

    fetchRecursos: async () => {
        const recursosCompleto = await getRecursos()
        set({ 
            // recursosCompleto,
            gastos: recursosCompleto?.resultados[0]?.gastos,
            ingresos: recursosCompleto?.resultados[0]?.ingresos,
        })
    }
})