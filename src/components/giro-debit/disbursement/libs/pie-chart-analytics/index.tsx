'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { mockTransactionAnalyticsData } from '@grc/_shared/constant';
import { Card } from 'antd';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartAnaytics = () => {
  let delayed: any;
  return (
    <Card className="piechart-card shadow-sm shadow-gray-100 w-full flex items-center justify-center">
      <div className="text-center w-full mb-5 text-md font-semibold">
        Total Number of Disbursements Made : <span className="font-bold">500</span>
      </div>
      <Doughnut
        className="disbursement-pie mx-auto"
        data={mockTransactionAnalyticsData}
        options={{
          responsive: true,
          plugins: {
            // legend: {
            //   position: 'bottom',
            //   align: 'center',
            // },
            legend: {
              display: false, // Hide legend
            },
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
    </Card>
  );
};

export default PieChartAnaytics;
