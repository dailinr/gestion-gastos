"use client"

// import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
//   ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useAppStore } from "@/Stores/useAppStore"
import { Spinner } from "./Spinner"
import { formatDateMes } from "@/Services/formatDate"

export const description = "An area chart with a legend"

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

const chartConfig = {
  ingreso: {
    label: "Ingresos",
    color: "#a5b4fc",
  },
  gasto: {
    label: "Gastos",
    color: "#4f46e5",
  },
} satisfies ChartConfig

export function AreaChartComponent() {

  const fechaActual = new Date

  const { cargandoDashboard, data } = useAppStore()
  const chartData = data.resume

  if ( cargandoDashboard ){
    return ( <Spinner />)
  }

  return (
    <Card className=" pt-5 pb-4 h-full">
      <CardHeader>
        <CardTitle>Grafica resumen del mes</CardTitle>
        <CardDescription>
          {formatDateMes(fechaActual.toString())}
        </CardDescription>
      </CardHeader>
      <CardContent  className="w-full overflow-auto py-0 ">
        <ChartContainer config={chartConfig} className=" h-full w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="rango"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 2)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="gasto"
              type="natural"
              fill="var(--color-gasto)"
              fillOpacity={0.4}
              stroke="var(--color-gasto)"
              stackId="a"
            />
            <Area
              dataKey="ingreso"
              type="natural"
              fill="var(--color-ingreso)"
              fillOpacity={0.4}
              stroke="var(--color-ingreso)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
