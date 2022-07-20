import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {faker} from "@faker-js/faker";
import {hexToRgbA,getOrCreateTooltip,  externalTooltip} from './utilities'
import chartColors from './chartColors'
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family = "Inter";


export const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 14,
          lineHeight: 20,
        },
        padding: 8,
        boxWidth: 12,
        boxHeight: 12,
        generateLabels: (chart: any) => {
          const { data: dataChart } = chart;
          if (dataChart.datasets.length) {
            return dataChart.datasets.map((item: any, i: number) => {
              const meta = chart.getDatasetMeta(i);
              return {
                text: item.label,
                borderRadius: 3,
                fillStyle: item.hoverBackgroundColor,
                strokeStyle: item.hoverBackgroundColor,
                hidden: meta.hidden,
                datasetIndex: i,
              };
            });
          }
          return [];
        },
      },
      onHover: function (event: any, legendItem: any, legend: any) {
        event.native.target.style.cursor = 'pointer';

        if (legendItem.hidden === true) return;

        const ci = legend.chart;
        ci.hoveringLegendIndex = legendItem.datasetIndex;
        for (let i = 0; i < ci.data.datasets.length; i++) {
          if (ci.hoveringLegendIndex !== i) {
            const dataset = ci.data.datasets[i];
            const bgColor = hexToRgbA(dataset.backgroundColor);
            dataset.backgroundColor = [bgColor];
          }
        }
        ci.update();
      },
      onLeave: function (event: any, legendItem: any, legend: any) {
        event.native.target.style.cursor = 'default';

        const ci = legend.chart;
        ci.hoveringLegendIndex = legendItem.datasetIndex;
        for (let i = 0; i < ci.data.datasets.length; i++) {
          if (ci.hoveringLegendIndex !== i) {
            const dataset = ci.data.datasets[i];
            dataset.backgroundColor = dataset.hoverBackgroundColor;
          }
        }
        ci.update();
      },
      onClick: (e: any, legendItem: any, legend: any) => {
        const { legendItems } = legend;
        const ci = legend.chart;
        const index = legendItem.datasetIndex;
        const lgActives = legendItems.filter(
          (item: any) => item.hidden === true,
        );
        if (legendItems?.length === 1) return;

        if (
          lgActives &&
          lgActives.length === legendItems.length - 1 &&
          ci.isDatasetVisible(index)
        ) {
          for (let i = 0; i < legendItems.length; i++) {
            if (!ci.isDatasetVisible(i)) {
              ci.show(i);
              legendItem.hidden = false;
            }
          }

          // Revert background Color
          ci.hoveringLegendIndex = legendItem.datasetIndex;
          for (let i = 0; i < ci.data.datasets.length; i++) {
            if (ci.hoveringLegendIndex !== i) {
              const dataset = ci.data.datasets[0];
              const bgColor = hexToRgbA(dataset.hoverBackgroundColor);
              dataset.backgroundColor = bgColor;
            } else {
              const dataset = ci.data.datasets[i];
              dataset.backgroundColor = dataset.hoverBackgroundColor;
            }
          }
          ci.update();

          return;
        }

        if (ci.isDatasetVisible(index)) {
          ci.hide(index);
          legendItem.hidden = true;

          // Revert background Color
          ci.hoveringLegendIndex = legendItem.datasetIndex;
          for (let i = 0; i < ci.data.datasets.length; i++) {
            if (ci.hoveringLegendIndex !== i) {
              const dataset = ci.data.datasets[i];
              dataset.backgroundColor = dataset.hoverBackgroundColor;
            }
          }
        } else {
          ci.show(index);
          legendItem.hidden = false;

          // Revert background Color
          ci.hoveringLegendIndex = legendItem.datasetIndex;
          for (let i = 0; i < ci.data.datasets.length; i++) {
            if (ci.hoveringLegendIndex !== i) {
              const dataset = ci.data.datasets[i];
              const bgColor = hexToRgbA(dataset.backgroundColor);
              dataset.backgroundColor = bgColor;
            }
          }
        }
        ci.update();
      },
    },
    tooltip: {
      enabled: false,
      position: 'average',
      intersect: false,
      external: externalTooltip,
    },
    title: {
      display: true,
      text: 'Bar Chart',
      font: {
        weight: 'bold',
        size: 16,
      },
      position: 'top',
      align: 'start',
    },
    subtitle: {
      display: true,
      text: 'Test',
      font: {
        size: 14,
      },
      position: 'top',
      align: 'start',
    },
  },
  indexAxis: 'x',
  interaction: {
    intersect: false,
    mode: 'index',
  },
  elements: {
    bar: {
      borderRadius: 2,
    },
    point: {
      radius: 0.1
    },
    line: {
      borderWidth: 2
    }
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        borderDash: [3, 3],
        borderColor: '#E1E1E3',
        borderWidth: 1.2,
        drawTicks: false,
        drawOnChartArea: true,
        lineWidth: 1.2,
      },
      ticks: {
        padding: 8,
      },
    },
    y: {
      // stacked: true,
      grid: {
        borderDash: [3, 3],
        borderColor: '#E1E1E3',
        borderWidth: 1.2,
        drawOnChartArea: true,
        drawTicks: false,
        lineWidth: 1.2,
      },
      ticks: {
        padding: 8,
      },
    },
  },
};
const plugins = [
  {
    beforeDraw: function (chart: any) {
      if (
        chart.tooltip._active &&
        chart.tooltip._active.length &&
        chart.config.options.interaction.mode === 'index'
      ) {
        if (!chart.tooltip.dataPoints) return;
        const idxAxis = chart.config.options.indexAxis;
        const totalCol =
          chart.data.datasets.length > 0
            ? chart.data.datasets[0].data.length
            : 0;
        if (idxAxis === 'x') {
          const dataIndex = chart.tooltip?.dataPoints[0].dataIndex;
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;

          const lt =
            dataIndex === 0
              ? chartArea.left
              : chartArea.left + (chartArea.width / totalCol) * dataIndex;
          ctx.save();
          ctx.fillStyle = 'rgba(241, 241, 241, 0.85)';
          ctx.fillRect(
            lt,
            chartArea.top,
            chartArea.width / totalCol,
            chartArea.bottom - chartArea.top,
          );
          ctx.restore();
        } else {
          const dataIndex = chart.tooltip?.dataPoints[0].dataIndex;
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;

          const oy =
            dataIndex === 0
              ? chartArea.top
              : chartArea.top + (chartArea.height / totalCol) * dataIndex;
          ctx.save();
          ctx.fillStyle = 'rgba(241, 241, 241, 0.85)';
          ctx.fillRect(
            chartArea.left,
            oy,
            chartArea.width,
            chartArea.height / totalCol,
          );
          ctx.restore();
        }
      }
    },
  },
];
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
  labels,
  datasets: [
    {
      label: 'Import',
      data: [997,232,629,90,565,988,162],
      borderColor: chartColors.CO4,
      backgroundColor: chartColors.CO4,
      hoverBackgroundColor: chartColors.CO4,
      hoverBorderColor: chartColors.CO4,
    },
    {
      label: 'Export',
      data: [222,223,824,489,375,158,914],
      borderColor: chartColors.CB5,
      backgroundColor: chartColors.CB5,
      hoverBackgroundColor: chartColors.CB5,
      hoverBorderColor: chartColors.CB5
    },
  ],
};


export function BarChart() {
  return <Bar id="bar-2211" options={options} plugins={plugins} data={data} />;
}
