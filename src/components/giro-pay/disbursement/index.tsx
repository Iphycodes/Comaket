'use client';
import { FormInstance, Modal } from 'antd';
import TransactionStatisticsCard from './libs/transaction-statistics-card';
import PieChartAnaytics from './libs/pie-chart-analytics';
import TopButtons from './libs/top-buttons';
import RecentDisbursements from '@grc/components/giro-pay/disbursement/libs/recent-disbursement-list';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import DisbursementDrawer from './libs/disbursement-drawer';
import TopUpBalance from './libs/top-up-balance';
import SinglePayout from './libs/single-payout';
import BatchPayout from './libs/batch-payout';
import { CloseIcon } from '@grc/_shared/assets/svgs';
import { camelCaseToSentence, numberFormat } from '@grc/_shared/helpers';
import { IBalance, IBanks, WalletNamespace } from '@grc/_shared/namespace/wallet';
import { motion } from 'framer-motion';
import { capitalize, omit, startCase } from 'lodash';
import { AppContext } from '@grc/app-context';

type DisbursementProps = {
  // openCreateModal: boolean;
  // setOpenCreateModal: Dispatch<SetStateAction<boolean>>;
  loading: {
    isLoadingWallets: boolean;
    isLoadingTotalBalance: boolean;
    isLoadingBanks: boolean;
    isLoadingBankDetails: boolean;
    isPayoutLoading: boolean;
    isVerifyingUser: boolean;
  };
  totalBalance: number | undefined;
  wallet: WalletNamespace.Wallet | null;
  balance: IBalance;
  banks: IBanks[];
  debouncedChangeHandler: (e: string) => void;
  setBankCode: Dispatch<SetStateAction<string>>;
  bankCode: string;
  bankDetails: Record<string, any>;
  searchValue: string;
  form: FormInstance<any>;
  setModalElement: Dispatch<
    SetStateAction<'top-up-balance' | 'single-payout' | 'batch-payout' | ''>
  >;
  modalElement: 'top-up-balance' | 'single-payout' | 'batch-payout' | '';
  setSinglePayoutSteps: Dispatch<SetStateAction<'step1' | 'step2' | 'step3' | 'step4'>>;
  singlePayoutSteps: 'step1' | 'step2' | 'step3' | 'step4';
  handleVerifyUser: (values: Record<string, any>) => void;
  beneficiaryAccounts: Array<Record<string, any>>;
  disbursementAnalyticsData: Record<string, any>[] | any;
  recentDisbursementData: Record<string, any>[] | any;
};

