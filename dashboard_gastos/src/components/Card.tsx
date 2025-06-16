// import { Building } from "lucide-react";
import type { Category } from "@/types"; 
import { Spinner } from "./Spinner";
import { useAppStore } from "@/Stores/useAppStore";
import { formatMoneda } from "@/Services/formatMoneda";
// import { BanknoteArrowDown, ChartColumnBig } from "lucide-react";

type cardProps = {
  data: Category
};

// const items = [
//   {
//     id: 'ingresos',
//     icon: ChartColumnBig,
//   },
//   {
//     id: 'gastos',
//     icon: BanknoteArrowDown,
//   },
//   {
//     id: 'acumulado',
//     icon: BanknoteArrowDown,
//   }, 
// ]

export const Card = ({ data}: cardProps) => {

  const { cuentaActual } = useAppStore()

  return (
    <div className='bg-white rounded-xl shadow p-3 md:p-5 flex md:flex-row flex-col items-center justify-between overflow-hidden h-auto md:h-[6.875rem]}' >
      
      {!cuentaActual ? (
        <Spinner /> 
      ) 
      :
      (<>
        <div className={`${data.color} rounded-full p-2 mr-0 md:mr-4 mb-2 md:mb-0 flex-shrink-0`}>
        
          <div className={`w-5 h-5 md:w-7 md:h-7 text-black`}>
            <img src={`${import.meta.env.BASE_URL}${data.icon}.svg`} alt={data.icon} />
            {/*items.map(item => (
              <item.icon key={(items.find(i => i.id === data.id))?.id} />)
            */}
          </div>
        </div>

        <div className={`md:text-left text-center flex-grow`}>
          <div className={`md:justify-end md:text-2xl flex justify-center font-medium text-[0.875rem]  break-words overflow-wrap-break-word`}>
            ${formatMoneda(data.amount)}
          </div>
          <div className={`md:justify-end md:text-sm mt-1  font-semibold" flex justify-center font-medium  text-gray-600 text-[0.75rem] break-words overflow-wrap-break-word`}>
            {data.name}
          </div>
        </div>

      </>)}
    </div>
  );
};