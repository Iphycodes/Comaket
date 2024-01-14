'use client';
import { transactionData } from '@grc/_shared/constant';
import { AppContext } from '@grc/app-context';
import DashBoard from '@grc/components/giro-debit/dashboard';
import React, { useContext, useState } from 'react';

const DashboardPage = () => {
  const { authData, currentAccount } = useContext(AppContext);
  const [filter, setFilter] = useState('');
  console.log('filter::', filter);

  return (
    <DashBoard
      authData={authData}
      transactions={transactionData}
      setFilter={setFilter}
      currentAccount={currentAccount}
    />
  );
};

export default DashboardPage;
