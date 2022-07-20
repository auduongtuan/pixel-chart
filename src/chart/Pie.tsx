import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
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

const PieChart: React.RefForwardingComponent<HTMLDivElement, ChartProps> = (
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
      mode: 'index',
    },
    borderWidth: 0,
  };

  const charRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => charRef.current as HTMLDivElement);
  const [customData, setCustomData] = useState(data);

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

  return (
    <div
      id={id}
      className={className}
      ref={charRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Pie
        id={randomID()}
        aria-label={ariaLabel}
        data={customData}
        options={newOptions}
        plugins={plugins}
        {...props}
      />
      {children}
    </div>
  );
};

export default React.forwardRef<HTMLDivElement, ChartProps>(PieChart);
