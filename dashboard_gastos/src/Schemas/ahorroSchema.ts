import { z } from 'zod'

export const MetaAhorroSchema = z.object({
    _id: z.string(),
    valor: z.number(),
    fecha: z.string(),
    motivo: z.string(),
    cumplida: z.boolean()
})

export const MetasAhorroSchema = z.array(MetaAhorroSchema)

export const ResponseMetaSchema = z.object({
    existe: z.boolean(),
    metasAhorro: MetasAhorroSchema
})

export const AporteAhorroSchema = z.object({
    _id: z.string(),
    valor: z.number(),
    fecha: z.string(),
    meta: z.string()
})

export const AportesAhorroSchema = z.array(AporteAhorroSchema)

export const ReporteAhorrosSchema = z.object({
    meta: MetaAhorroSchema,
    aportes: AportesAhorroSchema,
    cumplida: z.boolean(),
    sumaReportes: z.number()
})