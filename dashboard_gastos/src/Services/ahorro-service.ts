import { ReporteAhorrosSchema, ResponseMetaSchema } from "@/Schemas/ahorroSchema";
import type { MetaAhorro } from "@/types";
import axios from "axios";

export async function addMetaAhorro() {
    console.log("desde add meta ahorro")
}

export async function metaExist() {
    const url = `${import.meta.env.VITE_API_URL}ahorros/meta-exist`

    try {
        const {data: response} = await axios.get(url)
        // console.log(response)

        const result = ResponseMetaSchema.safeParse(response)
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