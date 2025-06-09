import { TableData } from "./TableData"
import { DatePicker } from './DatePicker'
import { ModalForm } from "./RecursoForm"
import { useLocation } from "react-router-dom"
import { useAppStore } from "@/Stores/useAppStore"
import { Spinner } from "./Spinner"
import { Button } from "./ui/button"
import { Paginacion } from "./Paginacion"
import { useEffect } from "react"

export const TableContainer = () => {
   const { pathname } = useLocation();
   const { filterGastos, filterIngresos,  recursosCompleto,
      setCurrentPage, currentPage, isLoading} = useAppStore()

   // Determinar el tipo de recurso basado en el pathname real de la página
   const pageResourceType = pathname === '/gastos' ? 'gasto' : 'ingreso';
   const data = pageResourceType === 'gasto' ? filterGastos : filterIngresos;
   const pageTitle = pageResourceType === 'gasto' ? 'Gastos' : 'Ingresos';
   const paginacion = recursosCompleto.paginacion

   useEffect(() => {
      if(!isLoading){
         if(currentPage !== paginacion.totalPages) setCurrentPage(paginacion.totalPages)
            else return 
      }
      
   }, [pathname])
   
   const isEmptyData = !data?.docs || data.docs.length === 0

   if (isLoading) {
      return (<Spinner />)
   }

   return (
      <div className="flex flex-col w-full ">

         <section className="mt-5 mb-5 md:flex space-y-3 md:space-y-0 justify-between  items-center">
            <div className="text-2xl font-semibold">
               {pageTitle}
            </div>
            <div className="flex gap-5 items-center ">
               
               <DatePicker 
                  tipo={pageTitle.toLocaleLowerCase()}
                  width="w-[280px]" bg="hover:bg-white" 
                  pathname={pathname}
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

            {data.hasNextPage &&
               <div className="w-full md:flex justify-center">
                  <Button variant="secondary" >Ver más</Button>
               </div>
            }

            <Paginacion 
               paginacion={paginacion}
               setCurrentPage={setCurrentPage}
            />

         </div>

      </div>
   )
}
