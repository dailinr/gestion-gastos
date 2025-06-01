import axios from 'axios'
import { CuentaSemanaSchema } from '@/Schemas/cuentaSchema'

export async function getSemana() {
    const url = `http://localhost:49151/api/cuentas/calcular-semana`

    try {
        const {data: response} = await axios.get(url);
        // console.log(response)

        const result = CuentaSemanaSchema.safeParse(response)
        // console.log(result)

        if(result.success){
            return result.data 
        }
    } 
    catch (error: any) {
        if (error.response) {
            addSemana()
        } 
        else {
            // Otro tipo de error (sin respuesta, por ejemplo de red)
            console.error("Error desconocido:", error);
            throw error;
        }
    }
}

export async function addSemana() {
    const url = `http://localhost:49151/api/cuentas/add-cuenta`

    try {
        await axios.get(url);
        // return response.data;
        // console.log(response)
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