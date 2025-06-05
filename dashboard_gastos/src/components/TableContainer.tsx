import { TableData } from "./TableData"
import { DatePicker } from './DatePicker'
// import { Button } from "./ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {  ModalForm } from "./RecursoForm"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { useAppStore } from "@/Stores/useAppStore"
import type { Recursos } from "@/types"
import { Spinner } from "./Spinner"
import { Button } from "./ui/button"

export const TableContainer = () => {
    const {pathname} = useLocation();
    const {fetchRecursos, fetchSemana, filterGastos, filterIngresos} = useAppStore()
    
    // Determinar el tipo de recurso basado en el pathname real de la página
    const pageResourceType = pathname === '/gastos' ? 'gasto' : 'ingreso';
    const data = pageResourceType === 'gasto' ? filterGastos : filterIngresos;
    const pageTitle = pageResourceType === 'gasto' ? 'Gastos' : 'Ingresos';

    useEffect(() => {
        fetchRecursos()
        fetchSemana()
    },[])

    const isEmptyData = (data : Recursos) => !data || Object.keys(data).length === 0 || !data.docs;
    if(isEmptyData(data)){
        return ( <Spinner /> )
    }

  return (
    <div className="flex flex-col w-full">

        <section className="mt-5 mb-5 md:flex space-y-3 md:space-y-0 justify-between  items-center">
            <div className="text-2xl font-semibold">
                {pageTitle}
            </div>
            <div className="flex gap-5 items-center ">
                <DatePicker width="w-[280px]" bg="hover:bg-white"/>

                <ModalForm
                    formType="agregar"
                    pageContextPath={location.pathname as '/gastos' | '/ingresos'} // Ruta de la página actual
                />
            </div>
        </section>
        
        {(data.totalDocs === 0 || data.docs.length === 0) ? (
            <p className="text-2xl font-semibold py-20 text-center">
                No hay {pageTitle.toLocaleLowerCase()} para esta semana
            </p>
        ): <TableData data={data} resourceType={pageResourceType} pageContextPath={location.pathname as '/gastos' | '/ingresos'} />}

        <div className="flex md:flex-col mt-5">
            <div className="w-full md:flex justify-center">
                <Button variant="secondary" >Ver más</Button>
            </div>

            <Pagination className=" justify-end">
                <PaginationContent>
                    <PaginationItem >
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive  >1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#"  />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>

    </div>
  )
}
