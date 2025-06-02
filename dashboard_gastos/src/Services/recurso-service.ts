import { RecursoDraftSchema, RecursosPaginacionSchema } from '@/Schemas/recursoSchema';
import type { RecursoDraft, ResponseGasto, ResponseIngreso } from '@/types';
import axios from 'axios'

export async function getRecursos(){
    const url = `http://localhost:49151/api/cuentas/listar-semana/`

    try {
        const {data: response} = await axios.get(url);
        // console.log(response)

        const result = RecursosPaginacionSchema.safeParse(response)
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

export async function addRecurso(data: RecursoDraft, ruta: string){
    const isGasto = ruta.toLowerCase() === 'gasto';

    const url = isGasto  
        ? 'http://localhost:49151/api/gastos/add-gasto' 
        : 'http://localhost:49151/api/ingresos/add-ingreso' ;
    
    const parsed = RecursoDraftSchema.safeParse(data)

    if(!parsed.success){
        throw new Error("Datos inválidos");
    }

    try {

        if(isGasto){
            const {data: response} = await axios.post<ResponseGasto>(url, parsed.data);
            // console.log(response)
            return response
        } 
        else{
            const {data: response} = await axios.post<ResponseIngreso>(url, parsed.data);
            return response
        }
    } 
    catch (error: any) {
        if (error.response) {
            console.log(error.response.data)
            return error.response
        } 
        else {
            // Otro tipo de error (sin respuesta, por ejemplo de red)
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}