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
import type { Recursos } from "@/Types"
import { Spinner } from "./Spinner"

export const TableContainer = () => {
    const {pathname} = useLocation();
    const {fetchRecursos, gastos, ingresos } = useAppStore()
    
    const data = pathname === '/gastos' ? gastos 
        : ( pathname === '/ingresos' ? ingresos : {} as Recursos )
    const pageRuta = pathname === '/gastos' ? ('Gastos') : ('Ingresos')
    const ruta = pathname === '/gastos' ? ('gasto') : ('ingreso')

    useEffect(() => {
        fetchRecursos() 
    },[])

    const isEmptyData = (data : Recursos) => Object.keys(data).length === 0
    if(isEmptyData(data)){
        return ( <Spinner /> )
    }

  return (
    <div className="flex flex-col w-full">

        <section className="mt-5 mb-5 md:flex space-y-3 md:space-y-0 justify-between  items-center">
            <div className="text-2xl font-semibold">
                {pageRuta}
            </div>
            <div className="flex gap-5 items-center ">
                <DatePicker width="w-[280px]" bg="hover:bg-white"/>

                <ModalForm pathname={pathname} type="agregar" />
            </div>
        </section>
        
        {data.totalDocs === 0 ? (
            <p className="text-2xl font-semibold py-20 text-center">
                No hay {pageRuta.toLocaleLowerCase()} para esta semana
            </p>
        ): <TableData data={data} ruta={ruta} /> }

        <Pagination className="mt-5 justify-end">
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
  )
}
