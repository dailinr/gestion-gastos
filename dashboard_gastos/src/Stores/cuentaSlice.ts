import { categories } from "@/data/categories"
import {getMes, getSemana } from "@/Services/cuenta-service"
import type { Category, CuentaActual, CuentaMes, DataDashboard, GastoReciente, ResumenMes, ResumeSemana } from "@/types"
import type { StateCreator } from "zustand"

export type cuentaSliceType = {
    modo: string
    cuentaActual: CuentaActual
    mesActual: CuentaMes
    data: DataDashboard
    cargandoDashboard: boolean
    categoriesDashboard: Category[]
    gastosRecientes: GastoReciente[]
    resume: ResumeSemana[] | ResumenMes
    setTab: (modo: string) => Promise<void>
    fetchSemana: () => Promise<void>
    fetchMes: () => Promise<void>
    setCategories: () => void
    setGastosRecientes: () => void
    setResumeSemana: () => void
}

export const createCuentaSlice : StateCreator<cuentaSliceType> = (set, get) => ({
    modo: '',
    cuentaActual: {} as CuentaActual,
    mesActual: {} as CuentaMes,
    data: {} as DataDashboard,
    categoriesDashboard: [],
    gastosRecientes: [],
    resume: [],
    cargandoDashboard: true,

    setTab: async (modo) => { 
        set({ cargandoDashboard: true })
        set({ modo })
        
        let data : DataDashboard

        get().setCategories()
        get().setGastosRecientes()

        if(get().modo === 'mes') {
            const mes = get().mesActual

            data = {
                totalIngresos: mes.totalIngresos,
                totalGastos: mes.totalGastos,
                totalAcumulado: mes.totalMensual,
                categorias: get().categoriesDashboard,
                recientes: get().gastosRecientes,
                resume: get().mesActual.resumenMensual,
            }
        }
        else{
            get().setResumeSemana()
            const semana = get().cuentaActual

            data = {
                totalIngresos: semana.totalIngresos,
                totalGastos: semana.totalGastos,
                totalAcumulado: semana.totalSemanal,
                categorias: get().categoriesDashboard,
                recientes: get().gastosRecientes,
                resume: get().resume,
            }
        }
        set({ data })
        set({ cargandoDashboard: false })
    },

    fetchSemana: async () => {
        const cuentaActual = await getSemana()
        
        set({ cuentaActual })
    },

    fetchMes: async () => {
        const mesActual = await getMes()

        set({ mesActual })
    },

    setCategories: () => {

        const gastos = get().modo === 'semana' 
            ? get().cuentaActual.categoriasGastos  // gastos individuales
            : get().mesActual.categoriasGastos;

        const nombresBase = categories.map(c => c.name.toLowerCase()); // categorias frontend
        const sinMatch = gastos.filter(g => !nombresBase.includes(g.etiqueta.toLowerCase()));

        const categoriesDashboard = categories.map(({ name, ...rest }) => {
            const nombre = name.toLowerCase();
            const match = gastos.find(g => g.etiqueta.toLowerCase() === nombre);

            return {
                name,
                ...rest,
                amount: 
                    match ?  match.totalCategoria : 
                    nombre === "otros" ? 
                    sinMatch.reduce((sum, g) => sum + g.totalCategoria, 0) : 0 // acumulador de otros
            };
        });

        set({ categoriesDashboard });
    },

    setGastosRecientes: () => {

        const gastosRecientes : GastoReciente[] = get().cuentaActual.gastos?.map(gasto => {

            const match = categories.find(c => 
                c.name.toLowerCase() === gasto.etiqueta.toLowerCase() 
            ) || categories.filter(c => c.name.toLowerCase() === "otros")[0] 

            return {
                _id: gasto._id,
                descripcion: gasto.descripcion,
                diaSemana: gasto.diaSemana,
                valor: gasto.valor,
                color: match.color ,
                colorText:  match.colorText,
                icon:  match.icon 
            }   

        }) || [];

        set({
            gastosRecientes: gastosRecientes.slice(0, 5)
        })
    },

    setResumeSemana: () => {

        const cuenta = get().cuentaActual;
        if (!cuenta) return;
        
        // const diasSemana =  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const diasSpanish = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        const normalizeDay = (day: string) => day.toLowerCase().trim();
        const normalizedDiasSemana = diasSpanish.map(normalizeDay);

        const ingresos = cuenta.ingresos || [];
        const gastos = cuenta.gastos || [];

        const resumeSemana = normalizedDiasSemana.map((dia, index) => {
            const ingresosDia = ingresos
                .filter((ingreso) => normalizeDay(ingreso.diaSemana) === dia) // Normalizar para comparar
                .reduce((acc, ingreso) => acc + ingreso.valor, 0); // se calcula el acumulado del dia
            
            const gastosDia = gastos
                .filter((gasto) => normalizeDay(gasto.diaSemana) === dia) // Normalizar para comparar
                .reduce((acc, gasto) => acc + gasto.valor, 0);

            return {
                day: diasSpanish[index],
                gasto: gastosDia,
                ingreso: ingresosDia
            }
        });

        set({ resume: resumeSemana });
    },

})