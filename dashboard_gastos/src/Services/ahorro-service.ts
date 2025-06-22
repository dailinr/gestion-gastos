import { AporteDraftSchema, ReporteAhorrosSchema, ResponseMetaSchema } from "@/Schemas/ahorroSchema";
import type { AporteDraft, AporteResponse, MetaAhorro, ResponseMetaDashboard } from "@/types";
import axios from "axios";

export async function metaExist() {
    const url = `${import.meta.env.VITE_API_URL}ahorros/meta-exist`
    
    try {
        const {data: response} = await axios.get(url)
        // console.log(response)

        const result = ResponseMetaSchema.safeParse(response)
        // console.log("resul: ", result)

        if(result.success){
            return result.data
        }
    } 
    catch (error: any) {
        if (error.response) {
            console.log(error.response.data)
        } 
        else {
            // Otro tipo de error (sin respuesta, por ejemplo de red)
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}

export async function setMetaDashboardPersistente(idDashboard: string) {
    const url = `${import.meta.env.VITE_API_URL}ahorros/meta-dashboard`;

    if(!idDashboard || typeof(idDashboard) !== 'string'){
        throw new Error("Datos invalidos")
    }

    try{
        const { data: response } = await axios.post<ResponseMetaDashboard>(url, { idDashboard });
        // console.log(response)

        return response;
    }
    catch(error: any){
        if (error.response) {
            console.log("error: ", error.response.data)
            return error.response
        } 
        else {
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}

export async function reporteAhorros (id: MetaAhorro['_id']) {
    const url = `${import.meta.env.VITE_API_URL}ahorros/reporte-ahorros/${id}`
    
    try {
        const {data: response} = await axios.get(url)
        // console.log(response)

        const result = ReporteAhorrosSchema.safeParse(response)
        // console.log(result)

        if(result.success){
            return result.data
        }
    } 
    catch (error: any) {
        if (error.response) {
            console.log(error.response.data)
        } 
        else {
            // Otro tipo de error (sin respuesta, por ejemplo de red)
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}

export async function addAporteAhorro(data: AporteDraft) {

    const url = `${import.meta.env.VITE_API_URL}ahorros/add-aporte`

    const parsed = AporteDraftSchema.safeParse(data)
    // console.log(parsed)

    if(!parsed.success){
        throw new Error("Datos invalidos")
    }

    try {
        const {data: response } = await axios.post<AporteResponse>(url, parsed.data)
        // console.log(response)

        return response
    } 
    catch (error: any) {
        if (error.response) {
            console.log("error: ", error.response.data)
            return error.response
        } 
        else {
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}