import { z } from 'zod'
import { CuentaSemanaSchema, RecursoResponseSchema } from '@/Schemas/cuentaSchema'
import type { Paginacion, RecursoDraftSchema, RecursoSchemaNuevo, RecursosPaginacionSchema, RecursosSchema } from '@/Schemas/recursoSchema'
import type { AddAporteResponseSchema, AporteAhorroSchema, AporteDraftSchema, MetaAhorroSchema, ReporteAhorrosSchema } from '@/Schemas/ahorroSchema'

export type Recurso = {
  id: number
  valor : number
  diaSemana: string
}

export type BuscarRecurso = {
  modo: string
  value: string
}

export type Category = {
  id: number
  name: string
  icon: string
  amount: number
  color: string
  colorText: string
  hex: string
}

export type GastoReciente = {
  _id: string
  color: string
  colorText: string
  descripcion: string
  diaSemana: string
  valor: number,
  icon: string
}

export type ResumeSemana = {
  day: string
  gasto: number
  ingreso: number
}

export type ResponseIngreso = {
  status: string,
  mensaje: string,
  ingreso: RecursoResponse
}

export type ResponseGasto = {
  status: string,
  mensaje: string,
  gasto: RecursoResponse
}

export type CuentaActual = z.infer<typeof CuentaSemanaSchema>

export type RecursosPaginacion = z.infer<typeof RecursosPaginacionSchema>
export type PaginationTypes = z.infer<typeof Paginacion>
export type Recursos = z.infer<typeof RecursosSchema>
export type RecursoData = z.infer<typeof RecursoSchemaNuevo>
export type RecursoDraft = z.infer<typeof RecursoDraftSchema>
export type RecursoResponse = z.infer<typeof RecursoResponseSchema>

export type MetaAhorro = z.infer<typeof MetaAhorroSchema>
export type AporteAhorro = z.infer<typeof AporteAhorroSchema>
export type ReporteCompleto = z.infer<typeof ReporteAhorrosSchema>
export type AporteDraft = z.infer<typeof AporteDraftSchema>
// export type AporteDraft = Omit<AporteAhorro, '_id' | 'fecha'> & { fecha: Date}
export type AporteResponse = z.infer<typeof AddAporteResponseSchema>