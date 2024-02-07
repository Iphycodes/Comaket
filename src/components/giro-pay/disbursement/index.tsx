'use client';
import { Col, FormInstance, Modal, Row } from 'antd';
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
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

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
  payoutSuccessData: Record<string, any>;
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
    payoutSuccessData,
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<Record<string, any>>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<Record<string, any>>({});
  const { payoutDetails, setPayoutdetails } = useContext(AppContext);
  const mobileResponsive = useMediaQuery(mediaSize.mobile);

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
      case 'totalSuccessfulDisbursements':
        return 'green';
      case 'totalProcessingDisbursements':
        return '#C9DE00';
      case 'totalFailedDisbursements':
        return '#B21F00';
      case 'totalSingleDisbursements':
        return 'rgb(30 136 229)';
      case 'totalBatchDisbursements':
        return 'lightblue';
      default:
        return 'pink';
    }
  };

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
          <Row
            gutter={[0, 20]}
            className="font-semibold pb-2 shadow-sm border-b-2 border-border/100 flex w-full justify-between items-center"
          >
            <Col md={12} xs={24} lg={12}>
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-bold">
                  {balance ? numberFormat(balance.withdrawableAmount / 100, '₦ ') : '₦ 0.00'}
                </span>
                <div className=" font-medium">Current wallet withdrawable balance</div>
              </div>
            </Col>
            <Col md={12} xs={24} lg={12} className={`flex ${!mobileResponsive && 'justify-end'}`}>
              <TopButtons
                isMobile={mobileResponsive}
                setModalOpen={setModalOpen}
                setModalElement={setModalElement}
              />
            </Col>
          </Row>
          <div className="w-full flex flex-col gap-5">
            <Row gutter={mobileResponsive ? [5, 5] : [10, 10]}>
              {disbursementAnalyticsData?.map((disbursmentAnalyticsItem: any, idx: any) => {
                return (
                  <>
                    {disbursmentAnalyticsItem?.label !== 'totalDisbursements' && (
                      <Col
                        xs={
                          disbursmentAnalyticsItem?.label !== 'totalSingleDisbursements' &&
                          disbursmentAnalyticsItem?.label !== 'totalBatchDisbursements'
                            ? 8
                            : 12
                        }
                      >
                        <TransactionStatisticsCard
                          isMobile={mobileResponsive}
                          key={`${idx}`}
                          style={{ flex: 1 }}
                          color={
                            getDisbursementAnalyticsCardsColor(disbursmentAnalyticsItem?.label) ??
                            'blue'
                          }
                          title={
                            camelCaseToSentence(disbursmentAnalyticsItem?.label?.substring(5)) ?? ''
                          }
                          percentage={disbursmentAnalyticsItem?.percent ?? 0}
                          value={disbursmentAnalyticsItem?.value ?? 0}
                        />
                      </Col>
                    )}
                  </>
                );
              }, [])}
            </Row>
            <Row gutter={mobileResponsive ? [0, 10] : [10, 10]} className="w-full">
              <Col lg={16} md={24} xs={24} className="recent-disbursement">
                {/* <DisbursementHistory /> */}
                <RecentDisbursements
                  setOpen={setOpen}
                  setSelectedRecord={setSelectedRecord}
                  recentDisbursementData={recentDisbursementData}
                />
              </Col>
              <Col lg={8} md={24} xs={24} className="flex h-96">
                <PieChartAnaytics disbursementAnalyticsData={disbursementAnalyticsData} />
              </Col>
            </Row>
          </div>
        </div>
        <DisbursementDrawer open={open} setOpen={setOpen} selectedRecord={selectedRecord} />
        <Modal
          className="disbursement-modal overflow-y-scroll"
          title={``}
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setPaymentDetails({});
            setPayoutdetails({});
            setSinglePayoutSteps('step1');
            setBankCode('');
            form.resetFields();
            setModalElement('');
          }}
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
              payoutSuccessData={payoutSuccessData}
            />
          )}
          {modalElement === 'batch-payout' && <BatchPayout />}
        </Modal>
      </motion.div>
    </>
  );
};

export default Disbursement;
