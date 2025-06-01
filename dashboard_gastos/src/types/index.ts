import { z } from 'zod'
import { CuentaSemanaSchema } from '@/Schemas/cuentaSchema'
import type { RecursosPaginacionSchema, RecursosSchema } from '@/Schemas/recursoSchema'

export type Recurso = {
  id: number
  valor : number
  diaSemana: string
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

export type CuentaActual = z.infer<typeof CuentaSemanaSchema>

// export type GastosSemana = z.infer<typeof RecursosSemanaSchema>
// export type IngresosSemana = z.infer<typeof RecursosSemanaSchema>

export type RecursosPaginacion = z.infer<typeof RecursosPaginacionSchema>
export type Recursos = z.infer<typeof RecursosSchema>
