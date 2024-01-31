// import jsPDF from 'jspdf';
// import { Dispatch, SetStateAction } from 'react';
// import { Template } from './Template';
// import ReactDOMServer from 'react-dom/server';

// export const TransactionReceipt = ({
//   successData,
//   setLoading,
//   setOpenModal,
// }: {
//   successData: Record<string, any>;
//   setLoading?: Dispatch<SetStateAction<boolean>>;
//   setOpenModal?: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const htmlContent = ReactDOMServer.renderToString(<Template successData={successData} />);

//   setLoading?.(true);
//   const doc = new jsPDF({
//     unit: 'px',
//     format: 'a4',
//   });
//   doc.html(htmlContent, {
//     callback: function (doc) {
//       doc = addWaterMark(doc);
//       doc.save(`giro_${successData?.reference ?? 'receipt'}.pdf`);
//       setLoading?.(false);
//       setOpenModal?.(false);
//     },
//     width: 2000,
//     margin: [20, 50, 20, 65],
//     windowWidth: 3000,
//   });
// };

// function addWaterMark(doc: any) {
//   const totalPages = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= totalPages; i++) {
//     doc.setPage(i);
//     doc.setTextColor(150);
//     doc.text(50, doc.internal.pageSize.height - 30, 'Giro Ltd');
//   }
//   return doc;
// }
