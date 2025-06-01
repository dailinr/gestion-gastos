import { RecursosPaginacionSchema } from '@/Schemas/recursoSchema';
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