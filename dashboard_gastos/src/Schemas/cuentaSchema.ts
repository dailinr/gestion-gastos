import { z } from 'zod'

export const RecursoSemanaSchema =  z.object({
    _id: z.string(),
    etiqueta: z.string(),
    descripcion: z.string(),
    valor: z.number(),
    fecha: z.string(),
    cuenta: z.string(),
    diaSemana: z.string()
})

export const RecursoResponseSchema = RecursoSemanaSchema
    .extend({ _v: z.number() })
    .omit({ diaSemana: true})

export const RecursosSemanaSchema = z.array(RecursoSemanaSchema)

export const CategorySemanaSchema = z.array(
    z.object({
        id: z.string(),
        etiqueta: z.string(),
        totalCategoria: z.number()
    })
)

export const CuentaSemanaSchema = z.object({
    cuenta: z.object({
        _id: z.string(),
        fechaInicial: z.string(),
        fechaFinal: z.string(),
        semanal: z.number(),
    }),
    totalGastos: z.number(),
    totalIngresos: z.number(),
    totalSemanal: z.number(),
    gastos: RecursosSemanaSchema,
    ingresos: RecursosSemanaSchema,
    categoriasGastos: CategorySemanaSchema
})

export const resumenMensual = z.array(
    z.object({
        rango: z.string(),
        ingreso: z.number(),
        gasto: z.number()
    })
)

export const CuentaMesSchema = CuentaSemanaSchema.pick({ 
    totalGastos: true, totalIngresos: true, categoriasGastos: true
}).extend({
    totalMensual: z.number(),
    resumenMensual: resumenMensual
})