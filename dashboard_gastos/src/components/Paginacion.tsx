
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

type PaginacionProps = {
    paginacion: PaginationTypes,
    setCurrentPage: (page: number) => Promise<void>
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
              onClick={() => paginacion.hasPrevPage && paginacion.prevPage && setCurrentPage(paginacion.prevPage)}
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
                setCurrentPage(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {/* Mostrar puntos suspensivos si hay más de 3 páginas */}
          {paginacion.totalPages > 3 && paginacion.currentPage < paginacion.totalPages - 1 && (
            // <DropdownMenu>
            //   <DropdownMenuTrigger asChild>
            //     <Button
            //         variant="ghost"
            //         size="icon"
            //         className="h-8 w-8"
            //         aria-label="pages"
            //     >  
            //         <PaginationEllipsis className="h-4 w-4" />
            //     </Button>
            //     {/* <PaginationItem>
            //       <PaginationEllipsis className="cursor-pointer" />
            //     </PaginationItem> */}
            //   </DropdownMenuTrigger>
            //   <DropdownMenuContent align="center">
            //     {Array.from({ length: paginacion.totalPages - 2 }, (_, i) => {
            //       const page = i + 2;
            //       return (
            //         <DropdownMenuItem
            //           key={page}
            //           onClick={() => setCurrentPage(page)}
            //           className={paginacion.currentPage === page ? "bg-muted" : ""}
            //         >
            //           Página {page}
            //         </DropdownMenuItem>
            //       );
            //     })}
            //   </DropdownMenuContent>
            // </DropdownMenu>
            <PaginationEllipsis />
          )}

          {/* Última página */}
          {paginacion.totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={paginacion.currentPage === paginacion.totalPages}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(paginacion.totalPages);
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
              onClick={() => paginacion.hasNextPage && paginacion.nextPage && setCurrentPage(paginacion.nextPage)}
              disabled={!paginacion.hasNextPage}
            >
               {'>'}
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
  )
}
