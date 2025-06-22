import { TableData } from "./TableData"
import { DatePicker } from './DatePicker'
import { ModalForm } from "./RecursoForm"
import { useLocation } from "react-router-dom"
import { useAppStore } from "@/Stores/useAppStore"
import { Spinner } from "./Spinner"
import { Button } from "./ui/button"
import { Paginacion } from "./Paginacion"
import { useEffect, useState } from "react"
import { formatMoneda } from "@/Services/formatMoneda"

export const TableContainer = () => {
   const { pathname } = useLocation();
   const { filterGastos, filterIngresos,  recursosCompleto,
      setCurrentPage, currentPage, isLoading, filterDate} = useAppStore()

   // Determinar el tipo de recurso basado en el pathname real de la página
   const pageResourceType = pathname === '/gastos' ? 'gasto' : 'ingreso';
   const pageTitle = pageResourceType === 'gasto' ? 'Gastos' : 'Ingresos';

   const [date, setDate] = useState<Date>()
   
   // Llamar a filterDate cuando cambia `date`
   useEffect(() => {
      filterDate(date, pageTitle.toLocaleLowerCase())
   }, [date])

   useEffect(() => {
      setDate(undefined)
      if(!isLoading && recursosCompleto.paginacion){
         if(currentPage !== recursosCompleto?.paginacion?.totalPages) setCurrentPage(recursosCompleto?.paginacion?.totalPages, 1)
         
      }
      return 
   }, [pathname])

   if (isLoading || !recursosCompleto) {
      return (<Spinner />)
   }
   
   const data = pageResourceType === 'gasto' ? filterGastos : filterIngresos;
   const isEmptyData = !data?.docs || data.docs.length === 0
   
   return (
      <div className="flex flex-col w-full">

         <section className="mt-5 mb-5 md:flex space-y-3 md:space-y-0 justify-between  items-center">
            <div className="text-2xl font-semibold">
               {pageTitle}
               <div className='md:hidden block lg:hidden mt-1'>
                  <h2 className='text-lg font-normal'>Total semanal: {''}
                  <span className='font-semibold'>
                     ${formatMoneda((pageResourceType === 'gasto'
                           ? recursosCompleto.resultados?.[0]?.totalGastos 
                           : recursosCompleto.resultados?.[0]?.totalIngresos)
                        ?? 0
                     )}
                  </span>
                  </h2>
               </div>
            </div>

            <div className="flex gap-5 items-center ">
               <DatePicker 
                  width="w-[280px]" bg="hover:bg-white" 
                  date={date} setDate={setDate}
               />

               <ModalForm
                  formType="agregar"
                  pageContextPath={location.pathname as '/gastos' | '/ingresos'} // Ruta de la página actual
               />
            </div>
         </section>

         {isEmptyData ? (
            <p className="text-2xl font-semibold py-20 text-center">
               No hay {pageTitle.toLocaleLowerCase()} disponibles
            </p>
         ) :
            <TableData
               data={data} resourceType={pageResourceType}
               pageContextPath={location.pathname as '/gastos' | '/ingresos'}
            />
         }
         
         <div className="flex md:flex-col my-5">
            {data && data.hasNextPage && data.nextPage &&
               <div className="w-full md:flex justify-center mb-5">
                  <Button variant="secondary" 
                     onClick={() => data.hasNextPage && data.nextPage && setCurrentPage(currentPage, data.nextPage)}   
                  >
                     Ver más
                  </Button>
               </div>
            }
            
            {recursosCompleto.paginacion && 
               <Paginacion 
                  paginacion={recursosCompleto.paginacion}
                  setCurrentPage={setCurrentPage}
               />
            }
         </div>
      </div>
   )
}
