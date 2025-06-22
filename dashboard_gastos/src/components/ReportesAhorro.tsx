import { useAppStore } from '@/Stores/useAppStore'
import { Spinner } from './Spinner'
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
import { useEffect } from 'react'

export const ReportesAhorro = () => {

  const { metaElegida, reporteCompleto, loadingReportes, fetchReportes } = useAppStore()

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

      <div className="flex flex-col justify-center relative items-center h-full space-y-4">
        <h1 className="text-2xl font-semibold text-gray-700">
          No tienes aportes para esta meta de ahorro
        </h1>
        {/* <Button
        // onClick={fetchAhorros}
        >
          Agrega uno
        </Button> */}
        <DialogAhorro />
      </div>
    ) :
      (
        <div className='px-3 relative h-full'>
          <h1 className="text-2xl font-semibold mb-4">Aportes para aporte de ahorro</h1>

          <section>
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
                </CardContent>
              </Card>
            ))}
          </section>

          {!reporteCompleto?.meta?.cumplida && 
            <DialogAhorro />
          }
          
        </div>
      )
  )
}
