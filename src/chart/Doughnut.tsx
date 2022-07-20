import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { randomID } from '../utils/randomid';
import { hexToRgba } from '../utils/color';
import externalTooltip from './tooltip';
import { merge } from 'lodash';

export interface ChartProps {
  id?: any;
  ariaLabel?: string;
  className?: string;
  height?: number;
  width?: number;
  type?: any;
  data: any;
  options?: any;
  fallbackContent?: React.ReactNode;
  plugins?: any;
  tooltip?: boolean;
  children?: any;
  getDataSetAtEvent?: (
    dataset: any,
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => void;
  getElementAtEvent?: (
    element: any,
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => void;
  getElementsAtEvent?: (
    element: any,
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => void;
}

const DoughnutChart: React.RefForwardingComponent<
  HTMLDivElement,
  ChartProps
> = (
  {
    id,
    className,
    ariaLabel,
    data,
    options,
    plugins,
    width,
    height,
    children,
    tooltip = true,
    ...props
  },
  ref,
) => {
  const defaultOptions = {
    plugins: {
      legend: {
        display: true,
        align: 'start',
        position: 'right',
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
                const bgColor = hexToRgba(dataset.hoverBackgroundColor[i]);
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
                const bgColor = hexToRgba(dataset.hoverBackgroundColor[i]);
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
              const bgColor = hexToRgba(dataset.hoverBackgroundColor[i]);
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
        external: tooltip && externalTooltip,
      },
      title: {
        display: false,
        text: '',
        font: {
          weight: 'bold',
          size: 16,
        },
        position: 'top',
        align: 'start',
      },
      subtitle: {
        display: false,
        text: '',
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
        subText: '',
        subTextcolor: '#59596A',
        fontStyle: 'Inter',
        sidePadding: 24,
      },
    },
    borderWidth: 0,
    cutout: '50%',
  };

  const charRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => charRef.current as HTMLDivElement);
  const [customData, setCustomData] = useState(data);

  const defaultPlugins = [
    {
      beforeDraw: function (chart: any) {
        const centerText =
          chart.config._config.options.elements.center?.subText;
        if (!centerText || centerText === '') return;

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
        // add 8 spacing for visual adjustment
        const VISUAL_ADJUSTMENT = 4;
        const TEXT_SPACING = 24;
        ctx.fillText(txt, centerX, centerY - VISUAL_ADJUSTMENT);

        ctx.font = '14px ' + fontStyle;
        ctx.fillStyle = centerConfig.subTextcolor;
        ctx.fillText(
          centerText,
          centerX,
          centerY + TEXT_SPACING - VISUAL_ADJUSTMENT,
        );
      },
    },
  ];

  useEffect(() => {
    const datasets = data.datasets.map((item: any) => {
      return {
        hoverBackgroundColor: item.backgroundColor,
        borderColor: item.backgroundColor,
        ...item,
      };
    });
    setCustomData({ ...data, datasets });
  }, [data, setCustomData]);

  const newOptions = merge(defaultOptions, options);
  const newPlugins = merge(defaultPlugins, plugins);

  return (
    <div
      id={id}
      className={className}
      ref={charRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Doughnut
        id={randomID()}
        aria-label={ariaLabel}
        data={customData}
        options={newOptions}
        plugins={newPlugins}
        {...props}
      />
      {children}
    </div>
  );
};

export default React.forwardRef<HTMLDivElement, ChartProps>(DoughnutChart);
