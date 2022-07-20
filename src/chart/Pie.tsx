import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";
import chartColors from "./chartColors";
import {hexToRgbA, externalTooltipPie} from "./utilities";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend
);

const labels2 = ["Banana", "Apple", "Orange", "Coconut", "Peach", "Tamarin"];
const donutData = {
  labels: labels2,
  datasets: [
    {
      label: "The sale",
      data: [500, 200, 300, 100, 200, 700],
      backgroundColor: [
        chartColors.CB5,
        chartColors.CO4,
        chartColors.CR6,
        chartColors.CG3,
        chartColors.CP2,
        chartColors.CB7
      ],
      hoverBackgroundColor: [
        chartColors.CB5,
        chartColors.CO4,
        chartColors.CR6,
        chartColors.CG3,
        chartColors.CP2,
        chartColors.CB7
      ]
    }
  ]
};

const options = {
  responsive: true,
  borderWidth: 0,
  // maintainAspectRatio: false,
  // padding: {top: 20, bottom: 20},
  layout: {
    padding: 0
  },
  plugins: {
    subtitle: {
      display: false,
      text: "In 2022",
      font: {
        size: 14,
        family: "Inter"
      },
      padding: { top: 0, bottom: 10 },
      position: "top",
      align: "start"
    },
    title: {
      display: false,
      text: "The sale of fruits",
      font: {
        weight: "bold",
        family: "Inter",
        size: 16
      },
      position: "top",
      align: "start",
      padding: { bottom: 0 }
    },
    tooltip: {
      enabled: false,
      position: 'average',
      external: externalTooltipPie,
    },
    legendDistance: {
      padding: 40
    },
    legend: {
      position: "bottom",
      align: "center",
      fullSize: false,
      labels: {
        font: {
          size: 14,
          family: "Inter",
          lineHeight: 20
        },
        padding: 8,
        boxWidth: 12,
        boxHeight: 12,
        generateLabels: (chart: any) => {
          const { data: dataChart } = chart;
          if (
            dataChart?.labels.length &&
            dataChart.datasets[0].hoverBackgroundColor
          ) {
            return dataChart.labels.map((item: any, i: number) => {
              const meta = chart.getDatasetMeta(0);
              return {
                text: item,
                borderRadius: 3,
                fillStyle: dataChart.datasets[0].hoverBackgroundColor[i],
                strokeStyle: dataChart.datasets[0].hoverBackgroundColor[i],
                hidden:
                  isNaN(dataChart.datasets[0].data[i]) || meta.data[i].active,
                datasetIndex: i
              };
            });
          }
          return [];
        },
        onClick: (e: any, legendItem: any, legend: any) => {
          const index = legendItem.datasetIndex;
          const { legendItems } = legend;
          const ci = legend.chart;

          const lgActives = legendItems.filter(
            (item: any) => item.hidden === true,
          );
          if (legendItems?.length === 1) return;

          if (
            lgActives &&
            lgActives.length === legendItems.length - 1 &&
            !ci.getDatasetMeta(0).data[index].active
          ) {
            for (let i = 0; i < legendItems.length; i++) {
              if (ci.getDatasetMeta(0).data[i].active) {
                ci.getDatasetMeta(0).data[i].active = false;
                ci.getDatasetMeta(0).data[i].hidden = false;
              }
            }

            // Revert background Color
            for (let i = 0; i < legendItems.length; i++) {
              if (legendItem.datasetIndex !== i) {
                const dataset = ci.data.datasets[0];
                const bgColor = hexToRgbA(dataset.hoverBackgroundColor[i]);
                dataset.backgroundColor[i] = bgColor;
              } else {
                const dataset = ci.data.datasets[0];
                dataset.backgroundColor[i] = dataset.hoverBackgroundColor[i];
              }
            }

            ci.update();
            return;
          }

          // Revert background Color
          if (!ci.getDatasetMeta(0).data[index].hidden) {
            for (let i = 0; i < legendItems.length; i++) {
              if (legendItem.datasetIndex !== i) {
                const dataset = ci.data.datasets[0];
                dataset.backgroundColor[i] = dataset.hoverBackgroundColor[i];
              }
            }
          } else {
            for (let i = 0; i < legendItems.length; i++) {
              if (legendItem.datasetIndex !== i) {
                const dataset = ci.data.datasets[0];
                const bgColor = hexToRgbA(dataset.hoverBackgroundColor[i]);
                dataset.backgroundColor[i] = bgColor;
              }
            }
          }

          ci.getDatasetMeta(0).data[index].active = !ci.getDatasetMeta(0).data[
            index
          ].active;
          ci.getDatasetMeta(0).data[index].hidden = !ci.getDatasetMeta(0).data[
            index
          ].hidden;
          ci.update();
        },
        onHover: function (event: any, legendItem: any, legend: any) {
          event.native.target.style.cursor = 'pointer';

          if (legendItem.hidden === true) return;

          const ci = legend.chart;
          const { legendItems } = legend;
          for (let i = 0; i < legendItems.length; i++) {
            if (legendItem.datasetIndex !== i) {
              const dataset = ci.data.datasets[0];
              const bgColor = hexToRgbA(dataset.hoverBackgroundColor[i]);
              dataset.backgroundColor[i] = bgColor;
            }
          }
          ci.update();
        },
        onLeave: function (event: any, legendItem: any, legend: any) {
          event.native.target.style.cursor = 'default';

          const ci = legend.chart;
          const { legendItems } = legend;
          for (let i = 0; i < legendItems.length; i++) {
            if (legendItem.datasetIndex !== i) {
              const dataset = ci.data.datasets[0];
              dataset.backgroundColor[i] = dataset.hoverBackgroundColor[i];
            }
          }
          ci.update();
        },
      }
    } // end legend
  } // end plugins
};
const plugins = [
  {
    id: 'legendDistance',
    beforeInit(chart, args, opts) {
      // Get reference to the original fit function
      const originalFit = chart.legend.fit;

      // Override the fit function
      chart.legend.fit = function fit() {
        // Call original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)();
        // Change the height as suggested in another answers
        this.height += opts.padding || 0;
        this.top += 100;
      }
    }
      //   if (chart.legend.margins) {
      //     // Put some padding around the legend/labels
      //     // chart.legend.options.labels.padding = 20;
      //     // Because you added 20px of padding around the whole legend,
      //     // you will need to increase the height of the chart to fit it
      //     chart.height += 40;
      //   }
      // };
    }
];
export function PieChart() {
  return (
      <Pie id="pie-1122" data={donutData} options={options} plugins={plugins} />
  );
}
