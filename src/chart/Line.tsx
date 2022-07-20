import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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

const LineChart: React.RefForwardingComponent<HTMLDivElement, ChartProps> = (
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
  const barCharRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => barCharRef.current as HTMLDivElement);
  const [customData, setCustomData] = useState(data);

  useEffect(() => {
    const datasets = data.datasets.map((item: any) => {
      return {
        backgroundColor: item.borderColor,
        hoverBorderColor: item.borderColor,
        pointBackgroundColor: '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
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
                  fillStyle: item.borderColor,
                  strokeStyle: item.borderColor,
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
              const bgColor = hexToRgba(dataset.borderColor);
              dataset.borderColor = bgColor;
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
                const bgColor = hexToRgba(dataset.hoverBorderColor);
                dataset.borderColor = bgColor;
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
                const bgColor = hexToRgba(dataset.borderColor);
                dataset.borderColor = bgColor;
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
        tension: 0,
        stepped: false,
      },
    },
    scales: {
      x: {
        stacked: false,
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
        stacked: false,
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

  const newOptions = merge(defaultOptions, options);
  const newPlugins = merge(defaultPlugins, plugins);

  return (
    <div
      id={id}
      className={className}
      ref={barCharRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Line
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

export default React.forwardRef<HTMLDivElement, ChartProps>(LineChart);
