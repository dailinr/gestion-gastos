import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/Stores/useAppStore";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate } from "@/Services/formatDate";
import { formatMoneda } from "@/Services/formatMoneda";
import { ReportesAhorro } from "@/components/ReportesAhorro";

export const Ahorros = () => {

  const { metaExist, metasAhorro,
    metaElegida, setMetaElegida, loadingAhorros 
  } = useAppStore()

  if(!metasAhorro || loadingAhorros){
    return (  <Spinner /> )
  }

  return ( 
      
    metaExist ? (

      (!metasAhorro || loadingAhorros ? (
        <Spinner />
      ):
      (<div className="w-full grid lg:grid-cols-[35%_1fr] h-full gap-x-6">

        <div className="px-2 py-4">
          <h1 className="text-2xl font-semibold mb-4">Metas de ahorro</h1>

          <section>
            {metasAhorro.map(meta => (
              <Card key={meta._id} >
                <CardHeader>
                  <CardTitle>{meta.motivo}</CardTitle>
                  <CardDescription>{formatDate(meta.fecha)}</CardDescription>
                  <CardAction className={`${meta.cumplida ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'} px-2 rounded-2xl text-xs`}>
                    {meta.cumplida ? 'cumplida' : 'sin cumplir'}
                  </CardAction>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <p >
                    Meta de ahorro: {''}
                    <span className="text-lg font-semibold">${formatMoneda(meta.valor)}</span>
                  </p>
                  <Button onClick={() => setMetaElegida(meta._id)}>Ver</Button>
                </CardContent>
                {/* <CardFooter></CardFooter> */}
            </Card>
            ))}
          </section>
        </div>

        <div className="lg:border-l-2 p-4">
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
      <div className="flex flex-col justify-center items-center space-y-4">
        <h1 className="text-3xl font-semibold text-gray-700">
          No tienes metas de ahorros
        </h1>
        <Button 
        // onClick={fetchAhorros}  
        >
          Crea una nueva
        </Button>
      </div>
    )
  )
}
