'use client';

import { formatNumber } from '@grc/_shared/helpers';
import Circle from 'react-circle';

interface TransactionStatisticsCardProps {
  title?: string;
  value?: number;
  percentage?: number;
  key?: string;
  style?: React.CSSProperties;
  color?: string;
}

const TransactionStatisticsCard = (props: TransactionStatisticsCardProps) => {
  const { style, color, value, title, percentage } = props;

  return (
    <div
      className="transaction-stat-card dark:bg-zinc-800 border dark:border-gray-500 rounded-xl shadow-sm p-5"
      style={{ ...style }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="text-gray-500 dark:text-gray-100">{title}</div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-0">
            <span className="amount font-semibold text-[32px] text-gray-600 dark:text-gray-100">
              {formatNumber(value ?? 0, 0) ?? ''}
            </span>
            {/* <span className="text-blue">view details</span> */}
          </div>
          <div className="text-blue">
            <Circle
              animate={true}
              animationDuration="2s"
              roundedStroke={true}
              progress={parseFloat(percentage?.toFixed(1) ?? '0') ?? 0} // Specifies the fill percentage of the inner red border
              progressColor={color ?? 'rgb(30 136 229)'} // Sets the color of the inner red border
              bgColor="transparent" // Sets the background color as transparent
              lineWidth={'30'} // Sets the thickness of the blue border
              textStyle={{ fontSize: '6rem' }} // Customizes the text style if needed
              size={'60'} // Sets the size of the circle
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatisticsCard;
