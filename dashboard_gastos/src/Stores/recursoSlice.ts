import { addRecurso, buscarGlobal, editarRecurso, filteredDate, getRecursos, handleEliminar } from "@/Services/recurso-service"
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
    setCurrentPage: (page: number, dataPage: number) => Promise<void>
    fetchAddRecurso: (data: RecursoDraft, ruta: string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    eliminarRecurso: (id : RecursoData['_id'], ruta : string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    setIdActivo: (id: RecursoData['_id']) => void
    fetchEditarRecurso: (data: RecursoDraft, ruta:string) => Promise<ResponseGasto | ResponseIngreso | undefined>
    fetchBuscar: (buscar : BuscarRecurso, keyRuta: string | null) => void
    fetchBuscarGlobal: (query: string, tipo: string | null) => Promise<void>
    filterDate: (date: Date | undefined, tipo: string | null) => Promise<void>
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
            const recursosCompleto = await getRecursos(null, 1);
            
            const nuevosGastos = recursosCompleto?.resultados[0]?.gastos
            const nuevosIngresos = recursosCompleto?.resultados[0]?.ingresos

            set({
                recursosCompleto,
                currentPage: recursosCompleto?.paginacion.totalPages,
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

    setCurrentPage: async (page, dataPage) => {
        set({ isLoading: true });

        try {
            const recursosCompleto = await getRecursos(page, dataPage);
            const nuevosIngresos: Recursos = recursosCompleto?.resultados[0]?.ingresos || {} as Recursos;
            const nuevosGastos: Recursos = recursosCompleto?.resultados[0]?.gastos || {} as Recursos;

            set((state) => {
                // detectar si se ha cambiado de semana (page)
                const esNuevaSemana = dataPage === 1;

                // si es nueva page entonces se setea los recursos "normal" de lo contrario se aumulan
                const ingresosAcumulados = esNuevaSemana ? nuevosIngresos.docs : [
                    ...state.ingresos.docs,
                    ...nuevosIngresos.docs.filter(n => !state.ingresos.docs.some(e => e._id === n._id))
                ];

                const gastosAcumulados = esNuevaSemana ? nuevosGastos.docs : [
                    ...state.gastos.docs,
                    ...nuevosGastos.docs.filter(n => !state.gastos.docs.some(e => e._id === n._id))
                ];

                const ingresosPaginacion : Recursos = {
                    docs: ingresosAcumulados,
                    totalDocs: nuevosIngresos.totalDocs,
                    totalPages: nuevosIngresos.totalPages,
                    page: nuevosIngresos.page,
                    limit: nuevosIngresos.limit,
                    hasPrevPage: nuevosIngresos.hasPrevPage,
                    hasNextPage: nuevosIngresos.hasNextPage,
                    prevPage: nuevosIngresos.prevPage,
                    nextPage: nuevosIngresos.nextPage,
                }

                const gastosPaginacion : Recursos = {
                    docs: gastosAcumulados,
                    totalDocs: nuevosGastos.totalDocs,
                    totalPages: nuevosGastos.totalPages,
                    page: nuevosGastos.page,
                    limit: nuevosGastos.limit,
                    hasPrevPage: nuevosGastos.hasPrevPage,
                    hasNextPage: nuevosGastos.hasNextPage,
                    prevPage: nuevosGastos.prevPage,
                    nextPage: nuevosGastos.nextPage,
                }

                return {
                    currentPage: page,
                    recursosCompleto,

                    ingresos: {
                        ...state.ingresos,
                        ...ingresosPaginacion
                    },

                    gastos: {
                        ...state.gastos,
                        ...gastosPaginacion
                    },

                    filterIngresos: {
                        ...state.ingresos,
                        ...ingresosPaginacion
                    },

                    filterGastos: {
                        ...state.gastos,
                        ...gastosPaginacion
                    }
                };
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

    filterDate: async (date, tipo) => {
        
        if(!date){
            set({ 
                filterIngresos: get().ingresos, filterGastos: get().gastos
            })
            return
        }

        if (date instanceof Date && !isNaN(date.getTime())) {
            set({ isLoading: true })
            const resultados = await filteredDate(date, tipo)
            
            if (tipo === 'gastos') {
                set({ filterGastos: resultados });
            } 
            else {
                set({ filterIngresos: resultados });
            }
            set({ isLoading: false }); 
        }
    }
})