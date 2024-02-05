import { numberFormat } from '@grc/_shared/helpers';

interface BalanceCardProps {
  availableBalance: number;
  walletDetails: string;
}

const BalanceCard = ({ availableBalance, walletDetails }: BalanceCardProps) => {
  return (
    <div className="border shadow-md dark:bg-zinc-800 rounded-xl dark:border-gray-500 p-5 w-full">
      <div className="flex flex-col-reverse gap-5">
        <div className="border p-2 px-2 text-blue font-semibold border-blue dark:text-gray-100 bg-cyan-50 dark:bg-gray-800 rounded-lg shadow-sm">
          {walletDetails}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-4xl font-bold">
            {availableBalance ? numberFormat(availableBalance / 100, '₦ ') : '₦ 0.00'}
          </div>
          <div className="font-thin">Total Withdrawable balance from this account</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
