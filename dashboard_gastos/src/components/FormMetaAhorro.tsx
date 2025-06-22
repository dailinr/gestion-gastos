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
import { FieldDatePicker } from "./FieldDatePicker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Controller, useForm } from "react-hook-form"
import { useAppStore } from "@/Stores/useAppStore"
import type { MetaDraft } from "@/types"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"

export const DialogMeta = () => {

    const { fetchAddMeta, fetchMetaExist } = useAppStore()
    const defaultFormValues: MetaDraft = {
        valor: 0,
        motivo: '',
        fecha: new Date()
    };

    const { handleSubmit, control, formState: { errors } } = useForm<MetaDraft>({
        defaultValues: defaultFormValues
    });

    const onSubmit = async (formData: MetaDraft) => {

        try{
            const response = await fetchAddMeta(formData)
            
            if(response?.status === "success"){
                toast.success(response.message)
            }else{
                throw new Error(response?.message ||`Error al agregar meta de ahorro`)
            }
                
                await fetchMetaExist()
            }
        catch(error: any){
            toast.error(error?.message || 'Ocurrio un error')
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm">Agregar nueva</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agrega una meta de ahorros</DialogTitle>
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
                                    {errors.valor?.message}
                                </span>
                            )}
                        </div>

                        {/* ====== Campo: FECHA ======  */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="fecha">Ingresar fecha</Label>
                            <Controller
                                name="fecha"
                                control={control}
                                rules={{
                                    required: "La fecha es obligatorio",
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

                        {/* ====== Campo: MOTIVO ====== */}
                        <div className=" flex flex-col gap-2">
                            <Label htmlFor="motivo">Ingresar el motivo</Label>
                            <Controller
                                control={control}
                                name="motivo"
                                rules={{
                                    required: "El campo motivo es obligatorio",
                                    maxLength: { value: 50, message: "Máximo 50 caracteres" },
                                    validate: (val) =>
                                        (val?.trim().length || 0) > 0 ||
                                        "El motivo no puede quedar en blanco",
                                }}
                                render={({ field }) => (
                                    <Textarea className="w-full bg-background "
                                        id="motivo"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.motivo && (
                                <span className="text-sm text-red-600">
                                    {errors.motivo?.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Guardar meta</Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}
