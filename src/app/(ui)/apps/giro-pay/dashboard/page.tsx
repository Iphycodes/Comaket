'use client';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '@grc/app-context';
import DashBoard from '@grc/components/giro-pay/dashboard';
import { useWallet } from '@grc/hooks/useWallet';
import { isEmpty } from 'lodash';
import { transactionBal } from '@grc/_shared/helpers';
import { WithLoaderRender } from '@grc/_shared/components/with-app-loder';
import { useTheme } from 'next-themes';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useDashboard } from '@grc/hooks/useDashboard';

const DashboardPage = () => {
  const { authData, currentAccount } = useContext(AppContext);
  const { theme } = useTheme();
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const [, setFilter] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const {
    createWallet,
    createWalletResponse,
    walletsResponse,
    allTotalBalance,
    totalBalanceResponse,
    wallets,
    transactions,
    accountTransactionResponse,
    pagination,
    balance,
    handleWallets,
    wallet,
  } = useWallet({
    callAllWallets: true,
    callAccountTransaction: true,
    callTotalBalance: true,
    callBalance: true,
  });
  const { dashboardAnalyticsData, getDashboardAnalyticsResponse } = useDashboard({
    callDashboardAnalytics: true,
  });

  const isCreatingWallet = createWalletResponse.isLoading;
  const isLoadingDashboardAnalytics = getDashboardAnalyticsResponse.isLoading;
  const isLoadingWallets = walletsResponse.isLoading;
  const isLoadingTotalBalance = totalBalanceResponse.isLoading;
  const isLoadingTransaction = accountTransactionResponse.isFetching;
  const totalBalance = !isEmpty(allTotalBalance) && transactionBal(allTotalBalance);

  const handleCreateWallet = (values: Record<string, any>) => {
    const payload = {
      ...values,
      country: 'NG',
    };

    createWallet({
      payload,
      option: { successMessage: 'Wallet successfully created' },
    }).then(() => setOpenCreateModal(false));
  };

  useEffect(() => {
    if (isEmpty(wallet) && !isEmpty(wallets)) {
      handleWallets(wallets?.[0]);
    }
  }, [wallets, wallet]);

  return (
    <WithLoaderRender
      loading={isLoadingWallets || isLoadingDashboardAnalytics || isLoadingTotalBalance}
      mobileResponsive={mobileResponsive}
      theme={theme}
    >
      <DashBoard
        authData={authData}
        transactions={transactions}
        setFilter={setFilter}
        currentAccount={currentAccount}
        handleCreateWallet={handleCreateWallet}
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
        wallets={wallets}
        wallet={wallet}
        loading={{
          isCreatingWallet,
          isLoadingWallets,
          isLoadingTotalBalance,
          isLoadingTransaction,
          isLoadingDashboardAnalytics,
        }}
        totalBalance={totalBalance}
        pagination={pagination}
        balance={balance}
        dashboardAnalyticsData={dashboardAnalyticsData}
      />
    </WithLoaderRender>
  );
};

export default DashboardPage;
