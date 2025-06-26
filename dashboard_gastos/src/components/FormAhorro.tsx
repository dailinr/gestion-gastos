import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AporteDraft } from "@/types"
import { Controller, useForm } from "react-hook-form"
import { useAppStore } from "@/Stores/useAppStore"
import { toast } from "sonner"
import { FieldDatePicker } from "./FieldDatePicker"

export function DialogAhorro() {

  const { reporteCompleto, fetchAddAportes, fetchReportes, fetchMetaExist } = useAppStore()
  const defaultFormValues: AporteDraft = { 
    valor: 0,
    meta: reporteCompleto?.meta?._id,
    fecha: new Date()
  };

  const { handleSubmit, control, formState: {errors} } = useForm<AporteDraft>({
    defaultValues: defaultFormValues
  });

  const onSubmit = async (formData: AporteDraft) => {

    try{
      const response = await fetchAddAportes(formData)
      
      if(response?.status === "success"){
        toast.success(response.mensaje)
      }else{
        throw new Error(response?.mensaje ||`Error al agregar aporte de ahorro`)
      }
      await fetchReportes()
      await fetchMetaExist()
    }
    catch(error: any){
      toast.error(error?.message || 'Ocurrio un error')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='bg-primary hover:bg-primary/90 shadow border-2 rounded-full p-3 w-min absolute left-0 md:left-4 md:bottom-8 bottom-16 cursor-pointer'>
          <svg data-slot="icon" fill="none" className='size-10' stroke-width="3" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
          </svg>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar aporte para ahorros</DialogTitle>
          {/* <DialogDescription> </DialogDescription> */}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-3 space-y-6">

            {/* ====== Campo: VALOR ====== */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="valor">valor</Label>
              <Controller
                name="valor"
                control={control}
                rules={{
                  required: "El campo valor es obligatorio",
                  min: {
                    value: 1,
                    message: "El valor debe ser mayor que 0",
                  },
                  validate: (valorActual) => {
                    const sumatoria = valorActual + reporteCompleto?.sumaAportes
                    if(sumatoria > reporteCompleto?.meta?.valor){
                      return "El valor del aporte no puede ser mayor a la meta de ahorro"
                    }
                    return true
                  }
                }}
                render={({ field }) => (
                  <Input id="valor" type="number" 
                    value={field.value ?? ""}
                    className="bg-background"
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? "" : parseFloat(val))
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

            {/* ====== Campo: FECHA ======  */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="valor">Ingresar fecha</Label>
              <Controller
                name="fecha"
                control={control}
                rules={{
                  required: "La fecha es obligatorio",
                  validate: (value) => {
                    if(!value) return "La fecha es obligatoria"
                    if(value > new Date()) return "La fecha no puede ser futura"
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
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar aporte</Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}
