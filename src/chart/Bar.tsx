import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
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

const BarChart: React.RefForwardingComponent<HTMLDivElement, ChartProps> = (
  {
    id,
    className,
    data,
    options,
    tooltip = true,
    width,
    height,
    ariaLabel,
    children,
    plugins,
    ...props
  },
  ref,
) => {
  const barCharRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => barCharRef.current as HTMLDivElement);
  const [customData, setCustomData] = useState(data);

  useEffect(() => {
    const datasets = data.datasets.map((item: any) => {
      const legendColor = item.backgroundColor
        ? item.backgroundColor
        : item.borderColor;
      return {
        backgroundColor: legendColor,
        borderColor: legendColor,
        hoverBackgroundColor: legendColor,
        pointBackgroundColor: '#FFFFFF', // add default point color
        pointHoverBackgroundColor: '#FFFFFF', // add default point color
        ...item,
      };
    });
    setCustomData({ ...data, datasets });
  }, [data, setCustomData]);

  const defaultOptions = {
    indexAxis: 'x',
    plugins: {
      legend: {
        align: 'end',
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
              const bgColor = hexToRgba(dataset.backgroundColor);
              dataset.backgroundColor = bgColor;
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
                const bgColor = hexToRgba(dataset.hoverBackgroundColor);
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
                const bgColor = hexToRgba(dataset.backgroundColor);
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
        axis: 'x',
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
      mode: 'index',
      intersect: false,
    },
    elements: {
      bar: {
        borderRadius: 2,
      },
      point: {
        radius: 0.1,
      },
      line: {
        borderWidth: 2,
      },
    },
    scales: {
      x: {
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

  const defaultPlugins = [
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

  const newOptions = merge(defaultOptions, options);
  const newPlugins = merge(defaultPlugins, plugins);

  return (
    <div
      id={id}
      className={className}
      ref={barCharRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Bar
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

export default React.forwardRef<HTMLDivElement, ChartProps>(BarChart);
