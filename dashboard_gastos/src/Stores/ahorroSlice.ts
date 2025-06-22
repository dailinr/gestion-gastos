import { addAporteAhorro, metaExist, reporteAhorros, setMetaDashboardPersistente } from "@/Services/ahorro-service"
import type { AporteDraft, AporteResponse, MetaAhorro, ReporteCompleto, ResponseMetaDashboard } from "@/types"
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
   setMetaDashboard: (id: MetaAhorro['_id']) => Promise<ResponseMetaDashboard | undefined>
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
      const response = await metaExist()

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

   setMetaDashboard: async(id) => {
      set({ loadingAhorros: true })

      const responseMeta = await setMetaDashboardPersistente(id); // POST para guardar en BD
      const response = await metaExist();    // Obtener ya marcada desde BD

      set({
         metaExist: response?.existe,
         metasAhorro: response?.metasAhorro,
         metaDashboard: response?.metaDashboard
      })

      if(get().metaExist){
         get().setProgress()
      }
      set({ loadingAhorros: false })
      return responseMeta
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

   setProgress: () => {
      if(get().metaDashboard){
         let progreso = (get().metaDashboard.sumaAportes / get().metaDashboard.valor) * 100
         let progresoInt = Math.trunc(progreso)
         set({ progressAhorro : progresoInt })
      }
   }
})