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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories, categoriesIngresos } from "@/data/categories"
import { useForm, Controller} from "react-hook-form"
import type { RecursoData, RecursoDraft, Recursos } from "@/types"
import { useAppStore } from "@/Stores/useAppStore"
import { toast } from "sonner"
import { useEffect, useMemo, useState } from "react"
import { FieldDatePicker } from "./FieldDatePicker"

const defaultFormValues: RecursoDraft = { 
  valor: 0,
  etiqueta: "",
  descripcion: "",
  fecha: new Date()
};

type ModalFormProps = {
  formType: 'agregar' | 'editar';
  pageContextPath: '/gastos' | '/ingresos'; 
  entityId?: RecursoData['_id']; 
};

export function ModalForm({ formType, pageContextPath, entityId }: ModalFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isEditar = formType === 'editar';
  // const [date, setDate] = useState<Date>()
  
  const resourceName = pageContextPath === '/gastos' ? 'Gasto' : 'Ingreso'; // para títulos y mensajes
  const categoriesSelect = resourceName === 'Gasto' ? categories : categoriesIngresos;

  const { fetchAddRecurso, setCurrentPage,  setIdActivo,    
    fetchEditarRecurso, filterGastos, filterIngresos, currentPage, fetchSemana } = useAppStore();

  // Seleccionar el recurso correcto del store
  const currentResourceStore: Recursos | undefined = useMemo(() => {
    return pageContextPath === '/gastos' ? filterGastos : filterIngresos;
  }, [pageContextPath, filterGastos, filterIngresos]);

  const { handleSubmit, control, formState: { errors }, reset } = useForm<RecursoDraft>({
    defaultValues: defaultFormValues 
  });

  // Efecto para manejar la apertura/cierre del diálogo y el reseteo del formulario
  useEffect(() => {
    if (isDialogOpen) {
      
      if (isEditar && entityId) {
        setIdActivo(entityId);
        const resourceToEdit = currentResourceStore?.docs.find(r => r._id === entityId);

        if (resourceToEdit) {
          reset({
            valor: resourceToEdit.valor,
            descripcion: resourceToEdit.descripcion,
            etiqueta: resourceToEdit.etiqueta,
            fecha: new Date(resourceToEdit.fecha)
          });
        } 
        else {
          // Resetea a vacío para evitar mostrar datos incorrectos.
          reset(defaultFormValues);
          if(entityId) toast.error(`${resourceName} con ID ${entityId} no encontrado para editar.`);
        }
      } else { // Modo Agregar
        setIdActivo(''); 
        reset(defaultFormValues); // Resetea a valores por defecto
      }
    } 
    else {
      setIdActivo(''); // Cuando el diálogo se cierra, limpiamos el idActivo del store.
    }

  }, [isDialogOpen, isEditar, entityId, currentResourceStore, reset, setIdActivo, resourceName]);
    

  const onSubmit = async (formData: RecursoDraft) => {
    let response;

    try {
      if (isEditar && entityId) {  // si es para editar
        const recursoActualizado = { ...formData, _id: entityId };
        response = await fetchEditarRecurso(recursoActualizado, resourceName.toLowerCase() as 'gasto' | 'ingreso');
        
        if (response?.status === "success") {
          toast.success(`${resourceName} actualizado correctamente!`);
        } else {
          throw new Error(response?.mensaje || `Error al actualizar ${resourceName}!`);
        }
      } 
      else { // Agregar nuevo
        response = await fetchAddRecurso(formData, resourceName.toLowerCase() as 'gasto' | 'ingreso');
        if (response?.status === "success") {
          toast.success(`${resourceName} agregado correctamente!`);
        } else {
          throw new Error(response?.mensaje ||`Error al agregar ${resourceName}!`);
        }
      }
      await setCurrentPage(currentPage, 1); // refrescar datos en la tabla
      await fetchSemana()
      setIsDialogOpen(false); // cerrar el diálogo

    } catch (error: any) {
      toast.error(error.message || `Ocurrió un error.`);
    }
  };
    

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

      <DialogTrigger asChild>
        {isEditar ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5 text-blue-800 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        ): 
        (
          <Button className="cursor-pointer">
            Agregar {resourceName}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>

        <DialogHeader>
          <DialogTitle> {isEditar ? 'Editar ' : 'Nuevo '} {resourceName}</DialogTitle>
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="fecha">Ingresar fecha</Label>
            <Controller
              name="fecha"
              control={control}
              rules={{
                required: "La fecha es obligatoria",
                validate: (value) => {
                  if (!value) return "La fecha es obligatoria"
                  if (value > new Date()) return "La fecha no puede ser futura"
                  return true
                }
              }}
              render={({ field }) => (
                <FieldDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.fecha?.message}
                />
              )}
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

        <DialogFooter>
          <DialogPrimitive.Close asChild>
            <Button type="button" variant="secondary" >Cancelar</Button>
          </DialogPrimitive.Close>
          <Button type="submit"> {isEditar ? 'Actualizar ' : 'Guardar '} {resourceName}</Button>
        </DialogFooter>

      </form>
      </DialogContent>
      
    </Dialog>
  )
}
