import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDateGrap } from "@/Services/formatDate"
import type { Recursos, RecursoData } from "@/types"
import { ModalConfirma } from "./ModalConfirma"
import { categories, categoriesIngresos } from "@/data/categories"
import { ModalForm } from "./RecursoForm"
import { formatMoneda } from "@/Services/formatMoneda"
interface TableDataProps {
    data: Recursos;
    resourceType: 'gasto' | 'ingreso'; 
    pageContextPath: '/gastos' | '/ingresos'; 
}

export const TableData = ({ data, resourceType, pageContextPath }: TableDataProps) => {

    const categoriesTable = pageContextPath === '/gastos' ? categories : categoriesIngresos;

  return (
    <Table>
        
        <TableCaption></TableCaption>
        <TableHeader >
            <TableRow >
                <TableHead className="pl-5" >Fecha</TableHead>
                <TableHead>Etiqueta</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right pr-8">Action</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            {data.docs.map((d: RecursoData)  => (
                <TableRow key={d._id}>
                    <TableCell className="font-semibold pl-5">{formatDateGrap(d.fecha)}</TableCell>
                    <TableCell>
                        <span className={`py-0.5 px-1 text-[0.75rem] font-medium rounded-lg ${categoriesTable.find(c => c.name === d.etiqueta)?.color}`}>{d.etiqueta}</span>
                    </TableCell>
                    <TableCell>{d.descripcion}</TableCell>
                    <TableCell>${formatMoneda(d.valor)}</TableCell>
                    <TableCell className="flex justify-end pr-8 gap-2">
                        <ModalConfirma ruta={resourceType} id={d._id} />
                        <ModalForm
                            formType="editar"
                            entityId={d._id} 
                            pageContextPath={pageContextPath}
                        />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>

    </Table>

  )
}