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
import { useIsMobile } from "@/hooks/use-mobile";
import { DialogEliminarMeta } from "@/components/DialogEliminarMeta";

export const Ahorros = () => {

  const { metaExist, metaDashboard, metasAhorro, metaElegida, 
    setMetaElegida, loadingAhorros, setMetaDashboard } = useAppStore()

  const isMobile = useIsMobile()
  
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
      <div className="w-full h-[calc(100vh-5rem)] lg:h-full grid grid-rows-[1fr_1fr] gap- md:grid-cols-[38%_1fr] md:gap-x-4 md:grid-rows-1">

        <div className="flex flex-col overflow-hidden">
          <div className="flex justify-between px-4">
            <h1 className="text-xl lg:text-2xl font-semibold mb-4">Metas de ahorro</h1>
            {metasAhorro.length < 3 &&  <DialogMeta /> }
          </div>
          
          <section className="space-y-4 overflow-y-auto flex-1  lg:px-4 ">
            {metasAhorro.map(meta => (
              <Card key={meta._id} >
                <CardHeader>
                  <CardTitle>{meta.motivo}</CardTitle>
                  <CardDescription>{formatDate(meta.fecha)}</CardDescription>
                  <CardAction className={`${meta.cumplida ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'} px-2 rounded-2xl text-xs font-medium`}>
                    {meta.cumplida ? 'cumplida' : 'en proceso'}
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p>Total aportes: {''}<span className="text-lg font-semibold">${formatMoneda(meta.sumaAportes)}</span></p>
                  <p>Meta de ahorro: {''}<span className="text-lg font-semibold">${formatMoneda(meta.valor)}</span></p>
                  <p>Diferencia: {''}<span className="text-lg font-semibold">${formatMoneda(meta.diferencia)}</span></p>
                </CardContent>
                <CardFooter>
                  <div className="container space-x-2 space-y-2" >
                    <Button size="sm" onClick={() => setMetaElegida(meta._id)} disabled={metaElegida === meta._id}>Ver</Button>
                    <DialogEliminarMeta id={meta._id} />
                    {metaDashboard?._id !== meta._id && 
                      <Button size="sm" variant="blue" onClick={() => setDashboard(meta._id)}>{isMobile ? 'Dashboard' : 'Mostrar dashboard'}</Button>
                    }
                  </div>
                </CardFooter>
            </Card>
            ))}
          </section>
        </div>

        <div className="lg:border-l-2 relative lg:px-2  flex flex-col overflow-hidden">
          {metaElegida === ''? (

            <div className="flex flex-col py-6 justify-center items-center h-full space-y-4">
              <h1 className="text-2xl font-semibold text-center text-gray-700">
                Elige una meta de ahorro para ver aquí
              </h1>
            </div>
          ):
          (
            <ReportesAhorro isMobile={isMobile} />
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
