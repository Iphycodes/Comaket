import jsPDF from 'jspdf';
import React, { Dispatch, SetStateAction } from 'react';
import { Template } from './Template';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

export const TransactionReceipt = ({
  successData,
  setLoading,
  setOpenModal,
}: {
  successData: Record<string, any>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  setOpenModal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const container = document.createElement('div');
  const root: any = createRoot(container);

  flushSync(() => {
    root.render(<Template successData={successData} />);
  });

  const htmlElement = container.firstElementChild as HTMLElement;

  setLoading?.(true);
  const doc = new jsPDF({
    unit: 'px',
    format: 'a4',
  });
  doc.html(htmlElement, {
    callback: function (doc) {
      doc = addWaterMark(doc);
      doc.save(`giro_${successData?.reference ?? 'receipt'}.pdf`);
      setLoading?.(false);
      setOpenModal?.(false);
    },
    width: 2000,
    margin: [20, 50, 20, 65],
    windowWidth: 3000,
  });
};

function addWaterMark(doc: any) {
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(150);
    doc.text(50, doc.internal.pageSize.height - 30, 'Giro Ltd');
  }
  return doc;
}
