import { metaExist, reporteAhorros } from "@/Services/ahorro-service"
import type { MetaAhorro, ReporteCompleto } from "@/types"
import type { StateCreator } from "zustand"

export type ahorroSliceType = {
   metaExist: boolean
   metasAhorro: MetaAhorro[]
   metaElegida: MetaAhorro['_id']
   progressAhorro: number
   reporteCompleto: ReporteCompleto
   loadingAhorros: boolean
   loadingReportes: boolean
   setMetaElegida: (meta: MetaAhorro['_id']) => void
   fetchMetaExist: () => Promise<void>
   fetchReportes: () => Promise<void>
   // fetchAddAportes: () => Promise<void>
}

export const createAhorroSlice: StateCreator<ahorroSliceType> = (set, get) => ({
   metaExist: false,
   metasAhorro: [],
   metaElegida: '',
   reporteCompleto: {} as ReporteCompleto,
   progressAhorro: 0,
   loadingAhorros: true,
   loadingReportes: true,

   fetchMetaExist: async () => {
      set({ loadingAhorros: true })
      const response = await metaExist()

      set({
         metaExist: response?.existe,
         metasAhorro: response?.metasAhorro
      })

      if (get().metaExist && get().metasAhorro) {
         const meta = get().metasAhorro.find(meta => meta.cumplida === false)

         if (meta) {
            set({ metaElegida: meta._id })
            await get().fetchReportes()
         }
      }
      set({ loadingAhorros: false })
   },

   setMetaElegida: (meta) => {
      set({ metaElegida: meta })
   },

   fetchReportes: async () => {
      set({ loadingReportes: true })

      if (get().metaElegida !== '') {
         const response = await reporteAhorros(get().metaElegida)

         set({ reporteCompleto: response })

         if(get().reporteCompleto){
            let progreso = (get().reporteCompleto.sumaReportes / get().reporteCompleto?.meta?.valor) * 100
            let progresoInt = Math.trunc(progreso)
            set({ progressAhorro : progresoInt })
         }
      }
      set({ loadingReportes: false })
   },

   // fetchAddAportes: async () => {
   //     await addMetaAhorro()
   // }
})