const Disbursement = (props: DisbursementProps) => {
  const {
    loading,
    wallet,
    balance,
    banks,
    debouncedChangeHandler,
    setBankCode,
    bankCode,
    bankDetails,
    searchValue,
    form,
    modalElement,
    setModalElement,
    handleVerifyUser,
    singlePayoutSteps,
    setSinglePayoutSteps,
    beneficiaryAccounts,
    disbursementAnalyticsData,
    recentDisbursementData,
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<Record<string, any>>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<Record<string, any>>({});
  const { payoutDetails, setPayoutdetails } = useContext(AppContext);

  const initialValues = {
    bankName: payoutDetails?.bankName || paymentDetails?.bankName || bankCode,
    accountNumber: payoutDetails?.accountNumber || paymentDetails?.accountNumber || searchValue,
    accountName:
      startCase(capitalize(payoutDetails?.accountName)) ||
      paymentDetails?.accountName ||
      startCase(capitalize(bankDetails?.accountName)),
    amount: paymentDetails?.amount,
    narration: paymentDetails?.narration,
    saveBeneficiary: paymentDetails?.saveBeneficiary,
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues, bankCode, bankDetails?.accountName]);

  useEffect(() => {
    if (bankDetails?.accountName && modalElement === 'single-payout') {
      form.setFieldValue('accountName', bankDetails.accountName);
    }
  }, [form, bankDetails?.accountName, modalElement]);

  const getDisbursementAnalyticsCardsColor = (label: string) => {
    switch (label) {
      case 'totalSuccessfulTransactions':
        return 'green';
      case 'totalProcessingTransactions':
        return '#C9DE00';
      case 'totalFailedTransactions':
        return '#B21F00';
      case 'totalSingleDisbursements':
        return 'rgb(30 136 229)';
      case 'totalBatchDisbursements':
        return 'lightblue';
      default:
        return 'pink';
    }
  };

  // const mockPayoutsData = [
  //   {
  //     color: 'green',
  //     title: 'Total Single Payout',
  //     percentage: 40,
  //     value: 200000,
  //   },
  //   {
  //     color: 'rgb(30 136 229)',
  //     title: 'Total Batch Payout',
  //     percentage: 20,
  //     value: 350000,
  //   },
  //   {
  //     color: '#C9DE00',
  //     title: 'Total Pending Payout',
  //     percentage: 29.5,
  //     value: 55000,
  //   },
  //   {
  //     color: '#B21F00',
  //     title: 'Total Failed Payout',
  //     percentage: 29.5,
  //     value: 16000,
  //   },
  // ];

  return (
    <>
      <motion.div
        style={{ backgroundColor: 'transparent' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring', duration: 1 }}
        className="w-full"
      >
        <div className="w-full flex flex-col gap-5">
          <div className="flex w-full justify-between items-center font-semibold pb-2 shadow-sm border-b-2 border-border/100">
            <div className="flex flex-col gap-1">
              {/* <Space size={5}>
              <WalletIcon />
              <span>Account Balance :</span>
            </Space> */}
              {/* <div className="text-3xl font-bold">&#x20A6;2,500,000.00</div> */}
              <span className="text-4xl font-bold">
                {balance ? numberFormat(balance.withdrawableAmount / 100, '₦ ') : '₦ 0.00'}
              </span>
              {/* <div className=" font-medium">Total account balance from all wallets</div> */}
              <div className=" font-medium">Current wallet withdrawable balance</div>
            </div>
            <TopButtons setModalOpen={setModalOpen} setModalElement={setModalElement} />
          </div>
          <div className="w-full flex flex-col gap-5">
            <div className="flex w-full gap-5 justify-between flex-wrap">
              {disbursementAnalyticsData?.map((disbursmentAnalyticsItem: any, idx: any) => {
                return (
                  <>
                    {disbursmentAnalyticsItem?.label !== 'totalDisbursements' && (
                      <TransactionStatisticsCard
                        key={`${idx}`}
                        style={{ flex: 1 }}
                        color={
                          getDisbursementAnalyticsCardsColor(disbursmentAnalyticsItem?.label) ??
                          'blue'
                        }
                        title={camelCaseToSentence(disbursmentAnalyticsItem?.label) ?? ''}
                        percentage={disbursmentAnalyticsItem?.percent ?? 0}
                        value={disbursmentAnalyticsItem?.value ?? 0}
                      />
                    )}
                  </>
                );
              }, [])}
            </div>
            <div className="w-full flex gap-5">
              <div className="recent-disbursement" style={{ flex: 6 }}>
                {/* <DisbursementHistory /> */}
                <RecentDisbursements
                  setOpen={setOpen}
                  setSelectedRecord={setSelectedRecord}
                  recentDisbursementData={recentDisbursementData}
                />
              </div>
              <div className="flex h-96" style={{ flex: 5 }}>
                <PieChartAnaytics disbursementAnalyticsData={disbursementAnalyticsData} />
              </div>
            </div>
          </div>
        </div>
        <DisbursementDrawer open={open} setOpen={setOpen} selectedRecord={selectedRecord} />
        <Modal
          className="disbursement-modal overflow-y-scroll"
          title={``}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          style={{ minWidth: modalElement === 'batch-payout' ? '700px' : '400px' }}
          footer={null}
          closeIcon={false}
        >
          <div className="relative">
            <CloseIcon
              className="absolute cursor-pointer z-40"
              style={{ top: '-20px', right: '-15px' }}
              onClick={() => {
                setModalOpen(false);
                setPaymentDetails({});
                setPayoutdetails({});
                setSinglePayoutSteps('step1');
                setBankCode('');
                form.resetFields();
                setModalElement('');
              }}
            />
          </div>
          {modalElement === 'top-up-balance' && <TopUpBalance wallet={wallet} />}
          {modalElement === 'single-payout' && (
            <SinglePayout
              beneficiaryAccounts={beneficiaryAccounts}
              handleVerifyUser={handleVerifyUser}
              debouncedChangeHandler={debouncedChangeHandler}
              form={form}
              setBankCode={setBankCode}
              banks={banks}
              loading={omit(loading, ['isLoadingWallets', 'isLoadingTotalBalance'])}
              balance={balance}
              setModalElement={setModalElement}
              paymentDetails={paymentDetails}
              setPaymentDetails={setPaymentDetails}
              singlePayoutSteps={singlePayoutSteps}
              setSinglePayoutSteps={setSinglePayoutSteps}
            />
          )}
          {modalElement === 'batch-payout' && <BatchPayout />}
        </Modal>
      </motion.div>
    </>
  );
};

export default Disbursement;
