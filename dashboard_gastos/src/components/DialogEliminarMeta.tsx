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
import { toast } from "sonner"

export function DialogEliminarMeta({id} : {id: string}) {

    const {fetchEliminarMeta, fetchMetaExist} = useAppStore()
    
    const handleEliminar = async (id : string) => {
        
        const response = await fetchEliminarMeta(id)

        if(response?.status === "success"){
            toast.success(response.mensaje)
        }
        else{
            toast.error(response?.mensaje)
        }
        await fetchMetaExist()
    }

  return (
    <Dialog>

        <DialogTrigger asChild>
          <Button size="sm" variant="destructive" >Eliminar</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar meta de ahorro</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de querer eliminar esta meta?
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

    </Dialog>
  )
}
