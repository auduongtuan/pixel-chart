import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import chartColors from "./chartColors";
import {hexToRgbA, externalTooltip} from "./utilities"
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family = "Inter";


const labels = ["January", "February", "March", "April", "May", "June", "July"];
const options = {
  responsive: true,
  plugins: {
    legend: {
      align: "end",
      position: "top",
      labels: {
        font: {
          size: 14,
          lineHeight: 20
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
                fillStyle: item.borderColor,
                strokeStyle: item.borderColor,
                hidden: meta.hidden,
                datasetIndex: i
              };
            });
          }
          return [];
        }
      },
      onHover: function (event: any, legendItem: any, legend: any) {
        event.native.target.style.cursor = 'pointer';

        if (legendItem.hidden === true) return;

        const ci = legend.chart;
        ci.hoveringLegendIndex = legendItem.datasetIndex;
        for (let i = 0; i < ci.data.datasets.length; i++) {
          if (ci.hoveringLegendIndex !== i) {
            const dataset = ci.data.datasets[i];
            const bgColor = hexToRgbA(dataset.borderColor[0]);
            dataset.borderColor = [bgColor];
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
            dataset.borderColor = dataset.hoverBorderColor;
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
              const bgColor = hexToRgbA(dataset.hoverBorderColor);
              dataset.borderColor = [bgColor];
            } else {
              const dataset = ci.data.datasets[i];
              dataset.borderColor = dataset.hoverBorderColor;
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
              dataset.borderColor = dataset.hoverBorderColor;
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
              // const bgColor = hexToRgbA(dataset.borderColor[0]);
              const bgColor = hexToRgbA(dataset.borderColor);
              dataset.borderColor = [bgColor];
            }
          }
        }
        ci.update();
      },
    },
    tooltip: {
      enabled: false,
      position: 'nearest',
      // intersect: false,
      // axis: 'x',
      external: externalTooltip,
    },
    title: {
      display: true,
      // text: 'Line Chart With 0.4 Tension',
      text: "Line Chart",
      // text: "Line Chart",
      font: {
        weight: "bold",
        family: "Inter",
        size: 16
      },
      position: "top",
      align: "start"
    }
    // subtitle: {
    //   display: true,
    //   text: 'Chart Subtitle',
    //   family: 'Inter',
    //   font: {
    //     size: 14,
    //   },
    //   position: 'top',
    //   align: 'start',
    // },
  },
  // indexAxis: 'x',
  interaction: {
    mode: 'dataset',
    // axis: 'xy',
    intersect: false,
  },
  elements: {
    bar: {
      borderRadius: 2
    },
    point: {
      radius: 0.1
    },
    line: {
      borderWidth: 2
      // tension: 0.4,
      // stepped: true,
    }
  },
  scales: {
    x: {
      grid: {
        borderDash: [3, 3],
        borderColor: "#E1E1E3",
        borderWidth: 1.2,
        drawTicks: false,
        drawOnChartArea: true,
        lineWidth: 1.2
      },
      ticks: {
        padding: 8
      }
    },
    y: {
      grid: {
        borderDash: [3, 3],
        borderColor: "#E1E1E3",
        borderWidth: 1.2,
        drawOnChartArea: true,
        drawTicks: false,
        lineWidth: 1.2
      },
      ticks: {
        padding: 8
      }
    }
    // y1: {
    //   position: 'right',
    //   grid: {
    //     display: true,
    //     borderDash: [3, 3],
    //     borderColor: '#E1E1E3',
    //     borderWidth: 1.2,
    //     drawOnChartArea: false,
    //     drawTicks: true,
    //     lineWidth: 1.2,
    //   },
    //   ticks: {
    //     padding: 8,
    //   },
    // },
    // y2: {
    //   position: 'left',
    //   grid: {
    //     display: true,
    //     borderDash: [3, 3],
    //     borderColor: '#E1E1E3',
    //     borderWidth: 1.2,
    //     drawOnChartArea: false,
    //     drawTicks: true,
    //     lineWidth: 1.2,
    //   },
    //   ticks: {
    //     padding: 8,
    //   },
    // },
    // y3: {
    //   position: 'right',
    //   grid: {
    //     borderDash: [3, 3],
    //     borderColor: '#E1E1E3',
    //     borderWidth: 1.2,
    //     drawOnChartArea: false,
    //     drawTicks: true,
    //     lineWidth: 1.2,
    //   },
    //   ticks: {
    //     padding: 8,
    //   },
    // },
  }
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
        if (idxAxis === 'x') {
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(chart.tooltip._active[0].element.x, chartArea.top);
          ctx.lineTo(chart.tooltip._active[0].element.x, chartArea.bottom);
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#9696A0';
          ctx.stroke();
          ctx.restore();
        }
      }
    },
  },
];

export const data = {
  labels,
  datasets: [
    {
      label: "Import",
      data: [997, 232, 629, 90, 565, 988, 162],
      borderColor: chartColors.CO4,
      backgroundColor: '#FFFFFF',
      hoverBorderColor: chartColors.CO4
    },
    {
      label: "Export",
      data: [222, 223, 824, 489, 375, 158, 914],
      borderColor: chartColors.CB5,
      backgroundColor: '#FFFFFF',
      hoverBorderColor: chartColors.CB5,
    }
  ]
};

export function LineChart() {
  return (
      <Line options={options} data={data} plugins={plugins} />
  );
}
