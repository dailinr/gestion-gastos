import { addRecurso, getRecursos, handleEliminar } from "@/Services/recurso-service"
import type { RecursoData, RecursoDraft, Recursos, RecursosPaginacion, ResponseGasto, ResponseIngreso } from "@/types"
import type { StateCreator } from "zustand"

export type recursoSliceType = {
    // recursosCompleto: RecursosPaginacion
    gastos: Recursos
    ingresos: Recursos
    fetchRecursos: () => Promise<void>
    fetchAddRecurso: (data: RecursoDraft, ruta: string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    eliminarRecurso: (id : RecursoData['_id'], ruta : string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    idActivo: RecursoData['_id']
}

export const createRecursoSlice : StateCreator<recursoSliceType> = (set) => ({
    // recursosCompleto: {} as RecursosPaginacion,
    gastos: {} as Recursos,
    ingresos: {} as Recursos,
    recursos: {} as RecursoDraft,
    idActivo: '',

    fetchRecursos: async () => {
        const recursosCompleto = await getRecursos()
        set({ 
            // recursosCompleto,
            gastos: recursosCompleto?.resultados[0]?.gastos,
            ingresos: recursosCompleto?.resultados[0]?.ingresos,
        })
    },

    fetchAddRecurso: async (data, ruta)  => {
        return await addRecurso(data, ruta)
    },

    eliminarRecurso: async (id, ruta) => {
        
        return await handleEliminar(id, ruta)
    }
})