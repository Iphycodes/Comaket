'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { mockTransactionAnalyticsData } from '@grc/_shared/constant';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartAnaytics = () => {
  let delayed: any;
  return (
    <div className="piechart-card shadow-sm dark:bg-zinc-800 border dark:border-gray-500 w-full flex flex-col rounded-xl items-center justify-center">
      <div className="text-center w-full mb-5 text-md font-semibold">
        Total Number of Disbursements Made : <span className="font-bold">500</span>
      </div>
      <Doughnut
        className="disbursement-pie mx-auto"
        data={mockTransactionAnalyticsData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              align: 'center',
            },
            // legend: {
            //   display: false, // Hide legend
            // },
          },

          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context: any) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
        }}
      />
    </div>
  );
};

export default PieChartAnaytics;