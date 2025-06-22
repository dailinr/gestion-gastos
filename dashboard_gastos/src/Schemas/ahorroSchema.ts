import { object, z } from 'zod'

export const MetaAhorroSchema = z.object({
    _id: z.string(),
    valor: z.number(),
    fecha: z.string(),
    motivo: z.string(),
    cumplida: z.boolean(),
    sumaAportes: z.number(),
    diferencia: z.number(),
    dashboard: z.boolean()
})

export const MetasAhorroSchema = z.array(MetaAhorroSchema)

export const ResponseMetaSchema = z.object({
    existe: z.boolean(),
    metasAhorro: MetasAhorroSchema,
    metaDashboard: MetaAhorroSchema
})

export const AporteAhorroSchema = z.object({
    _id: z.string(),
    valor: z.number(),
    fecha: z.string(),
    meta: z.string()
})

export const AporteDraftSchema = AporteAhorroSchema
    .omit({ _id: true, fecha: true}).extend({ fecha: z.date() })

export const MetaDraftSchema = MetaAhorroSchema
    .pick({ valor: true, motivo: true }).extend({ fecha: z.date() })

export const AportesAhorroSchema = z.array(AporteAhorroSchema)

export const ReporteAhorrosSchema = z.object({
    meta: MetaAhorroSchema,
    aportes: AportesAhorroSchema,
    cumplida: z.boolean(),
    sumaAportes: z.number()
})

export const AddMetaResponseSchema = object({
    status: z.string(),
    message: z.string(),
    ahorro: MetaAhorroSchema.omit({ diferencia: true })
})

export const AddAporteResponseSchema = object({
    status: z.string(),
    mensaje: z.string(),
    aporte: AporteAhorroSchema.omit({ meta: true }),
    meta: MetaAhorroSchema
})

export const ResponseMetaDashboard = z.object({
    status: z.string(),
    message: z.string(),
    metaDashboard: MetaAhorroSchema
})