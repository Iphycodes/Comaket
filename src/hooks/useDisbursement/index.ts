import {
  selectDisbursementAnalyticsData,
  selectRecentDisbursementData,
} from '@grc/redux/selectors/disbursements';
import { useAppSelector } from '@grc/redux/store';
import { useLazyGetDisbursementsQuery } from '@grc/services/disbursements';
import { useEffect } from 'react';

interface useDisbursementReturnProps {
  getDisbursementAnalyicsResponse: Record<string, any>;
  disbursementAnalyticsData: Record<any, string>[] | any;
  recentDisbursementsData: Record<any, string>[] | any;
}

interface useDisbursementProps {
  callDisbursementAnalytics: boolean;
}

export const useDisbursement = ({
  callDisbursementAnalytics,
}: useDisbursementProps): useDisbursementReturnProps => {
  const { wallet } = useAppSelector((state) => state.auth);
  const walletId = wallet?.id;

  const [triggerDisbursmentAnalytics, getDisbursementAnalyicsResponse] =
    useLazyGetDisbursementsQuery();

  const disbursementParams = {
    filter: JSON.stringify({ virtualAccount: walletId }),
  };

  const disbursementAnalyticsData = useAppSelector((state) =>
    selectDisbursementAnalyticsData(state, disbursementParams)
  );

  const recentDisbursementsData = useAppSelector((state) =>
    selectRecentDisbursementData(state, disbursementParams)
  );

  useEffect(() => {
    if (callDisbursementAnalytics) triggerDisbursmentAnalytics(disbursementParams);
  }, [callDisbursementAnalytics, walletId]);

  return {
    disbursementAnalyticsData,
    recentDisbursementsData,
    getDisbursementAnalyicsResponse,
  };
};
