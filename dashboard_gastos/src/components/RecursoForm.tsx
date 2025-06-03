import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import * as DialogPrimitive from "@radix-ui/react-dialog"
// import { DatePicker } from "./DatePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories, categoriesIngresos } from "@/data/categories"
import { useForm, Controller} from "react-hook-form"
import type { RecursoDraft, Recursos } from "../Types/index"
import { useAppStore } from "@/Stores/useAppStore"
import { toast } from "sonner"
import { useEffect } from "react"
import { Spinner } from "./Spinner"

type modalProps = {
  pathname: string
  type: string
}

export function ModalForm({ pathname, type }: modalProps) {

  const isEditar = type === 'editar'
  const ruta = pathname === '/gastos' ? 'Gasto' : 'Ingreso'
  const categoriesSelect = ruta === 'Gasto' ? categories : categoriesIngresos

  const {fetchAddRecurso, fetchRecursos, setIdActivo, 
    idActivo, fetchEditarRecurso, gastos, ingresos } = useAppStore()
  const { handleSubmit, control, formState: { errors }, reset } = useForm<RecursoDraft>({
    defaultValues: {
      valor: 0,
      etiqueta: "",
      descripcion: "",
    }
  })

  const data : Recursos = ruta === 'Gasto' ? gastos : ingresos

  if(!data){
    return ( <Spinner /> )
  }

  useEffect(() => {
    if (idActivo) {
      const recurso = data?.docs.find(r => r._id === idActivo);
      if (recurso) {
        reset({
          valor: recurso.valor,
          descripcion: recurso.descripcion,
          etiqueta: recurso.etiqueta,
        });
      }
      
    } else reset();

  }, [idActivo, data, reset]);


  const registerRecurso = async (data: RecursoDraft) => {
    let response 

    if(!idActivo) {
      response = await fetchAddRecurso(data, ruta)

      if(response?.status === "success"){    
        toast.success(`${ruta} agregado correctamente!`) 
        fetchRecursos()
      }
      else{
        toast.error(`Error al agregar ${ruta}!`) 
      }
    }
    else{
      const recursoActualizado = {
        ...data,
        _id: idActivo
      }
      response = await fetchEditarRecurso(recursoActualizado, ruta)

      if(response?.status === "success"){    
        toast.success(`${ruta} actualizado correctamente!`) 
        fetchRecursos()
      }
      else{
        toast.error(`Error al actualizar ${ruta}!`) 
      }
    }
    reset()
    setIdActivo('')
  }


  return (
    <Dialog >

      <DialogTrigger asChild>
        {isEditar ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5 text-blue-800 cursor-pointer"
            onClick={() => setIdActivo(pathname)}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        ): 
        (
          <Button className="cursor-pointer">
            Agregar {ruta}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white">
        <form onSubmit={handleSubmit(registerRecurso)}>

        <DialogHeader>
          <DialogTitle> {isEditar ? ('Editar ') : ('Nuevo ')} {ruta}</DialogTitle>
          <DialogDescription>
            Guardalo cuando hayas terminado
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-6">
          
          {/* ====== Campo: VALOR ====== */}
          <div className=" flex flex-col gap-2">
            <Label htmlFor="valor">Ingresar valor</Label>
            <Controller
              name="valor"
              control={control}
              rules={{
                required: "El campo valor es obligatorio",
                min: {
                  value: 1,
                  message: "El valor debe ser mayor que 0",
                },
              }}
              render={({ field }) => (
                <Input
                  id="valor"
                  type="number"
                  value={field.value ?? ""}
                  className="bg-background"
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : parseFloat(val));
                  }}
                />
              )}
            />
            {errors.valor && (
              <span className="text-sm text-red-600">
                {errors.valor?.message }
              </span>
            )}
          </div>

          {/* ====== Campo: CATEGORIA ====== */}
          <div className=" flex flex-col gap-2">
            <Label htmlFor="etiqueta">Ingresar categoria</Label>
            <Controller
              control={control}
              name="etiqueta"
              rules={{ required: "El campo categoría es obligatorio" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full bg-background cursor-pointer" 
                    id='etiqueta'
                  >
                    <SelectValue placeholder="Selecciona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesSelect.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.etiqueta && (
              <span className="text-sm text-red-600">
                {errors.etiqueta?.message }
              </span>
            )}
          </div>
          
          {/* ====== Campo: FECHA ====== 
          <div className=" flex flex-col gap-2">
            <Label htmlFor="name">
              Ingresar fecha
            </Label>
            <DatePicker width="w-full" bg="bg-background" />
          </div> */}

          {/* ====== Campo: DESCRIPCION ====== */}
          <div className=" flex flex-col gap-2">
            <Label htmlFor="name">Ingresar una descripcion  </Label>
            <Controller
              control={control}
              name="descripcion"
              rules={{
                required: "El campo descripción es obligatorio",
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                validate: (val) =>
                  (val?.trim().length || 0) > 0 ||
                  "La descripción no puede quedar en blanco",
              }}
              render={({ field }) => (
                <Textarea className="w-full bg-background " 
                  id="descripcion"
                  {...field}
                />
              )}
            />
            {errors.descripcion && (
            <span className="text-sm text-red-600">
              {errors.descripcion?.message }
            </span>
          )}
          </div>
          
        </div>

        <DialogFooter>
          <DialogPrimitive.Close>
            <Button type="button" variant="secondary" className="w-full" >Cancelar</Button>
          </DialogPrimitive.Close>
          <Button type="submit"> {isEditar ? ('Actualizar ') : ('Guardar ')} {ruta}</Button>
        </DialogFooter>

      </form>
      </DialogContent>
      
    </Dialog>
  )
}
