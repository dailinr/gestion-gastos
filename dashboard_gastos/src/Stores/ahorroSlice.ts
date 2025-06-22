import { addAporteAhorro, metaExist, reporteAhorros } from "@/Services/ahorro-service"
import type { AporteDraft, AporteResponse, MetaAhorro, ReporteCompleto } from "@/types"
import type { StateCreator } from "zustand"

export type ahorroSliceType = {
   metaExist: boolean
   metasAhorro: MetaAhorro[]
   metaElegida: MetaAhorro['_id']
   progressAhorro: number
   reporteCompleto: ReporteCompleto
   metaDashboard: MetaAhorro
   loadingAhorros: boolean
   loadingReportes: boolean
   setMetaElegida: (meta: MetaAhorro['_id']) => void
   fetchMetaExist: () => Promise<void>
   fetchReportes: () => Promise<void>
   fetchAddAportes: (data: AporteDraft) => Promise<AporteResponse | undefined>
   setMetaDashboard: (id: MetaAhorro['_id']) => Promise<void>
   setProgress: () => void
}

export const createAhorroSlice: StateCreator<ahorroSliceType> = (set, get) => ({
   metaExist: false,
   metasAhorro: [],
   metaElegida: '',
   reporteCompleto: {} as ReporteCompleto,
   progressAhorro: 0,
   loadingAhorros: true,
   loadingReportes: true,
   metaDashboard: {} as MetaAhorro,

   fetchMetaExist: async () => {
      set({ loadingAhorros: true })
      const response = await metaExist(undefined)

      set({
         metaExist: response?.existe,
         metasAhorro: response?.metasAhorro,
         metaDashboard: response?.metaDashboard
      })

      if(get().metaExist){
         get().setProgress()
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
         console.log(response)
         set({ reporteCompleto: response })
      }
      set({ loadingReportes: false })
   },

   fetchAddAportes: async (data) => {
      return await addAporteAhorro(data)
   },

   setMetaDashboard: async(id) => {
      set({ loadingAhorros: true })
      const response = await metaExist(id)

      set({
         metaExist: response?.existe,
         metasAhorro: response?.metasAhorro,
         metaDashboard: response?.metaDashboard
      })

      if(get().metaExist){
         get().setProgress()
      }
   
      set({ loadingAhorros: false })
      // const metaDashboard = get().metasAhorro.find(meta => meta._id === (id ? id : get().metaDashboard))
   },

   setProgress: () => {
      if(get().metaDashboard){
         let progreso = (get().metaDashboard.sumaAportes / get().metaDashboard.valor) * 100
         let progresoInt = Math.trunc(progreso)
         set({ progressAhorro : progresoInt })
      }
   }
})