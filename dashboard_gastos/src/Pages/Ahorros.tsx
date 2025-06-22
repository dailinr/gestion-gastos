import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/Stores/useAppStore";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate } from "@/Services/formatDate";
import { formatMoneda } from "@/Services/formatMoneda";
import { ReportesAhorro } from "@/components/ReportesAhorro";
import { toast } from "sonner";
import { DialogMeta } from "@/components/FormMetaAhorro";

export const Ahorros = () => {

  const { metaExist, metaDashboard, metasAhorro, metaElegida, 
    setMetaElegida, loadingAhorros, setMetaDashboard } = useAppStore()

  if(loadingAhorros){
    return (  <Spinner /> )
  }

  const setDashboard = async (id: string) => {
    
    try {
      const response = await setMetaDashboard(id)

      if(response?.status === "success"){
        toast.success(response.message)
      }
      else{
        throw new Error(response?.message ||`Error al actualizar meta dashboard`)
      }
    }
    catch(error: any){
      toast.error(error?.message || 'Ocurrio un error')
    }
  }

  return ( 
      
    metaExist ? (

      (loadingAhorros ? (
        <Spinner />
      )
      :(
      <div className="w-full h-full grid lg:grid-cols-[38%_1fr] gap-x-4">

        <div className="flex flex-col overflow-hidden">
          <div className="flex justify-between px-4">
            <h1 className="text-2xl font-semibold mb-4">Metas de ahorro</h1>
            {metasAhorro.length < 3 &&  <DialogMeta /> }
          </div>
          
          <section className="space-y-3 overflow-y-auto flex-1  px-4 ">
            {metasAhorro.map(meta => (
              <Card key={meta._id} >
                <CardHeader>
                  <CardTitle>{meta.motivo}</CardTitle>
                  <CardDescription>{formatDate(meta.fecha)}</CardDescription>
                  <CardAction className={`${meta.cumplida ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'} px-2 rounded-2xl text-xs font-medium`}>
                    {meta.cumplida ? 'cumplida' : 'en proceso'}
                  </CardAction>
                </CardHeader>
                <CardContent className="">
                  <p>
                    Total aportes: {''}
                    <span className="text-lg font-semibold">${formatMoneda(meta.sumaAportes)}</span>
                  </p>
                  <p>
                    Meta de ahorro: {''}
                    <span className="text-lg font-semibold">${formatMoneda(meta.valor)}</span>
                  </p>
                  <p>
                    Diferencia: {''}
                    <span className="text-lg font-semibold">${formatMoneda(meta.diferencia)}</span>
                  </p>
                  
                </CardContent>
                <CardFooter>
                  <div className="container space-x-2 space-y-2" >
                    <Button size="sm" onClick={() => setMetaElegida(meta._id)} disabled={metaElegida === meta._id}>Ver</Button>
                    <Button size="sm" variant="destructive" >Eliminar</Button>
                    {metaDashboard?._id !== meta._id && 
                      <Button size="sm" variant="blue" onClick={() => setDashboard(meta._id)} >Meta dashboard</Button>
                    }
                  </div>
                </CardFooter>
            </Card>
            ))}
          </section>
        </div>

        <div className="lg:border-l-2 px-2 relative  flex flex-col overflow-hidden">
          {metaElegida === ''? (

            <div className="flex flex-col justify-center items-center h-full space-y-4">
              <h1 className="text-2xl font-semibold text-gray-700">
                Elige una meta de ahorro para ver aquí
              </h1>
            </div>
          ):
          (
            <ReportesAhorro />
          )}
        </div>

      </div>
      ))
    ):
    (
      <div className="flex flex-col h-full items-center justify-center  space-y-4">
        <h1 className="text-2xl lg:text-3xl font-semibold text-center text-gray-700">
          No tienes metas de ahorros 
        </h1>
        <DialogMeta /> 
      </div>
    )
  )
}
