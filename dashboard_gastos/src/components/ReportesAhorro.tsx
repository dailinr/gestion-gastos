import { useAppStore } from '@/Stores/useAppStore'
import { Spinner } from './Spinner'
import { Button } from 'react-day-picker'
import { useEffect } from 'react'
import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  // CardTitle,
} from "@/components/ui/card"
import { formatDate } from '@/Services/formatDate'
import { formatMoneda } from '@/Services/formatMoneda'
import { DialogAhorro } from './FormAhorro'

export const ReportesAhorro = () => {

  const { reporteCompleto, loadingReportes, metaElegida,
    fetchReportes
  } = useAppStore()

  useEffect(() => {
    if (metaElegida !== '') {
      fetchReportes()
    }
  }, [metaElegida])

  if (!reporteCompleto || loadingReportes) {
    return (<Spinner />)
  }

  return (
    reporteCompleto?.aportes.length === 0 ? (

      <div className="flex flex-col justify-center items-center h-full space-y-4">
        <h1 className="text-2xl font-semibold text-gray-700">
          No tienes aportes para esta aporte de ahorro
        </h1>
        <Button
        // onClick={fetchAhorros}
        >
          Agrega uno
        </Button>
      </div>
    ) :
      (
        <div className='px-3 relative h-full'>
          <h1 className="text-2xl font-semibold mb-4">Aportes para aporte de ahorro</h1>

          <section className='overflow-auto'>
            {reporteCompleto?.aportes.map(aporte => (
              <Card key={aporte._id} >
                <CardHeader>
                  {/* <CardTitle>{aporte._id}</CardTitle> */}
                  <CardDescription>{formatDate(aporte.fecha)}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <p >
                    aporte de ahorro: {''}
                    <span className="text-lg font-semibold">${formatMoneda(aporte.valor)}</span>
                  </p>
                  {/* <Button onClick={() => setaporteElegida(aporte._id)}>Ver</Button>  */}
                </CardContent>
                {/* <CardFooter></CardFooter> */}
              </Card>
            ))}
          </section>

          <DialogAhorro />
        </div>
      )
  )
}
