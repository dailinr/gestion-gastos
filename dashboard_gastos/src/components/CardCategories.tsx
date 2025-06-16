import { formatMoneda } from '@/Services/formatMoneda'
import type { Category } from '@/types'

export const CardCategories = ({data} : {data : Category}) => {

  return (
    <div className='flex-none w-1/4 md:w-1/6 flex flex-col items-center overflow-hidden' >
        <div className={`${data.color} w-10 h-10 rounded-full flex items-center justify-center mb-1`}>
            <i className={`${data.icon} text-[1.125rem] md:text-[1.25rem] ${data.colorText}`}></i>
        </div>

        <div className={` text-center flex-grow`}>
            <div className={` flex justify-center font-medium text-[0.875rem]  break-words overflow-wrap-break-word`}>
                ${formatMoneda(data.amount)}
            </div>
            <div className={`flex justify-center font-medium  text-gray-600 text-[0.75rem] break-words overflow-wrap-break-word`}>
                {data.name}
            </div>
        </div>
    </div>
  )
}
