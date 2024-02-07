'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { generateDisbursementData } from '@grc/_shared/helpers';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartAnalyticsProps {
  disbursementAnalyticsData: Record<string, any>[] | any;
}

const PieChartAnaytics = ({ disbursementAnalyticsData }: PieChartAnalyticsProps) => {
  const [doughnutData, setDoughnutData] = useState<Record<string, any>[]>([]);

  let totalDisbursement = 0;
  disbursementAnalyticsData?.map((item: any) => {
    if (item?.label === 'totalDisbursements') {
      totalDisbursement = item?.value;
    }
  });

  useEffect(() => {
    const doughnutDataItem: Record<string, any>[] = [];
    disbursementAnalyticsData?.map((item: any) => {
      switch (item?.label) {
        case 'totalSuccessfulDisbursements':
          doughnutDataItem[0] = item;
          break;
        case 'totalProcessingDisbursements':
          doughnutDataItem[1] = item;
          break;
        case 'totalFailedDisbursements':
          doughnutDataItem[2] = item;
          break;
        default:
          console.log('');
      }
    });

    setDoughnutData(doughnutDataItem);
  }, [disbursementAnalyticsData]);

  let delayed: any;
  return (
    <div className="piechart-card shadow-sm dark:bg-zinc-800 border dark:border-gray-500 w-full flex flex-col rounded-xl items-center justify-center">
      <div className="text-center w-full mb-5 text-md font-semibold">
        Total Number of Disbursements Made : <span className="font-bold">{totalDisbursement}</span>
      </div>
      <Doughnut
        className="disbursement-pie mx-auto"
        data={generateDisbursementData(doughnutData)}
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
