import { z } from 'zod'
import { RecursoSemanaSchema } from './cuentaSchema'

const RecursosSchemaNuevo = z.array(RecursoSemanaSchema.omit({ diaSemana: true }))

export const Paginacion = z.object({
    totalDocs: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasPrevPage: z.boolean(),
    hasNextPage: z.boolean()
})

export const PaginacionRecurso = Paginacion.omit({ currentPage: true });

export const RecursosSchema =  z.object({
    docs: RecursosSchemaNuevo,
    ...PaginacionRecurso.shape,
    limit: z.number(),
    page: z.number()
})

export const Resultados = z.array(
    z.object({
        cuentaId: z.string(),
        fechaInicial: z.string(),
        fechaFinal: z.string(),
        totalIngresos: z.number(),
        totalGastos: z.number(),
        totalSemanal: z.number(),
        gastos: RecursosSchema,
        ingresos: RecursosSchema
    })
)

export const RecursosPaginacionSchema = z.object({
    paginacion: Paginacion,
    resultados: Resultados,
})


export const RecursoDraftSchema = RecursoSemanaSchema.pick({
    etiqueta: true,
    descripcion: true,
    valor: true,
})