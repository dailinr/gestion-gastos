import {
  Card as CardBoard,
  CardAction,
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
import { useEffect} from "react"
import { Spinner } from "@/components/Spinner"
import { formatMoneda } from "@/Services/formatMoneda"

export const Dashboard = () => {
  
  const { cuentaActual, categoriesSemana, setCategories, 
    gastosRecientes, setGastosRecientes, setResumeSemana } = useAppStore()

  useEffect(() => {
    setCategories()
    setGastosRecientes()
    setResumeSemana()
  },[cuentaActual])

  
  const cards : Category[] = cuentaActual ? [
    {
      id: 1,
      name: "Ingresos",
      icon: "business-finance-corporate-22-svgrepo-com",
      amount: cuentaActual.totalIngresos,
      color: "bg-[#C7E9F9]",
      colorText: "text-[#C7E9F9]",
      hex: "black"
    },
    {
      id: 2,
      name: "Gastos",
      icon: "business-finance-corporate-26-svgrepo-com",
      amount: cuentaActual.totalGastos,
      color: "bg-[#FFD9D9]",
      colorText: "text-[#FFD9D9]",
      hex: "black"
    },
    {
      id: 3,
      name: "Acumulado",
      icon: "finance-svgrepo-com",
      amount: cuentaActual.totalSemanal,
      color: "bg-[#CFF3AF]",
      colorText: "text-[#CFF3AF]",
      hex: "black"
    },
  ] : []

  return (
    <main className="flex-1 grid grid-cols-1 md:grid-cols-[57%_1fr] gap-4 md:overflow-hidden">

      <div className="h-full overflow-auto">
        <div className="grid grid-rows-[110px_200px_minmax(0,_1fr)] grid-cols-3 gap-4 h-full">
          {cards.map(card => (
            <Card key={card.id} data={card} type="card" />
          ))}
  
          <div className="col-span-3 grid grid-cols-2 gap-4 h-full">

            {/* Grafica resumen de gastos   */}
            <CardBoard className=" py-2 px-4 h-full  flex flex-col overflow-auto">
              {categoriesSemana.length === 0 ? (
                <Spinner />
              ): 
              (<>
                <CardHeader className="px-0 gap-0">
                  <CardTitle className="text-md font-semibold pt-1">Resumen de Gastos</CardTitle>
                  <CardDescription className="text-gray-500 font-semibold mb-0 text-[12px]">última semana</CardDescription>
                  <CardAction>
                    <i className='bx bx-right-arrow-alt text-xl cursor-pointer text-[#9B9B9B] border border-[#9B9B9B] p-1 rounded-full'></i>
                  </CardAction>
                </CardHeader>

                <CardContent className="px-0 md:flex gap-x-3">
                  <div className="w-full">
                    <DonutChart categories={categoriesSemana} />
                  </div>
                  <div className="flex flex-col mx-auto mr-0">
                    {categoriesSemana.map(cat => cat.amount > 0 && (

                      <div key={cat.id} className={`flex items-center`}>
                        <i className={`bx bxs-circle ${cat.color} text-transparent text-[8px] mr-1`}/>
                        <span className="text-[12px] align-center">{cat.name}</span> 
                      </div>
                    ))}
                  </div>
                </CardContent>
                </>
              )}
            </CardBoard>
  
            {/* Progreso de ahorros */}
            <CardBoard className=" py-2 px-4 h-full  flex flex-col overflow-auto">
              <CardHeader className="px-0 gap-0">
                <CardTitle className="text-md font-semibold pt-1">Metas de Ahorro</CardTitle>
                <CardDescription className="text-gray-500 font-semibold mb-3 text-md">${formatMoneda(45000)}</CardDescription>
                <CardAction>
                  <i className='bx bx-right-arrow-alt text-xl cursor-pointer text-[#9B9B9B] border border-[#9B9B9B] p-1 rounded-full'></i>
                </CardAction>
              </CardHeader>
              <CardContent className="px-0">
                <Progress value={55} />
              </CardContent>
              <CardFooter className="w-full h-[45px] rounded-lg bg-[#F6F6FA] text-xl flex items-center justify-center">
                <p>${formatMoneda(25000)}</p>
              </CardFooter>
            </CardBoard>

          </div> 
  
          <div className="bg-white col-span-3 rounded-xl shadow px-4 py-2 h-full relative flex flex-col">
            <i className='bx bx-right-arrow-alt text-xl absolute right-4 cursor-pointer text-[#9B9B9B] border border-[#9B9B9B] p-1 rounded-full'></i>
            <h1 className="text-md font-semibold pt-1">Gastos por Categoria</h1>
            <p className="text-gray-500 mb-2 font-semibold text-[12px]">última semana</p>
            <div className="flex-1 overflow-auto ">
              <div className="flex flex-wrap gap-y-4 h-full items-center justify-between ">
                {categoriesSemana.length === 0 ? (
                  <Spinner />
                ): 
                (categoriesSemana.map(category => {
                  return <Card key={category.id} data={category} type="category" />;
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
  
          <section className="w-full h-full shadow-2xl flex flex-col bg-white rounded-xl px-2 py-2 relative ">
            <i className='bx bx-right-arrow-alt text-xl absolute right-6 cursor-pointer text-[#9B9B9B] border border-[#9B9B9B] p-1 rounded-full'></i>
            <h1 className="text-md font-semibold px-2 py-1">Gastos Recientes</h1>
              
            {!cuentaActual.gastos ? (
              <Spinner />
            ): (gastosRecientes.length === 0 ? 
              <p className="text-xl text-center py-20">No hay gastos recientes</p>
            :
            (<div className="overflow-auto px-2">
              {gastosRecientes.map(gasto => (
                <div key={gasto._id} className="border-b border-b-gray-200 py-2 flex">
                  
                  <div className={` ${gasto.color} rounded-full p-3 mr-3 md:mr-2 mb-2 md:mb-0 flex-shrink-0`}>

                    <div className={` w-4 h-4 rounded-full flex items-center justify-center `}>
                      <i className={`${gasto.icon} ${gasto.colorText} text-[18px] font-bold md:text-[18px]`}></i>
                    </div>
                  </div>

                  <div>
                    <p className="text-[14px] ">{gasto.descripcion}</p>
                    <p className="text-[12px] text-gray-500 ">{gasto.diaSemana}</p>
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
