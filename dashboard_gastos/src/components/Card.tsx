import type { Category } from "@/types"; 
import { Spinner } from "./Spinner";
import { formatMoneda } from "@/Services/formatMoneda";
import { useAppStore } from "@/Stores/useAppStore";

type cardProps = {
  data: Category
};

export const Card = ({ data }: cardProps) => {
  
  const { cargandoDashboard } = useAppStore()

  return (
    <div className='bg-white rounded-xl shadow p-3 lg:p-5 flex lg:flex-row flex-col items-center justify-between overflow-y-hidden overflow-x-auto h-auto lg:h-[6.875rem]} ' >
      
      {cargandoDashboard ? (
        <Spinner /> 
      ) 
      :
      (<>
        <div className={`${data.color} rounded-full p-2 mr-0 lg:mr-4 mb-2 lg:mb-0 flex-shrink-0`}>
        
          <div className={`w-5 h-5 lg:w-7 lg:h-7 text-black`}>
            <img src={`${import.meta.env.BASE_URL}${data.icon}.svg`} alt={data.icon} />
          </div>
        </div>

        <div className={`lg:text-left text-center flex-grow`}>
          <div className={`lg:justify-end lg:text-xl flex justify-center font-medium text-[0.875rem]  break-words overflow-wrap-break-word`}>
            ${formatMoneda(data.amount)}
          </div>
          <div className={`lg:justify-end lg:text-sm mt-1  font-semibold" flex justify-center font-medium  text-gray-600 text-[0.75rem] break-words overflow-wrap-break-word`}>
            {data.name}
          </div>
        </div>

      </>)}
    </div>
  );
};