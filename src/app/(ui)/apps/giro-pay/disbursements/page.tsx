'use client';

import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { WithLoaderRender } from '@grc/_shared/components/with-app-loder';
import { transactionBal } from '@grc/_shared/helpers';
import { AppContext } from '@grc/app-context';
import Disbursement from '@grc/components/giro-pay/disbursement';
import { useAuth } from '@grc/hooks/useAuth';
import { useBankAccount } from '@grc/hooks/useBankAccount';
import { useDisbursement } from '@grc/hooks/useDisbursement';
import { useSearch } from '@grc/hooks/useSearch';
import { useWallet } from '@grc/hooks/useWallet';
import { Form } from 'antd';
import { isEmpty, omit } from 'lodash';
import { useTheme } from 'next-themes';
import React, { useContext, useEffect, useState } from 'react';

const DisbursementPage = () => {
  const { theme } = useTheme();
  const [form] = Form.useForm();
  const { payoutDetails, setPayoutdetails } = useContext(AppContext);
  const [modalElement, setModalElement] = useState<
    'top-up-balance' | 'single-payout' | 'batch-payout' | ''
  >('top-up-balance');
  const [singlePayoutSteps, setSinglePayoutSteps] = useState<'step1' | 'step2' | 'step3' | 'step4'>(
    'step1'
  );
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { searchValue, debouncedChangeHandler } = useSearch();
  const [bankCode, setBankCode] = useState('');
  const receivedBankCode = bankCode?.split('-')?.[1];
  const { disbursementAnalyticsData, recentDisbursementsData } = useDisbursement({
    callDisbursementAnalytics: true,
  });

  const {
    walletsResponse,
    allTotalBalance,
    totalBalanceResponse,
    wallet,
    balance,
    banks,
    banksResponse,
    validateBankDetails,
    bankDetailsResponse,
    singlePayout,
    singlePayoutResponse,
    batchPayout,
    batchPayoutResponse,
  } = useWallet({
    callAllWallets: true,
    callTotalBalance: true,
    callBalance: true,
    callBanks: true,
  });

  const { verifyUser, verifyUserResponse } = useAuth({});
  const { beneficiaryAccounts } = useBankAccount({
    callAllBankAccount: modalElement === 'single-payout',
  });

  const isLoadingWallets = walletsResponse.isLoading;
  const isLoadingTotalBalance = totalBalanceResponse.isLoading;
  const isLoadingBanks = banksResponse.isLoading;
  const bankDetails = bankDetailsResponse?.data?.data;
  const isLoadingBankDetails = bankDetailsResponse.isLoading;
  const isVerifyingUser = verifyUserResponse.isLoading;
  const isPayoutLoading = singlePayoutResponse.isLoading || batchPayoutResponse.isLoading;
  const payoutSuccessData = singlePayoutResponse?.data?.data;
  const totalBalance = !isEmpty(allTotalBalance) && transactionBal(allTotalBalance);

  const handleVerifyUser = (values: Record<string, any>) => {
    verifyUser({
      payload: values,
      options: {
        noSuccessMessage: true,
      },
    });
  };

  const handleSendMoney = (values: Record<string, any>) => {
    let payload;

    console.log('send money values::', values);
    if (modalElement === 'single-payout') {
      if (!isEmpty(bankDetails)) {
        payload = {
          ...omit(values, ['bankName', 'accountNumber', 'amount', 'beneficiary']),
          ...omit(bankDetails, ['nameEnquiryRef']),
          amount: values?.amount * 100,
          bankCode: receivedBankCode,
          sourceAccount: wallet?._id,
        };
      } else {
        payload = {
          ...omit(values, ['bankName', 'amount', 'beneficiary']),
          amount: values?.amount * 100,
          bankCode: receivedBankCode,
          sourceAccount: wallet?._id,
        };
      }
      singlePayout({
        payload,
        options: {
          successMessage: 'Money sent',
        },
      }).then(() => {
        setSinglePayoutSteps('step4');
        setPayoutdetails({});
        form.resetFields();
      });
    } else {
      payload = values?.batches?.map((value: Record<string, any>) => ({
        bankCode: value?.bankName?.split('-')?.[1],
        accountNumber: value?.accountNumber,
        amount: value?.amount * 100,
        sourceAccount: wallet?._id,
        narration: value?.narration,
      }));

      batchPayout({ payload: { batches: payload } }).then(() => {
        // setSinglePayoutSteps('step5')
      });
    }
  };

  useEffect(() => {
    if (searchValue?.toString()?.length === 10 && !isEmpty(bankCode)) {
      const payload = {
        accountNumber: searchValue?.toString(),
        bankCode: receivedBankCode,
      };
      validateBankDetails({
        payload,
        options: { successMessage: 'Bank Details Retrieved' },
      });
    }
    // return () => setSearchValue('');
  }, [searchValue, bankCode]);

  useEffect(() => {
    if (verifyUserResponse) {
      if (verifyUserResponse.data) {
        const { success } = verifyUserResponse.data.data;
        if (success) {
          handleSendMoney(payoutDetails);
        }
      }
    }
  }, [verifyUserResponse]);

  return (
    <WithLoaderRender
      loading={isLoadingWallets || isLoadingTotalBalance}
      mobileResponsive={mobileResponsive}
      theme={theme}
    >
      <Disbursement
        wallet={wallet}
        balance={balance}
        totalBalance={totalBalance}
        loading={{
          isLoadingWallets,
          isLoadingTotalBalance,
          isLoadingBanks,
          isLoadingBankDetails,
          isPayoutLoading,
          isVerifyingUser,
        }}
        banks={banks}
        debouncedChangeHandler={debouncedChangeHandler}
        bankCode={bankCode}
        setBankCode={setBankCode}
        bankDetails={bankDetails}
        searchValue={searchValue}
        form={form}
        setModalElement={setModalElement}
        modalElement={modalElement}
        singlePayoutSteps={singlePayoutSteps}
        setSinglePayoutSteps={setSinglePayoutSteps}
        handleVerifyUser={handleVerifyUser}
        beneficiaryAccounts={beneficiaryAccounts}
        disbursementAnalyticsData={disbursementAnalyticsData}
        recentDisbursementData={recentDisbursementsData}
        payoutSuccessData={payoutSuccessData}
      />
    </WithLoaderRender>
  );
};

export default DisbursementPage;
