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
import { Doughnut } from "react-chartjs-2";
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
  plugins: {
    legend: {
      display: true,
      align: 'center',
      position: 'top',
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
          if (
            dataChart?.labels &&
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
                datasetIndex: i,
              };
            });
          }
          return [];
        },
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
    },
    tooltip: {
      enabled: false,
      position: 'nearest',
      external: externalTooltipPie,
    },
    title: {
      display: false,
      text: 'Doughnut Chart',
      font: {
        weight: 'bold',
        size: 16,
      },
      position: 'top',
      align: 'start',
    },
    subtitle: {
      display: false,
      text: 'Subtitle',
      font: {
        size: 14,
      },
      position: 'top',
      align: 'start',
    },
  },
  interaction: {
    mode: 'point',
  },
  elements: {
    center: {
      color: '#18181D',
      subText: 'Total',
      subTextcolor: '#59596A',
      fontStyle: 'Inter',
      sidePadding: 24,
    },
  },
  // cutout: true,
};
const plugins = [
  {
    beforeInit: function (chart: any, options: any) {
      const originalFit = chart.legend.fit;

      // Override the fit function
      chart.legend.fit = function fit() {
        // Call original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)();
        // Change the height as suggested in another answers
        this.height += 15;
      }
    },
    beforeDraw: function (chart: any) {
      // if (!displayTextCenter) return;

      //Count total active
      const legendItems = chart.legend.legendItems;
      const activeLegendItems = legendItems?.filter((item: any) => {
        return item.hidden === false;
      });
      const dt = chart.data?.datasets[0].data;
      let totalPie = 0;

      for (let i = 0; i < activeLegendItems.length; i++) {
        totalPie += dt[activeLegendItems[i].datasetIndex];
      }
      if (totalPie === 0) return;

      //Get ctx from string
      const ctx = chart.ctx;

      //Get options from the center object in options
      const centerConfig = chart.config.options.elements.center;
      const fontStyle = centerConfig.fontStyle || 'Inter';
      const txt = totalPie.toString();
      const color = centerConfig.color || '#000';
      const sidePadding = centerConfig.sidePadding || 20;
      const sidePaddingCalculated =
        (sidePadding / 100) * (chart.innerRadius * 2);
      //Start with a base font of 24px
      ctx.font = '24px ' + fontStyle;

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(24 * widthRatio);
      const elementHeight = chart.innerRadius * 2;

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      //Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      ctx.font = 'bold ' + fontSizeToUse + 'px ' + fontStyle;
      ctx.fillStyle = color;

      //Draw text in center
      ctx.font = 'bold 24px ' + fontStyle;
      ctx.fillText(txt, centerX, centerY - 8);

      ctx.font = '14px ' + fontStyle;
      ctx.fillStyle = centerConfig.subTextcolor;
      ctx.fillText('Total', centerX, centerY + 24 - 8);
    },
  }
];
export function DoughnutChart() {
  return (
    <div style={{ width: "300px" }}>
      <Doughnut id="dougnut-222" data={donutData} options={options} plugins={plugins} />
    </div>
  );
}
