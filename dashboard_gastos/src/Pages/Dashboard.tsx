import {
  CardAction,
  Card as CardBoard,
  // CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Card } from "../components/Card"
import { DonutChart } from "../components/DonaChart"
import { useAppStore } from "@/Stores/useAppStore"
import type { Category } from "@/types"
import { Component as BarChart } from "../components/BarChart"
import { Spinner } from "@/components/Spinner"
import { formatMoneda } from "@/Services/formatMoneda"
import { CardCategories } from "@/components/CardCategories"
import { Link } from "react-router-dom"

export const Dashboard = () => {
  
  const { cargandoDashboard, loadingAhorros, modo,
    data,  metaDashboard, progressAhorro, 
  } = useAppStore()

  let legend = modo === 'mes' ? 'último mes' : 'última semana'
  
  const cards : Category[] = data ? [
    {
      id: 1,
      name: "Ingresos",
      icon: "business-finance-corporate-26-svgrepo-com",
      amount: data?.totalIngresos,
      color: "bg-[#C7E9F9]",
      colorText: "text-[#C7E9F9]",
      hex: "black"
    },
    {
      id: 2,
      name: "Gastos",
      icon: "business-finance-corporate-11-svgrepo-com",
      amount: data?.totalGastos,
      color: "bg-[#FFD9D9]",
      colorText: "text-[#FFD9D9]",
      hex: "black"
    },
    {
      id: 3,
      name: "Acumulado",
      icon: "business-finance-corporate-22-svgrepo-com",
      amount: data?.totalAcumulado,
      color: "bg-[#CFF3AF]",
      colorText: "text-[#CFF3AF]",
      hex: "black"
    },
  ] : []

  return (
    <main className="flex-1 grid grid-cols-1 md:grid-cols-[57%_1fr] gap-4 md:overflow-hidden">

      <div className="h-full overflow-auto">
        <div className="grid grid-rows-[6.875rem_12.5rem_minmax(0,_1fr)] grid-cols-3 gap-4 h-full">
          {cards.map(card => (
            // <CardValues key={card.id} data={card} />
            <Card key={card.id} data={card} />
          ))}
  
          <div className="col-span-3 grid grid-cols-2 gap-4 h-full">

            {/* Grafica resumen de gastos   */}
            <CardBoard className={` py-2 px-4 h-full ${modo === 'mes' ?  'gap-3 lg:gap-0': 'gap-6' }  flex flex-col overflow-auto`}>
              {cargandoDashboard ? (
                <Spinner />
              ): 
              (<>
                <CardHeader className="px-0 gap-0 border-amber-950">
                  <CardTitle className="text-md font-semibold pt-1">Resumen de Gastos</CardTitle>
                  <CardDescription className="text-gray-500 font-semibold mb-0 text-[12px]">{legend}</CardDescription>
                  {/* <CardAction>
                    <i className='bx bx-right-arrow-alt text-xl cursor-pointer text-[#9B9B9B] border border-[#9B9B9B] p-1 rounded-full'></i>
                  </CardAction> */}
                </CardHeader>

                <CardContent className={`px-0 md:flex gap-x-3 `}>
                  <div className="w-full min-w-[100px]">
                    <DonutChart categories={data?.categorias} />
                  </div>
                  <div className="hidden lg:flex flex-col mx-auto mr-0">
                    {data?.categorias.map(cat => cat.amount > 0 && (

                      <div key={cat.id} className={`flex items-center`}>
                        <i className={`bx bxs-circle ${cat.color} text-transparent text-[0.5rem] mr-1`}/>
                        <span className="text-[0.75rem] align-center">{cat.name}</span> 
                      </div>
                    ))}
                  </div>
                </CardContent>
                </>
              )}
            </CardBoard>
  
            {/* Progreso de ahorros */}
            <CardBoard className=" py-2 px-4 h-full  flex flex-col overflow-auto">
              { loadingAhorros ? (
                <Spinner />
              ):
              (
                <>
                <CardHeader className="px-0 gap-0">
                  <CardTitle className="text-md font-semibold pt-1">Metas de Ahorro</CardTitle>
                  {metaDashboard && <CardDescription className="text-gray-500 font-semibold mb-3 text-md">${formatMoneda(metaDashboard.valor)}</CardDescription>}
                  <CardAction>
                    <Link to="/ahorros"> <i className='bx bx-right-arrow-alt text-xl cursor-pointer text-[#9B9B9B] border border-[#9B9B9B] p-1 rounded-full'/> </Link>
                  </CardAction>
                </CardHeader>
                {metaDashboard ?  <>
                  <CardContent className="px-0">
                    <Progress value={progressAhorro} /> 
                  </CardContent>
                  <CardFooter className="w-full h-[2.813rem] rounded-lg bg-[#efeff9] text-xl flex items-center justify-center">
                    <p>${formatMoneda(metaDashboard.sumaAportes)}</p>
                  </CardFooter>
                </>
                :
                  <div className="text-center pt-6">
                    <p className="font-semibold text-gray-600 ">No has definido una meta</p>
                  </div>
                }
                </>
              )}
              
            </CardBoard>

          </div> 
  
          <div className="bg-white col-span-3 rounded-xl shadow-2xl px-4 py-2 h-full relative flex flex-col">
            {/* <i className='bx bx-right-arrow-alt text-xl absolute right-4 cursor-pointer text-[#9B9B9B] border border-[#9B9B9B] p-1 rounded-full'></i> */}
            <h1 className="text-md font-semibold pt-1">Gastos por Categoria</h1>
            <p className="text-gray-500 mb-2 font-semibold text-[0.75rem]">{legend}</p>
            <div className="flex-1 overflow-auto ">
              <div className="flex flex-wrap gap-y-4 h-full items-center justify-between ">
                { cargandoDashboard ? (
                  <Spinner />
                ): 
                (data?.categorias.map(category => {
                  return <CardCategories key={category.id} data={category} />
                }))}
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <div className="h-full overflow-auto">
        <div className="grid grid-rows-2 h-full gap-4  ">
  
          <section className="w-full h-full shadow bg-white rounded-xl flex flex-col justify-center">
            <BarChart />
          </section>
  
          <section className="w-full h-full shadow-xl flex flex-col bg-white rounded-xl px-2 py-2 relative ">
            <Link to={"/gastos"} >
              <i className='bx bx-right-arrow-alt text-xl absolute right-6 cursor-pointer text-[#9B9B9B] border border-[#9B9B9B] p-1 rounded-full'></i>
            </Link>
            <h1 className="text-md font-semibold px-2 py-1">Gastos Recientes</h1>
              
            { cargandoDashboard ? (
              <Spinner />
            ): (data?.recientes.length === 0 ? 
              <p className="text-xl text-center py-20">No hay gastos recientes</p>
            :
            (<div className="overflow-auto px-2">
              {data?.recientes.map(gasto => (
                <div key={gasto._id} className="border-b border-b-gray-200 py-2 flex">
                  
                  <div className={` ${gasto.color} rounded-full p-3 mr-3 md:mr-2 mb-2 md:mb-0 flex-shrink-0`}>

                    <div className={` w-4 h-4 rounded-full flex items-center justify-center `}>
                      <i className={`${gasto.icon} ${gasto.colorText} text-[1.125rem] font-bold md:text-[1.125rem]`}></i>
                    </div>
                  </div>

                  <div>
                    <p className="text-[0.875rem] ">{gasto.descripcion}</p>
                    <p className="text-[0.75rem] text-gray-500 ">{gasto.diaSemana}</p>
                  </div>
                  <p className="text-red-600 text-sm mx-auto mr-0">-${formatMoneda(gasto.valor)}</p>
                </div>
              ))}
            </div>)
            )}
          </section>
  
        </div>
      </div>

    </main>
  )
}
