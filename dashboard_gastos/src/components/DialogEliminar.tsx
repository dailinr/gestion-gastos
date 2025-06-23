import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppStore } from "@/Stores/useAppStore"
import type { RecursoData } from "@/types"
import { toast } from "sonner"

export function DialogEliminar({ruta, id} : {ruta: string, id: RecursoData['_id']}) {

    const {eliminarRecurso, setCurrentPage, currentPage, fetchSemana} = useAppStore()
    
    const handleEliminar = async (id : RecursoData['_id']) => {
        const response = await eliminarRecurso(id, ruta)

        if(response?.status === "success"){
            toast.success(`${ruta} eliminado correctamente!`)
        }
        else{
            toast.error(`Falló al eliminar ${ruta}`)
        }
        await setCurrentPage(currentPage, 1)
        await fetchSemana()
    }

  return (
    <Dialog>
      <form>

        <DialogTrigger asChild>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5 text-red-400 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar {ruta}</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de querer eliminar este {ruta}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit"
                onClick={() => handleEliminar(id)}
            >Sí, seguro</Button>
          </DialogFooter>
        </DialogContent>

      </form>
    </Dialog>
  )
}
