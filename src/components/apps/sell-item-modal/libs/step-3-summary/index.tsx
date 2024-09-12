import { Button, Col, Row } from 'antd';
import Image from 'next/image';
import React from 'react';

interface SellItemStep2Props {
  handleCompleted: () => void;
  handleSetCurrentStep: (step: 'step1' | 'step2' | 'step3') => void;
  basicInfoData: Record<string, any>;
  locationAndPricingData: Record<string, any>;
}

const SellItemStep3 = ({
  handleCompleted,
  basicInfoData,
  locationAndPricingData,
}: SellItemStep2Props) => {
  return (
    <div className="w-full">
      <div
        className="min-h-[460px] max-h-[460px] overflow-y-scroll w-full"
        style={{
          overflowY: 'scroll',
          scrollbarWidth: 'thin',
          // scrollbarColor: 'black',
          // scrollbarGutter: 'auto',
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-muted-foreground">Image</div>
            <div className="border w-full border-neutral-300 p-2 rounded-lg mb-4">
              <Row gutter={[10, 10]} className="w-full">
                {[{}, {}, {}, {}, {}, {}, {}].map(() => {
                  return (
                    <Col className="flex justify-center items-center relative" md={4} xl={4}>
                      <div className="w-full ">
                        <Image
                          src={'/assets/imgs/sneakers.jpg'}
                          alt="upload-image"
                          width={150}
                          height={200}
                          style={{ width: '100%', height: '70px' }}
                          className="rounded-md"
                        />
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Name</span>
            <span className="font-semibold">{basicInfoData?.name ?? '-'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Description</span>
            <pre className="">{basicInfoData?.description ?? '-'}</pre>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Condition</span>
            <span className="font-semibold">{basicInfoData?.condition ?? '-'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Location</span>
            <span className="font-semibold">{locationAndPricingData?.location ?? '-'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Ask Price</span>
            <span className="font-semibold">{`\u20A6${
              locationAndPricingData?.askPrice ?? 0
            }`}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Fee</span>
            <span className="font-semibold">{`\u20A6${locationAndPricingData?.fee ?? 0}`}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Negotiable</span>
            <span className="font-semibold">
              {locationAndPricingData?.negotiable ? 'Yes (Negotiable)' : 'No (Not Negotiable)'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <Button
          className="opacity-100 hover:opacity-70 mt-1.5 bg-neutral-900 text-white h-12 rounded-md px-6"
          type="primary"
          block={false}
          onClick={() => handleCompleted()}
        >
          Proceed to Post Item
        </Button>
      </div>
    </div>
  );
};

export default SellItemStep3;
