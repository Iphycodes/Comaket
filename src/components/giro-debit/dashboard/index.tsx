'use client';
import { Button, Card, Col, List, Row, Space, Tag } from 'antd';
import Link from 'next/link';
import { AuthDataType } from '@grc/_shared/namespace/auth';
import SelectVirtualAcct from './libs/select-virtual-acct';
import CreateAcctCard from './libs/create-acct-card';
import { capitalize, startCase, toLower } from 'lodash';
import { ArrowUpIcon, ArrowDownIcon } from '@grc/_shared/assets/svgs';
import { statCardProps, statisticsFilter } from '@grc/_shared/constant';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import formatNumber from '@grc/_shared/helpers';
import { AccountNamespace } from '@grc/_shared/namespace/account';
import CustomModal from '@grc/_shared/components/custom-modal';
import AcctDetails from './libs/acct-details';
import CreateVirtualAcctForm from './libs/create-virtual-acct-form';

type DashBoardProps = {
  authData?: AuthDataType | null;
  transactions: Record<string, any>[];
  setFilter: Dispatch<SetStateAction<string>>;
  currentAccount: AccountNamespace.Account | null;
  handleCreateVirtualAcct: (payload: Record<string, any>) => void;
  openCreateModal: boolean;
  setOpenCreateModal: Dispatch<SetStateAction<boolean>>;
};
const DashBoard = (props: DashBoardProps) => {
  const {
    transactions,
    setFilter,
    currentAccount,
    handleCreateVirtualAcct,
    openCreateModal,
    setOpenCreateModal,
  } = props;
  const [activeFilter, setActiveFilter] = useState('all');
  const [toggleTopUp, setToggleTopUp] = useState(false);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col gap-5">
        <div>
          <div className="text-3xl">Hello, {startCase(toLower(currentAccount?.name))}</div>
          <div className="text-sm mt-2">Here's an overview of your account today</div>
        </div>
        <Row gutter={[16, 16]} className="mt-4 justify-between">
          <Col md={10} xs={24} className="rounded-2xl">
            <Card className="shadow-md hover:border shadow-gray-300">
              <div>
                <SelectVirtualAcct
                  isLoadingAccounts={false}
                  vAccount={{} as any}
                  accounts={[
                    { accountName: 'john doe', accountNumber: '00000', bankName: 'demo' } as any,
                  ]}
                  setVAccount={() => {}}
                />
              </div>
              <div className="mt-9">
                <CreateAcctCard
                  isVerified={true}
                  setOpenCreateModal={() => setOpenCreateModal(true)}
                />
              </div>
            </Card>
          </Col>
          <Col md={12} xs={24} className="rounded-2xl">
            <Card className="flex flex-col gap-2 p-7 shadow-md hover:border shadow-gray-300">
              <div>
                <div>Giro Balance</div>
                <span className="text-3xl mt-3">&#x20A6; 2,500,000.00</span>
              </div>
              <div className="mt-1 text-sm">Account balance</div>
              <span className="text-2xl">&#x20A6; 150,000.00</span>
              <div>
                <Button
                  className="opacity-100 hover:opacity-70 mt-3 bg-blue text-white h-10 rounded-lg font-bold px-8"
                  type="primary"
                  disabled={false}
                  block={false}
                  loading={false}
                  htmlType="submit"
                  onClick={() => setToggleTopUp(true)}
                >
                  Top up
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
        <Row className="mt-16">
          <Col md={24} xs={24}>
            <Card className="shadow-md hover:border shadow-gray-300">
              <header className="flex flex-wrap gap-2 justify-between items-center">
                <span>Transaction Summary</span>
                <div>
                  <Space size={5}>
                    {statisticsFilter.map((filter, index) => (
                      <Button
                        className={`${
                          activeFilter == filter
                            ? 'border border-blue text-blue'
                            : ' bg-white text-black'
                        } `}
                        key={index}
                        onClick={() => {
                          setFilter(() => (filter == 'all' ? '' : filter));
                          setActiveFilter(filter);
                        }}
                        type="default"
                      >
                        {filter.toUpperCase()}
                      </Button>
                    ))}
                  </Space>
                </div>
              </header>
              <section className="w-full flex flex-wrap gap-5 mt-10">
                {statCardProps.map(({ title, value }, idx) => {
                  return (
                    <Fragment key={idx}>
                      <div
                        key={idx}
                        className="h-40 w-48 rounded-lg shadow-md hover:border shadow-gray-200 relative flex justify-center items-center"
                      >
                        <div className="flex flex-col justify-center items-center font-semibold gap-4">
                          <span className="w-[50px] h-[50px] p-4 rounded-full border border-b-slate-900 flex items-center justify-center">
                            {formatNumber(value, 0)}
                          </span>
                          <span>{title}</span>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </section>
            </Card>
          </Col>
        </Row>
        <Row className="mt-16">
          <Col md={12} xs={24}>
            <Card className="shadow-md hover:border shadow-gray-300">
              <List
                header={<div className="font-bold">Recent transactions</div>}
                footer={
                  transactions && (
                    <div className="text-center">
                      <Link prefetch className="text-blue" href={'/apps/giro-debit/transactions'}>
                        See all &rarr;
                      </Link>
                    </div>
                  )
                }
                dataSource={transactions}
                loading={false}
                locale={{
                  emptyText: (
                    <div className="text-gray-500 text-justify">
                      <div>No Data Available</div>
                      <div>
                        Transaction insight will be shown here once you create a virtual account and
                        commence pay-ins and pay-outs
                      </div>
                    </div>
                  ),
                }}
                renderItem={(item: Record<string, any>, index) => (
                  <List.Item className="dashboard-transaction-list" key={index}>
                    <div className="w-full flex justify-between items-center text-left  p-2">
                      <span>
                        {item?.entry === 'debit' ? (
                          <span className="flex items-center gap-2">
                            <ArrowUpIcon /> Pay Out
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <div className="rotate-90">
                              <ArrowDownIcon />
                            </div>
                            Pay In
                          </span>
                        )}
                      </span>{' '}
                      <span>{startCase(capitalize(item?.recipient))}</span>
                      <span>
                        {item?.currency} {item?.amount}
                      </span>{' '}
                      <span>
                        {' '}
                        <Tag
                          color={
                            item?.status === 'successful'
                              ? 'success'
                              : item?.status === 'processing'
                                ? 'processing'
                                : 'red'
                          }
                        >
                          {item?.status}
                        </Tag>
                      </span>
                      <span>{item?.date}</span>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <CustomModal
        component={
          <CreateVirtualAcctForm
            isLoadingCreateVirtualAccount={false}
            handleCreateVirtualAcct={handleCreateVirtualAcct}
          />
        }
        setOpenModal={() => setOpenCreateModal(false)}
        openModal={openCreateModal}
      />
      <CustomModal
        component={
          <AcctDetails
            account={{
              id: '001',
              accountName: 'J Doe',
              accountNumber: '001002003004',
              bankName: 'Test Bank',
            }}
          />
        }
        setOpenModal={() => setToggleTopUp(false)}
        openModal={toggleTopUp}
      />
    </>
  );
};

export default DashBoard;
