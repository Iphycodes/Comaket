'use client';
import { transactionData } from '@grc/_shared/constant';
import { AppContext } from '@grc/app-context';
import DashBoard from '@grc/components/giro-pay/dashboard';
import React, { useContext, useState } from 'react';

const DashboardPage = () => {
  const { authData, currentAccount } = useContext(AppContext);
  const [filter, setFilter] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  console.log('filter::', filter);

  const handleCreateVirtualAcct = (values: Record<string, any>) => {
    const payload = {
      ...values,
      country: 'NG',
    };
    console.log('handleCreateVirtualAcct::', payload);
    setOpenCreateModal(false);
  };

  return (
    <DashBoard
      authData={authData}
      transactions={transactionData}
      setFilter={setFilter}
      currentAccount={currentAccount}
      handleCreateVirtualAcct={handleCreateVirtualAcct}
      openCreateModal={openCreateModal}
      setOpenCreateModal={setOpenCreateModal}
    />
  );
};

export default DashboardPage;
