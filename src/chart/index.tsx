import 'chart.js/auto';
import { defaults } from 'chart.js';
import React from 'react';
import Bar from './Bar';
import Doughnut from './Doughnut';
import Pie from './Pie';
import Line from './Line';
import Area from './Area';
import { chartColors } from './chartColors';

export interface ChartProps {
  id?: any;
  ariaLabel?: string;
  className?: string;
  height?: number;
  width?: number;
  type: 'bar' | 'doughnut' | 'pie' | 'line' | 'area';
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

const ChartWrapper: React.ForwardRefRenderFunction<HTMLDivElement, ChartProps> = (
  { type, data, ...props },
  ref,
) => {
  defaults.font.family = 'Inter';

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar type={type} data={data} {...props} />;

      case 'line':
        return <Line type={type} data={data} {...props} />;

      case 'area':
        return <Area type={type} data={data} {...props} />;

      case 'doughnut':
        return <Doughnut type={type} data={data} {...props} />;

      case 'pie':
        return <Pie type={type} data={data} {...props} />;

      default:
        return null;
    }
  };
  return renderChart();
};

export { chartColors };

export default React.forwardRef<HTMLDivElement, ChartProps>(ChartWrapper);
