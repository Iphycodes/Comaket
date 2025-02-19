// import { Button, Col, Row } from 'antd';
// import Image from 'next/image';
// import React from 'react';

// interface SellItemStep2Props {
//   handleCompleted: () => void;
//   handleSetCurrentStep: (step: 'step1' | 'step2' | 'step3') => void;
//   basicInfoData: Record<string, any>;
//   locationAndPricingData: Record<string, any>;
// }

// const SellItemStep3 = ({
//   handleCompleted,
//   basicInfoData,
//   locationAndPricingData,
// }: SellItemStep2Props) => {
//   return (
//     <div className="w-full">
//       <div
//         className="min-h-[460px] max-h-[460px] overflow-y-scroll w-full"
//         style={{
//           overflowY: 'scroll',
//           scrollbarWidth: 'thin',
//           // scrollbarColor: 'black',
//           // scrollbarGutter: 'auto',
//         }}
//       >
//         <div className="flex flex-col gap-2">
//           <div className="flex flex-col gap-1">
//             <div className="text-muted-foreground">Image</div>
//             <div className="border w-full border-neutral-300 p-2 rounded-lg mb-4">
//               <Row gutter={[10, 10]} className="w-full">
//                 {[{}, {}, {}, {}, {}, {}, {}].map(() => {
//                   return (
//                     <Col className="flex justify-center items-center relative" md={4} xl={4}>
//                       <div className="w-full ">
//                         <Image
//                           src={'/assets/imgs/sneakers.jpg'}
//                           alt="upload-image"
//                           width={150}
//                           height={200}
//                           style={{ width: '100%', height: '70px' }}
//                           className="rounded-md"
//                         />
//                       </div>
//                     </Col>
//                   );
//                 })}
//               </Row>
//             </div>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-muted-foreground">Name</span>
//             <span className="font-semibold">{basicInfoData?.name ?? '-'}</span>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-muted-foreground">Description</span>
//             <pre className="">{basicInfoData?.description ?? '-'}</pre>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-muted-foreground">Condition</span>
//             <span className="font-semibold">{basicInfoData?.condition ?? '-'}</span>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-muted-foreground">Location</span>
//             <span className="font-semibold">{locationAndPricingData?.location ?? '-'}</span>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-muted-foreground">Ask Price</span>
//             <span className="font-semibold">{`\u20A6${
//               locationAndPricingData?.askPrice ?? 0
//             }`}</span>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-muted-foreground">Fee</span>
//             <span className="font-semibold">{`\u20A6${locationAndPricingData?.fee ?? 0}`}</span>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-muted-foreground">Negotiable</span>
//             <span className="font-semibold">
//               {locationAndPricingData?.negotiable ? 'Yes (Negotiable)' : 'No (Not Negotiable)'}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="mt-2 flex justify-end">
//         <Button
//           className="opacity-100 hover:opacity-70 mt-1.5 bg-neutral-900 text-white h-12 rounded-md px-6"
//           type="primary"
//           block={false}
//           onClick={() => handleCompleted()}
//         >
//           Proceed to Post Item
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SellItemStep3;

// Enhanced SellItemStep3.tsx
interface SellItemStep3Props {
  handleCompleted: () => void;
  handleSetCurrentStep: (step: 'step1' | 'step2' | 'step3') => void;
  basicInfoData: Record<string, any>;
  locationAndPricingData: Record<string, any>;
}

export const SellItemStep3: React.FC<SellItemStep3Props> = ({
  handleCompleted,
  handleSetCurrentStep,
  basicInfoData,
  locationAndPricingData,
}) => {
  const SummaryItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col py-3 border-b border-gray-200">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium mt-1">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="max-h-[600px] overflow-y-auto px-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Product Images</h3>
            <div className="grid grid-cols-4 gap-4">
              {basicInfoData.images?.map((image: string, index: number) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <SummaryItem label="Item Name" value={basicInfoData?.name} />
            <SummaryItem label="Condition" value={basicInfoData?.condition} />
            <SummaryItem
              label="Description"
              value={
                <pre className="font-sans whitespace-pre-wrap">{basicInfoData?.description}</pre>
              }
            />
            <SummaryItem label="Location" value={locationAndPricingData?.location} />
            <SummaryItem
              label="Ask Price"
              value={`₦ ${locationAndPricingData?.askPrice?.toLocaleString()}`}
            />
            <SummaryItem
              label="Platform Fee"
              value={`₦ ${locationAndPricingData?.fee?.toLocaleString()}`}
            />
            <SummaryItem
              label="Price Negotiation"
              value={locationAndPricingData?.negotiable ? 'Negotiable' : 'Non-negotiable'}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between px-4 py-3 bg-gray-50 -mx-6 -mb-6">
        <button
          type="button"
          onClick={() => handleSetCurrentStep('step2')}
          className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleCompleted}
          className="px-10 text-lg font-semibold py-2 !h-14 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md  transition-colors"
        >
          Post Item
        </button>
      </div>
    </div>
  );
};
