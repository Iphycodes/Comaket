'use client';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { Button, Card, Col, List, Row, Select, Space, Tag } from 'antd';
import { numberFormat } from '@grc/_shared/helpers';
import { AccountNamespace } from '@grc/_shared/namespace/account';
import CustomModal from '@grc/_shared/components/custom-modal';
import { AuthDataType } from '@grc/_shared/namespace/auth';
import { CoinIcon, UserSettingsIcon } from '@grc/_shared/assets/svgs';
import { capitalize, startCase, toLower } from 'lodash';
import {
  CashFlowAnalytics,
  MockVirtualAccounts,
  comparativeAnalysisData,
  mockTransactionAnalyticsData,
  mockTransactionAnalyticsData2,
  smoothLineChartData,
  statisticsFilter,
} from '@grc/_shared/constant';
import AcctDetails from './libs/acct-details';
import CreateVirtualAcctForm from './libs/create-virtual-acct-form';
import {
  Chart as ChartJS,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { CashFlowCard } from './libs/cash-flow-card';
import { QuickActionBtn } from './libs/quick-action-btn';
import { EmptyVirtualAccount } from './libs/empty-virtual-account';
import { VirtualAccount } from './libs/virtual-account';
import { ChangePassword } from '../settings/change-password';
import { usePathname } from 'next/navigation';

type DashBoardProps = {
  authData?: AuthDataType | null;
  transactions: Record<string, any>[];
  setFilter: Dispatch<SetStateAction<string>>;
  currentAccount: AccountNamespace.Account | null;
  handleCreateVirtualAcct: (payload: Record<string, any>) => void;
  openCreateModal: boolean;
  setOpenCreateModal: Dispatch<SetStateAction<boolean>>;
};

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const DashBoard = (props: DashBoardProps) => {
  const {
    transactions,
    // setFilter,
    currentAccount,
    handleCreateVirtualAcct,
    openCreateModal,
    setOpenCreateModal,
  } = props;
  const [toggleTopUp, setToggleTopUp] = useState(false);
  const [toggleChangePassword, setToggleChangePassword] = useState(false);
  const [toggleDisbursement, setToggleDisbursement] = useState(false);
  const [activeVAccount, setActiveVAccount] = useState(MockVirtualAccounts[0]?.id);
  const pathname = usePathname();
  const pathUrl = pathname?.split('/');
  const isDashboard = pathUrl?.[3];
  let delayed: any;

  return (
    <>
      <div className="w-full min-h-screen flex flex-col gap-5">
        <div>
          <div className="text-2xl">Hello 👋, {startCase(toLower(currentAccount?.name))}</div>
        </div>
        <Row gutter={[40, 40]}>
          <Col md={12} xs={24}>
            <div className="flex flex-col gap-1">
              <span className=" text-4xl font-semibold">{numberFormat(250000000 / 100, '₦ ')}</span>
              <span>Total account balance from all accounts</span>
            </div>
          </Col>
          <Col md={12} xs={24}>
            <div className="w-full flex flex-col border shadow-sm hover:shadow-md shadow-gray-100 rounded-xl p-5">
              <div className="flex flex-col">
                <span>Virtual Accounts</span>
                <div className="flex gap-3 mt-3 flex-wrap">
                  {MockVirtualAccounts.length >= 1 ? (
                    MockVirtualAccounts.map((vaccount: Record<string, any>, index: any) => (
                      <Fragment key={`${vaccount?.accountNumber}-${index}`}>
                        <VirtualAccount
                          active={activeVAccount === vaccount?.id}
                          setActiveVAccount={setActiveVAccount}
                          virtualAccount={vaccount}
                        />
                      </Fragment>
                    ))
                  ) : (
                    <EmptyVirtualAccount
                      isVerified={false}
                      handleCreateVirtualAccount={() => setOpenCreateModal(true)}
                    />
                  )}
                  {MockVirtualAccounts.length >= 1 && (
                    <div className="w-full">
                      <Button
                        className="opacity-100 hover:opacity-70 mt-3 bg-blue text-white h-10 rounded-lg font-semibold px-8"
                        type="primary"
                        block
                        onClick={() => setOpenCreateModal(true)}
                      >
                        Create Virtual Account
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={[40, 40]} className="mt-3">
          <Col md={12} xs={24}>
            <Row gutter={[30, 30]}>
              {CashFlowAnalytics?.map((data, index) => (
                <Col key={`${data?.type}-${index}`} md={12} xs={24}>
                  <CashFlowCard type={data?.type} amount={data?.amount} count={data?.count} />
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={12} xs={24}>
            <Row className="h-full">
              <div className="w-full flex flex-col border shadow-sm hover:shadow-md shadow-gray-100 rounded-xl p-5">
                <div className="flex flex-col">
                  <span>Quick Actions</span>
                  <div className="flex gap-3 mt-3 flex-wrap">
                    <QuickActionBtn
                      title="send money"
                      icon={<CoinIcon />}
                      handleClick={() => setToggleDisbursement(true)}
                    />
                    <QuickActionBtn
                      title="top up"
                      icon={<CoinIcon />}
                      handleClick={() => setToggleTopUp(true)}
                    />
                    <QuickActionBtn
                      title="change password"
                      icon={<UserSettingsIcon />}
                      handleClick={() => setToggleChangePassword(true)}
                    />
                  </div>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
        <Row gutter={[40, 40]} className="mt-3">
          <Col md={12} xs={24}>
            <Row className="w-full">
              <Card className="border shadow-sm hover:shadow-md shadow-gray-100 h-full w-full">
                <header className="flex flex-wrap gap-2 justify-between items-center">
                  <span className="font-bold">Cash Flow</span>
                  <div>
                    <Space size={7}>
                      <Select
                        loading={false}
                        options={statisticsFilter}
                        defaultValue={statisticsFilter[0]}
                        placeholder="Select a filter"
                      />
                    </Space>
                  </div>
                </header>
                <div className="mt-5 flex items-center justify-center">
                  <Line
                    height={120}
                    redraw
                    className="w-full"
                    options={{
                      responsive: true,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          type: 'category',
                          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        },
                        y: {
                          grid: {
                            display: false,
                          },
                          beginAtZero: true,
                        },
                      },
                      elements: {
                        line: {
                          cubicInterpolationMode: 'monotone',
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },

                      animation: {
                        onComplete: () => {
                          delayed = true;
                        },
                        delay: (context: any) => {
                          let delay = 0;
                          if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 300 + context.datasetIndex * 100;
                          }
                          return delay;
                        },
                      },
                    }}
                    data={smoothLineChartData}
                  />
                </div>
              </Card>
            </Row>
            <Row className="mt-6">
              <Card className="border shadow-sm hover:shadow-md shadow-gray-100 h-full w-full">
                <header className="flex flex-wrap gap-2 justify-between items-center">
                  <span className="font-bold">Transaction Summary</span>
                  <div>
                    <Space size={7}>
                      <Select
                        loading={false}
                        options={statisticsFilter}
                        defaultValue={statisticsFilter[0]}
                        placeholder="Select a filter"
                      />
                    </Space>
                  </div>
                </header>
                <div className="mt-5 flex items-center justify-center">
                  <Doughnut
                    data={mockTransactionAnalyticsData}
                    redraw
                    width={400}
                    height={200}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          align: 'center',
                        },
                      },

                      animation: {
                        onComplete: () => {
                          delayed = true;
                        },
                        delay: (context: any) => {
                          let delay = 0;
                          if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 300 + context.datasetIndex * 100;
                          }
                          return delay;
                        },
                      },
                    }}
                  />
                </div>
              </Card>
            </Row>
          </Col>
          <Col md={12} xs={24}>
            <Card className="w-full border shadow-sm hover:shadow-md shadow-gray-100 h-full">
              <List
                className="overflow-y-auto"
                header={<div>Recent transactions</div>}
                footer={
                  transactions && (
                    <div className="text-center mt-5">
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
                    <div className="w-full flex justify-between items-center text-left p-2">
                      <List.Item.Meta
                        title={startCase(capitalize(item?.recipient))}
                        description={
                          <div className="flex items-center gap-3 ">
                            <span>{moment(item?.createdAt).format('MMM DD, YYYY hh:mm A')}</span>
                            <span>
                              {' '}
                              <Tag
                                className=" min-w-[100px] text-center"
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
                          </div>
                        }
                      />
                      <div>
                        {item?.entry === 'debit' ? (
                          <span className=" text-red-700 font-semibold">- </span>
                        ) : (
                          <span className=" text-green-700 font-semibold">+ </span>
                        )}
                        {numberFormat(item?.amount / 100, '₦ ')}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={[40, 40]} className="mt-3">
          <Col md={12} xs={24}>
            <Card className="border shadow-sm hover:shadow-md shadow-gray-100">
              <header className="flex flex-wrap gap-2 justify-between items-center">
                <span className="font-bold">Transaction Summary</span>
                <div>
                  <Space size={7}>
                    <Select
                      loading={false}
                      options={statisticsFilter}
                      defaultValue={statisticsFilter[0]}
                      placeholder="Select a filter"
                    />
                  </Space>
                </div>
              </header>
              <div className="mt-5 flex items-center justify-center">
                <Bar
                  redraw
                  className="w-full"
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: 'bottom',
                        align: 'center',
                      },
                    },

                    animation: {
                      onComplete: () => {
                        delayed = true;
                      },
                      delay: (context: any) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                          delay = context.dataIndex * 300 + context.datasetIndex * 100;
                        }
                        return delay;
                      },
                    },
                  }}
                  data={mockTransactionAnalyticsData2}
                />
              </div>
            </Card>
          </Col>
          <Col md={12} xs={24}>
            <Card className="border shadow-sm hover:shadow-md shadow-gray-100">
              <header className="flex flex-wrap gap-2 justify-between items-center">
                <span className="font-bold">Comparative Transaction Summary</span>
                <div>
                  <Space size={7}>
                    <Select
                      loading={false}
                      options={statisticsFilter}
                      defaultValue={statisticsFilter[0]}
                      placeholder="Select a filter"
                    />
                  </Space>
                </div>
              </header>
              <div className="mt-5 flex items-center justify-center">
                <Bar
                  redraw
                  className="w-full"
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: 'bottom',
                        align: 'center',
                      },
                    },

                    animation: {
                      onComplete: () => {
                        delayed = true;
                      },
                      delay: (context: any) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                          delay = context.dataIndex * 300 + context.datasetIndex * 100;
                        }
                        return delay;
                      },
                    },
                  }}
                  data={comparativeAnalysisData}
                />
              </div>
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
              accountName: 'The 30th Concept',
              accountNumber: '001002003004',
              bankName: 'Test Bank',
            }}
          />
        }
        setOpenModal={() => setToggleTopUp(false)}
        openModal={toggleTopUp}
      />
      <CustomModal
        component={
          <ChangePassword
            isDashboard={isDashboard?.toLowerCase() === 'dashboard'}
            handleChangePassword={() => {}}
            isChangePasswordLoading={false}
          />
        }
        setOpenModal={() => setToggleChangePassword(false)}
        openModal={toggleChangePassword}
      />

      <CustomModal
        component={<div>Single Payout</div>}
        setOpenModal={() => setToggleDisbursement(false)}
        openModal={toggleDisbursement}
      />
    </>
  );
};

export default DashBoard;
