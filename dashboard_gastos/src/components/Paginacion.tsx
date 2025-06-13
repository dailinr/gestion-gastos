
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
} from "@/components/ui/pagination"
import { Button } from "./ui/button"
// import {  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { PaginationTypes } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

type PaginacionProps = {
    paginacion: PaginationTypes,
    setCurrentPage: (page: number, dataPage: number) => Promise<void>
}

export const Paginacion = ({ paginacion, setCurrentPage }: PaginacionProps) => {

  return (
    <Pagination>
        <PaginationContent>

          {/* Botón Anterior */}
          <PaginationItem>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Página anterior"
              onClick={() => paginacion.hasPrevPage && paginacion.prevPage && setCurrentPage(paginacion.prevPage, 1)}
              disabled={!paginacion.hasPrevPage}
            >
               {'<'}
            </Button>
          </PaginationItem>

          {/* Página 1 */}
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={paginacion.currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(1, 1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {/* Mostrar puntos suspensivos si hay más de 3 páginas */}
          {paginacion.totalPages > 3  && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="pages"
                >  
                    <PaginationEllipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="center" className=" bg-white h-24 rounded-md shadow overflow-y-auto">
                {Array.from({ length: paginacion.totalPages - 2 }, (_, i) => {
                  const page = i + 2;
                  return (
                    <DropdownMenuItem
                      key={page}
                      onClick={() => setCurrentPage(page, 1)}
                      className={`${paginacion.currentPage === page ? "bg-gray-300" : ""} w-full px-5 cursor-pointer hover:bg-gray-200`}
                    >
                      {page}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
          )}

          {/* Última página */}
          {paginacion.totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={paginacion.currentPage === paginacion.totalPages}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(paginacion.totalPages, 1);
                }}
              >
                {paginacion.totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Botón Siguiente */}
          <PaginationItem>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Página siguiente"
              onClick={() => paginacion.hasNextPage && paginacion.nextPage && setCurrentPage(paginacion.nextPage, 1)}
              disabled={!paginacion.hasNextPage}
            >
               {'>'}
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
  )
}
