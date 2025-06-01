import { categories } from "@/data/categories"
import {getSemana } from "@/Services/cuenta-service"
import type { Category, CuentaActual, GastoReciente, ResumeSemana } from "@/types"
import type { StateCreator } from "zustand"

export type cuentaSliceType = {
    cuentaActual: CuentaActual
    fetchSemana: () => Promise<void>
    categoriesSemana: Category[]
    setCategories: () => void
    gastosRecientes: GastoReciente[]
    setGastosRecientes: () => void
    resumeSemana: ResumeSemana[]
    setResumeSemana: () => void
}

export const createCuentaSlice : StateCreator<cuentaSliceType> = (set, get) => ({
    cuentaActual: {} as CuentaActual,
    categoriesSemana: [],
    gastosRecientes: [],
    resumeSemana: [],

    fetchSemana: async () => {
        const cuentaActual = await getSemana()
        set({
            cuentaActual
        })
    },

    setCategories: () => {

        const gastos = get().cuentaActual.categoriasGastos || []; // gastos individuales
        const nombresBase = categories.map(c => c.name.toLowerCase()); // categorias frontend
        const sinMatch = gastos.filter(g => !nombresBase.includes(g.etiqueta.toLowerCase()));

        const categoriesSemana = categories.map(({ name, ...rest }) => {
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

        set({ categoriesSemana });
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
            gastosRecientes
        })
    },

    setResumeSemana: () => {

        const diasSemana =  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const diasSpanish = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
        const normalizeDay = (day:string) => day.toLowerCase().trim();
        const normalizedDiasSemana = diasSemana.map(normalizeDay);

        const ingresos = get().cuentaActual.ingresos || [];
        const gastos = get().cuentaActual.gastos || [];

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

        set({ resumeSemana })
    }

})