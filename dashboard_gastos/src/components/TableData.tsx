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
import type { Recursos} from "../Types/index"
import { ModalConfirma } from "./ModalConfirma"
import { categories } from "@/data/categories"
import { ModalForm } from "./RecursoForm"

export const TableData = ({ data, ruta } : { data: Recursos, ruta: string}) => {

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
            {data.docs.map(d  => (
                <TableRow key={d._id}>
                    <TableCell className="font-semibold pl-5">{formatDateGrap(d.fecha)}</TableCell>
                    <TableCell>
                        <span className={`py-0.5 px-1 text-[0.75rem] font-medium rounded-lg ${categories.find(c => c.name === d.etiqueta)?.color}`}>{d.etiqueta}</span>
                    </TableCell>
                    <TableCell>{d.descripcion}</TableCell>
                    <TableCell>${d.valor}</TableCell>
                    <TableCell className="flex justify-end pr-8 gap-2">
                        <ModalConfirma ruta={ruta} id={d._id} />
                        <ModalForm 
                            pathname={d._id} type="editar"
                        />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>

    </Table>

  )
}