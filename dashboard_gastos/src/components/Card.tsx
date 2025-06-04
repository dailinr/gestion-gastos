// import { Building } from "lucide-react";
import type { Category } from "@/types"; 
import { Spinner } from "./Spinner";
import { useAppStore } from "@/Stores/useAppStore";

type cardProps = {
  data: Category
  type: string
};

export const Card = ({ data, type}: cardProps) => {

  const classCard = `bg-white rounded-xl shadow p-3 md:p-5 flex md:flex-row flex-col items-center justify-between overflow-hidden h-auto md:h-[110px]}`;
  const classCategory = 'flex-none w-1/4 md:w-1/6 flex flex-col items-center overflow-hidden  ';

  const contIcon = `${data.color} w-10 h-10 rounded-full flex items-center justify-center mb-1`;

  const iconClass = `text-[18px] md:text-[20px] ${data.colorText}`;

  const contSVG = `${data.color} rounded-full p-2 mr-0 md:mr-4 mb-2 md:mb-0 flex-shrink-0`;
  const contSVGCategory = `${data.color} border border-black rounded-full p-1.5 mr-0  mb-1 flex-shrink-0`;

  const imgClass = `w-5 h-5 md:w-7 md:h-7 text-black`;
  const imgCategory = `w-6 h-6 md:w-10 md:h-10 text-black`;
  const { cuentaActual } = useAppStore()

  return (
    
    <div className={type === 'card' ?  classCard : classCategory } >
      {!cuentaActual && type !== "category" ? (
        <Spinner /> 
      ) 
      :(<>
        {type === "card" ? (
          <div className={type === 'card' ? contSVG : contSVGCategory }>
          
            <div className={type === 'card' ? imgClass : imgCategory }>
              <img src={`${import.meta.env.BASE_URL}${data.icon}.svg`} alt={data.icon} />
            </div>
      
          </div>
        ):
        (
          <div className={contIcon}>
            <i className={`${data.icon}  ${iconClass}`}></i>
          </div>
          
        )}

        <div className={`${type === 'card' ? "md:text-left " : "" } text-center flex-grow`}>
          <div className={`${type === 'card' ? "md:justify-end md:text-2xl  " : ""} flex justify-center font-medium text-[13px]  break-words overflow-wrap-break-word`}>
            {data.amount}
          </div>
          <div className={`${type === 'card' ? "md:justify-end md:text-sm mt-1  font-semibold" : ""} flex justify-center font-medium  text-gray-600 text-[12px] break-words overflow-wrap-break-word`}>
            {data.name}
          </div>
        </div>
      </>)}
    </div>
    
  );
};