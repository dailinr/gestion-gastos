import { useAppStore } from '@/Stores/useAppStore'
import { Spinner } from './Spinner'
import {
  Card,
  CardContent,
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

      <div className="flex flex-col justify-center relative pt-6 items-center h-full space-y-4">
        <h1 className="text-2xl font-semibold text-gray-700">
          No tienes aportes para esta meta de ahorro
        </h1>
        <DialogAhorro />
      </div>
    ) :
      (
        <div className=' flex flex-col overflow-hidden'>
          <h1 className="text-2xl font-semibold mb-4 px-5">Aportes para meta de ahorro</h1>

          <section className='overflow-y-auto flex-1 px-5 space-y-4'>
            {reporteCompleto?.aportes.map(aporte => (
              <Card key={aporte._id} className='py-4' >
                <CardContent className=" flex justify-between items-center">
                  <div className='flex items-center'>
                    <div className={`bg-amber-200 rounded-full p-2 mr-3 lg:mr-4 mb-2 lg:mb-0 flex-shrink-0`}>
                      <div className={`w-6 h-6 lg:w-8 lg:h-8 `}>
                        <img src={`${import.meta.env.BASE_URL}dollar-finance-money-15-svgrepo-com.svg`} alt="icon ahorro" />
                      </div>
                    </div>
                    <p>{formatDate(aporte.fecha)}</p>
                  </div>
                  <p className="text-lg font-semibold">
                    ${formatMoneda(aporte.valor)}
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
