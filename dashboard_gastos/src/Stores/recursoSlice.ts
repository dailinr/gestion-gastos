import { formatDateTable } from "@/Services/formatDate"
import { addRecurso, editarRecurso, getRecursos, handleEliminar } from "@/Services/recurso-service"
import type { BuscarRecurso, RecursoData, RecursoDraft, Recursos, ResponseGasto, ResponseIngreso } from "@/types"
import { toast } from "sonner"
import type { StateCreator } from "zustand"

export type recursoSliceType = {
    // recursosCompleto: RecursosPaginacion
    gastos: Recursos
    ingresos: Recursos
    filterGastos: Recursos
    filterIngresos: Recursos
    idActivo: RecursoData['_id']
    fetchRecursos: () => Promise<void>
    fetchAddRecurso: (data: RecursoDraft, ruta: string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    eliminarRecurso: (id : RecursoData['_id'], ruta : string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    setIdActivo: (id: RecursoData['_id']) => void
    fetchEditarRecurso: (data: RecursoDraft, ruta:string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    fetchBuscar: (buscar : BuscarRecurso, keyRuta: string | null) => void
}

export const createRecursoSlice : StateCreator<recursoSliceType> = (set, get) => ({
    // recursosCompleto: {} as RecursosPaginacion,
    gastos: {} as Recursos,
    ingresos: {} as Recursos,
    recursos: {} as RecursoDraft,
    idActivo: '',
    filterGastos: {} as Recursos,
    filterIngresos: {} as Recursos,

    fetchRecursos: async () => {
        const recursosCompleto = await getRecursos()
        set({ 
            // recursosCompleto,
            gastos: recursosCompleto?.resultados[0]?.gastos,
            ingresos: recursosCompleto?.resultados[0]?.ingresos,
            filterGastos: get().gastos,
            filterIngresos: get().ingresos
        })

    },

    fetchAddRecurso: async (data, ruta)  => {
        return await addRecurso(data, ruta)
    },

    eliminarRecurso: async (id, ruta) => {
        return await handleEliminar(id, ruta)
    },

    setIdActivo: (id) => {
        set({ idActivo: id })
    },

    fetchEditarRecurso: async ( data, ruta) => {
        const activeId = get().idActivo;
        if (!activeId) {
            toast.error("No hay un recurso activo seleccionado para editar.");
            return;
        }
        return await editarRecurso(get().idActivo, data, ruta)
    },

    fetchBuscar: (buscar , keyRuta) => {

        if(buscar.value.trim() === ''){
            set({ 
                filterIngresos: get().ingresos, filterGastos: get().gastos
            })
            return
        }

        if(buscar.value !== ''){
            const recurso : Recursos = keyRuta === 'ingresos' ? get().ingresos : get().gastos
            const lowerSearch = buscar.value.toLowerCase()

            const filtered = recurso.docs.filter(dato => {
                const etiqueta = dato.etiqueta?.toLowerCase() || '';
                const descripcion = dato.descripcion?.toLowerCase() || '';
                const fecha = formatDateTable(dato.fecha ) || ''; // Formatear fecha
                const valor = dato.valor?.toString() || '';

                return (
                    etiqueta.includes(lowerSearch) ||
                    descripcion.includes(lowerSearch) ||
                    fecha.includes(lowerSearch) ||
                    valor.includes(lowerSearch)
                )
            })

            if(keyRuta === 'gastos'){
                set((state) => ({ 
                    filterGastos: {...state.gastos, docs: filtered}
                }))
            }
            else{
                set((state) => ({ 
                    filterIngresos: {...state.ingresos, docs: filtered}
                }))
            }
        }
    }
})