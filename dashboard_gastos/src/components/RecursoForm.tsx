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
import { DatePicker } from "./DatePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories, categoriesIngresos } from "@/data/categories"
import { useForm, Controller} from "react-hook-form"
import type { RecursoDraft } from "@/types"
import { useAppStore } from "@/Stores/useAppStore"
import { toast } from "sonner"

type modalProps = {
  pathname: string
}

export function ModalForm({ pathname }: modalProps) {

  const ruta = pathname === '/gastos' ? 'Gasto' : 'Ingreso'
  const categoriesSelect = ruta === 'Gasto' ? categories : categoriesIngresos

  const {fetchAddRecurso, fetchRecursos} = useAppStore()
  const { handleSubmit, control,  formState: { errors },  } = useForm<RecursoDraft>({
    defaultValues: {
      valor: 0,
      etiqueta: "",
      descripcion: "",
    }
  })

  const registerRecurso = async (data: RecursoDraft) => {
    const response = await fetchAddRecurso(data, ruta)
    
    if(response?.status === "success"){    
      toast.success(`${ruta} agregado correctamente!`) 
    }
    else{
      toast.error(`Error al agregar ${ruta}!`) 
    }
    fetchRecursos()
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          Agregar {ruta}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white">
        <form onSubmit={handleSubmit(registerRecurso)}>

        <DialogHeader>
          <DialogTitle>Nuevo {ruta}</DialogTitle>
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
          
          {/* ====== Campo: FECHA ====== */}
          <div className=" flex flex-col gap-2">
            <Label htmlFor="name">
              Ingresar fecha
            </Label>
            <DatePicker width="w-full" bg="bg-background"  
              // {...register('categoria', {
              //   required: `El campo categoria es obligatorio` // mensaje de error
              // })}
            />
          </div>

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
        {/* {close && <DialogPrimitive.Close /> } */}

        <DialogFooter>
          <DialogPrimitive.Close >
            <Button variant="secondary" className="w-full" >Cancelar</Button>
          </DialogPrimitive.Close>
          <Button type="submit">Guardar {ruta}</Button>
        </DialogFooter>

      </form>
      </DialogContent>
      
    </Dialog>
  )
}
