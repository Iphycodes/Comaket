import { Button, Col, Modal, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import AddReciepientForm from './libs/add-reciepient-form';
import { ReciepientsDataType } from '@grc/_shared/constant';
import ReciepientsTable from './libs/reciepients-table';
import PayoutSuccess from './libs/payout-success';
import BatchPayoutStarter from './libs/batch-payout-starter';
import CreateBatchForm from './libs/create-batch-form';
import CreateBatchSuccess from './libs/create-batch-success';
import ConfirmPayout from '../confirm-payout';
import { IBalance } from '@grc/_shared/namespace/wallet';

interface BatchPayoutProps {
  balance: IBalance;
}

const BatchPayout = ({ balance }: BatchPayoutProps) => {
  const [batchReciepientsData, setBatchReciepientsData] = useState<ReciepientsDataType[]>([]);
  const [isAddState, setIsAddState] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [steps, setSteps] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'step5'>('step1');
  const [currentBatch, setCurrentBatch] = useState<Record<string, any>>({});

  // const getAmount = () => {
  //   let totalAmount = 0;
  //   batchReciepientsData?.map((batchReciepient: any) => {
  //     totalAmount += batchReciepient?.amount;
  //   });

  //   return totalAmount;
  // };

  const [paymentDetails, setPaymentDetails] = useState<Record<string, any>>({});

  const handleSetPaymentDetails = () => {
    let totalAmount = 0;
    const charges = 25;
    batchReciepientsData?.map((batchReciepient: any) => {
      totalAmount += batchReciepient?.amount;
    });

    const batchPaymentDetails = {
      amount: totalAmount,
      charges: charges,
      reciepients: batchReciepientsData,
    };

    setPaymentDetails(batchPaymentDetails);
  };

  const handleProceedToPayment = () => {
    handleSetPaymentDetails();
    setSteps('step5');
  };

  const handleAddBatchReciepient = (reciepient: ReciepientsDataType) => {
    setBatchReciepientsData([...batchReciepientsData, reciepient]);
  };

  const handleClearBatchReciepients = () => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to Clear all Recipients?, This Action is irreversible',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        setBatchReciepientsData([]);
      },
      onCancel: () => {
        console.log('Action canceled');
      },
    });
    // if (
    //   confirm(
    //     'Are you sure you want to Clear all Recipients?, This Action is irreversible. Click OK to confirm'
    //   )
    // ) {
    //   setBatchReciepientsData([]);
    // }
  };

  const handleConfirmPayment = () => {
    setIsDone(true);
  };

  const handleSetCurrentBatch = (currentBatchItem: Record<string, any>) => {
    setCurrentBatch(currentBatchItem);
    setBatchReciepientsData(currentBatchItem?.reciepients);
    console.log('currentbatch.....................', currentBatchItem);
  };

  // const getBatchPayoutSuccessData = () => {
  //   return {
  //     batchName: currentBatch,
  //     amount: 1000,
  //     charges: 25,
  //   };
  // };

  const handleSetSteps = (steps: 'step1' | 'step2' | 'step3' | 'step4' | 'step5') => {
    setSteps(steps);
  };

  useEffect(() => {
    setSteps('step1');
  }, []);

  return (
    <div className="max-h-[600px] overflow-y-scroll">
      <div className="flex sticky top-0 bg-white dark:bg-[#1f1f1f] z-10 justify-between items-center border-b pb-2">
        <Space className="" size={10}>
          <span
            className="text-[16px] flex justify-center items-center h-12 w-12 bg-blue"
            style={{ borderRadius: '50%' }}
          >
            <i className="ri-group-line text-white text-[18px]"></i>{' '}
          </span>
          <span className="font-bold text-[20px]">
            {steps === 'step2'
              ? 'Create New Batch'
              : steps === 'step3'
                ? 'Batch Created'
                : 'Batch Payout'}
          </span>
        </Space>
      </div>
      {isDone ? (
        <PayoutSuccess payoutSuccessData={{}} title="batch-payout" />
      ) : (
        <>
          {steps === 'step1' && <BatchPayoutStarter handleSetSteps={handleSetSteps} />}
          {steps === 'step2' && (
            <CreateBatchForm
              handleSetCurrentBatch={(values: Record<string, any>) => handleSetCurrentBatch(values)}
              handleSetSteps={handleSetSteps}
            />
          )}
          {steps === 'step3' && (
            <CreateBatchSuccess
              batchName={`${currentBatch?.batchName ?? ''}`}
              handleSetSteps={(steps: 'step1' | 'step2' | 'step3' | 'step4' | 'step5') =>
                handleSetSteps(steps)
              }
            />
          )}
          {steps === 'step4' && (
            <>
              {isAddState ? (
                <AddReciepientForm
                  setIsAdd={setIsAddState}
                  handleAddBatchReciepient={(values) => handleAddBatchReciepient(values)}
                />
              ) : (
                <>
                  <Row className="py-2 items-center border-b">
                    <Col span={10} className="beneficiary-form">
                      {/* <div className="mb-0 text-gray-500">Batch Name</div> */}
                      <span className="font-semibold text-[20px]">{`${
                        currentBatch?.batchName ?? ''
                      } Batch`}</span>
                    </Col>
                    <Col span={14}>
                      <div className="py-4 w-full flex justify-end items-center gap-2">
                        {batchReciepientsData.length !== 0 && (
                          <Button
                            className="opacity-100 flex justify-center text-center hover:opacity-95 font-normal bg-gray-700 text-white h-10"
                            type="primary"
                            disabled={false}
                            loading={false}
                            htmlType="submit"
                            onClick={() => handleClearBatchReciepients()}
                          >
                            <div className="flex items-center gap-2">
                              <span>
                                <i className="ri-delete-bin-4-line text-[18px]"></i>
                              </span>
                              <span>Clear All</span>
                            </div>
                          </Button>
                        )}
                        <Button
                          className="opacity-100 w-[140px] flex justify-center text-center hover:opacity-95 font-normal bg-blue text-white h-10"
                          type="primary"
                          disabled={false}
                          loading={false}
                          htmlType="submit"
                          onClick={() => setIsAddState(true)}
                        >
                          <div className="flex items-center gap-2">
                            <span>
                              <i className="ri-add-line text-[18px]"></i>
                            </span>
                            <span>Add Reciepient</span>
                          </div>
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  <div className="w-full py-2">
                    {batchReciepientsData.length === 0 ? (
                      <div className="w-full flex py-2 justify-center items-center">
                        <span className="w-[350px] text-center text-gray-500 font-semibold">
                          No Reciepient Added Yet,
                          <br /> Click the Add button to add a Reciepient
                        </span>
                      </div>
                    ) : (
                      <div>
                        <ReciepientsTable
                          batchReciepientsData={batchReciepientsData}
                          isEditable={true}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            className="opacity-100 flex items-center justify-center text-center hover:opacity-95 font-normal bg-blue text-white h-12"
                            type="primary"
                            disabled={false}
                            loading={false}
                          >
                            <div className="flex items-center font-semibold gap-2">
                              <span>
                                <i className="ri-save-line text-[18px]"></i>
                              </span>
                              <span>Save Batch Members</span>
                            </div>
                          </Button>
                          <Button
                            className="opacity-100 flex justify-center items-center text-center hover:opacity-95 font-normal bg-green-500 text-white h-12"
                            type="primary"
                            disabled={false}
                            loading={false}
                            onClick={() => handleProceedToPayment()}
                          >
                            <div className="flex items-center font-semibold gap-2">
                              <span>
                                <i className="ri-send-plane-fill text-[18px]"></i>
                              </span>
                              <span>Proceed to Payment</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {steps === 'step5' && (
            <ConfirmPayout
              key="batch-payout"
              handleSuccess={() => handleConfirmPayment()}
              handleSetSteps={handleSetSteps}
              paymentDetails={paymentDetails}
              balance={balance}
              batchReciepientsData={batchReciepientsData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BatchPayout;
