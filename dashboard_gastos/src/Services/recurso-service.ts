import { RecursoDraftSchema, RecursosPaginacionSchema, RecursosSchema } from '@/Schemas/recursoSchema';
import type { RecursoData, RecursoDraft, ResponseGasto, ResponseIngreso } from '@/types';
import axios from 'axios'

export async function getRecursos(page: number | null, dataPage: number){

    const url = page 
        ? `${import.meta.env.VITE_API_URL}cuentas/listar-semana/${page}/${dataPage}` 
        : `${import.meta.env.VITE_API_URL}cuentas/listar-semana/` 

    try {

        const {data: response} = await axios.get(url);
        // console.log(response)

        const result = RecursosPaginacionSchema.safeParse(response)
        // console.log(result)

        if (result.success) {
            return result.data
        }

        throw new Error("Respuesta no tiene la forma esperada");
    } 
    catch (error: any) {
        if (error.response) {
            console.log(error.response.data)
        } 
        else {
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}

export async function addRecurso(data: RecursoDraft, ruta: string){
    const isGasto = ruta.toLowerCase() === 'gasto';

    const url = isGasto  
        ? `${import.meta.env.VITE_API_URL}gastos/add-gasto`
        : `${import.meta.env.VITE_API_URL}ingresos/add-ingreso`

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
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}

export async function handleEliminar(id: RecursoData['_id'], ruta : string){
    const isGasto = ruta === 'gasto'

    const url = isGasto  
        ? `${import.meta.env.VITE_API_URL}gastos/eliminar-gasto/${id}`
        : `${import.meta.env.VITE_API_URL}ingresos/eliminar-ingreso/${id}`

    try {

        if(isGasto){
            const {data: response} = await axios.delete<ResponseGasto>(url);
            // console.log(response)
            return response
        }else{
            const {data: response} = await axios.delete<ResponseIngreso>(url);
            // console.log(response)
            return response
        }
    } 
    catch (error: any) {
        if (error.response) {
            console.log(error.response.data)
            return error.response
        } 
        else {
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}

export async function editarRecurso(id: RecursoData['_id'], data: RecursoDraft, ruta : string){
    const isGasto = ruta.toLowerCase() === 'gasto'

    const url = isGasto  
        ? `${import.meta.env.VITE_API_URL}gastos/editar-gasto/${id}`
        : `${import.meta.env.VITE_API_URL}ingresos/editar-ingreso/${id}`

    try {

        if(isGasto){
            const {data: response} = await axios.put<ResponseGasto>(url, data);
            // console.log(response)
            return response
        }else{
            const {data: response} = await axios.put<ResponseIngreso>(url, data);
            // console.log(response)
            return response
        }
    } 
    catch (error: any) {
        if (error.response) {
            console.log(error.response.data)
            return error.response
        } 
        else {
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}

export async function buscarGlobal(query: string, tipo: string | null){

    const url = `${import.meta.env.VITE_API_URL}cuentas/buscar?q=${query}&tipo=${tipo}&page=1&limit=10`;
    try {
        
        const {data: response} = await axios.get(url); 
        // console.log(response)

        const result = RecursosSchema.safeParse(response.resultados)
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
            console.error("Error en la búsqueda global:", error);
            throw error;
        }
    }
}

export async function filteredDate(date: Date, tipo: string | null) {
    const fechaISO = date.toISOString()
    const url = `${import.meta.env.VITE_API_URL}cuentas/filtered-date?date=${fechaISO}&tipo=${tipo}&page=1&limit=10`;
    
    try {
        
        const {data: response} = await axios.get(url); 
        // console.log(response)

        const result = RecursosSchema.safeParse(response.resultados)
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
            console.error("Error en filtrar por fecha", error);
            throw error;
        }
    }
}