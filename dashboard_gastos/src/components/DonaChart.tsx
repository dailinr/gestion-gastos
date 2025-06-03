import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { Category } from '@/types'; 

type DonutChartProps = {
  categories: Category[]
}

export const DonutChart = ({ categories }: DonutChartProps) => {

  const chartRef = useRef(null);

   // Extraer etiquetas, valores y colores
   const gastos = categories.filter((item) => item.amount > 0)

   const labels = gastos.map((item => item.name));
   const values = gastos.map((item) => item.amount);
   const backgroundColors = gastos.map((item) => item.hex);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option = {
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '90%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: labels.map((label, index) => ({
              value: values[index],
              name: label,
              itemStyle: {
                color: backgroundColors[index], // Asignar el color correspondiente
              },
            }))
          }
        ]
      };

      chartInstance.setOption(option);

      // Redimensionar el gráfico automáticamente
      const resizeObserver = new ResizeObserver(() => {
        chartInstance.resize();
      });
      resizeObserver.observe(chartRef.current);

      return () => {
        chartInstance.dispose();
        resizeObserver.disconnect();
      };
    }
  }, [categories]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
};

