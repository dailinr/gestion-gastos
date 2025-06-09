import { addRecurso, buscarGlobal, editarRecurso, getRecursos, handleEliminar } from "@/Services/recurso-service"
import type { BuscarRecurso, RecursoData, RecursoDraft, Recursos, RecursosPaginacion, ResponseGasto, ResponseIngreso } from "@/types"
import { toast } from "sonner"
import type { StateCreator } from "zustand"

export type recursoSliceType = {
    recursosCompleto: RecursosPaginacion
    currentPage: number
    gastos: Recursos
    ingresos: Recursos
    filterGastos: Recursos
    filterIngresos: Recursos
    idActivo: RecursoData['_id']
    isLoading: boolean
    fetchRecursos: () => Promise<void>
    setCurrentPage: (page: number) => Promise<void>
    fetchAddRecurso: (data: RecursoDraft, ruta: string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    eliminarRecurso: (id : RecursoData['_id'], ruta : string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    setIdActivo: (id: RecursoData['_id']) => void
    fetchEditarRecurso: (data: RecursoDraft, ruta:string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    fetchBuscar: (buscar : BuscarRecurso, keyRuta: string | null) => void
    fetchBuscarGlobal: (query: string, tipo: string | null) => Promise<void>
}

export const createRecursoSlice : StateCreator<recursoSliceType> = (set, get) => ({
    recursosCompleto: {} as RecursosPaginacion,
    currentPage: 1,
    gastos: {} as Recursos,
    ingresos: {} as Recursos,
    recursos: {} as RecursoDraft,
    idActivo: '',
    filterGastos: {} as Recursos,
    filterIngresos: {} as Recursos,
    isLoading: true,

    fetchRecursos: async () => {
        set({ isLoading: true })
        try {
            const recursosCompleto = await getRecursos(null);
            
            const nuevosGastos = recursosCompleto?.resultados[0]?.gastos
            const nuevosIngresos = recursosCompleto?.resultados[0]?.ingresos

            set({
                recursosCompleto,
                gastos: nuevosGastos,
                ingresos: nuevosIngresos,
                filterGastos: nuevosGastos,
                filterIngresos: nuevosIngresos,
            });

        } catch (error) {
            console.error("Error al obtener recursos:", error);
        } finally {
            set({ isLoading: false })
        }
    },

    setCurrentPage: async (page) => {
        set({ isLoading: true });
        try {
            const recursosCompleto = await getRecursos(page);
            const nuevosGastos = recursosCompleto?.resultados[0]?.gastos;
            const nuevosIngresos = recursosCompleto?.resultados[0]?.ingresos;

            set({
                currentPage: page,
                recursosCompleto,
                gastos: nuevosGastos,
                ingresos: nuevosIngresos,
                filterGastos: nuevosGastos,
                filterIngresos: nuevosIngresos,
            });
        } catch (error) {
            console.error("Error al cambiar de página:", error);
        } finally {
            set({ isLoading: false });
        }
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

        const recurso : Recursos = keyRuta === 'ingresos' ? get().ingresos : get().gastos
        if (!recurso?.docs) return;
        const lowerSearch = buscar.value.toLowerCase()

        const filtered = recurso.docs.filter(dato => {
            const etiqueta = dato.etiqueta?.toLowerCase() || '';
            const descripcion = dato.descripcion?.toLowerCase() || '';
            // const fecha = formatDateTable(dato.fecha ) || ''; // Formatear fecha
            const valor = dato.valor?.toString() || '';

            return (
                etiqueta.includes(lowerSearch) ||
                descripcion.includes(lowerSearch) ||
                // fecha.includes(lowerSearch) ||
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
    },

    fetchBuscarGlobal: async (query, tipo) => {
        if (!tipo) return;

        if(query.trim() == ''){
            set({ 
                filterIngresos: get().ingresos, filterGastos: get().gastos
            })
            return
        }

        set({ isLoading: true });
        const resultados = await buscarGlobal(query, tipo)

        if (tipo === 'gastos') {
            set({ filterGastos: resultados });
        } 
        else {
            set({ filterIngresos: resultados });
        }
        
        set({ isLoading: false });
        
    },
})