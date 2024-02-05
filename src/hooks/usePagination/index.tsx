import { Dispatch, SetStateAction, useState } from 'react';
import { Pagination } from '@grc/_shared/namespace';
import { useAppSelector } from '@grc/redux/store';

interface usePaginationType {
  key?: string;
}

interface usePaginationReturnProps {
  paginate: Record<'page' | 'perPage', any>;
  setPaginate?: Dispatch<SetStateAction<Record<'page' | 'perPage', any>>>;
  pagination: Pagination;
}

export const usePagination = ({ key = '' }: usePaginationType): usePaginationReturnProps => {
  const [paginate, setPaginate] = useState({
    page: 1,
    perPage: 7,
  });

  const { pagination: _pagination } = useAppSelector((state) => state.ui);

  const handlePageChange = (page: number, pageSize: number) => {
    setPaginate({ page, perPage: pageSize });
  };

  const pagination = {
    showSizeChanger: false,
    showTotal: (total: number) => <span className="px-5">{`${total} transactions`}</span>,
    onChange: handlePageChange,
    current: _pagination?.[key]?.pagination?.current,
    pageSize: _pagination?.[key]?.pagination?.perPage,
    total: _pagination?.[key]?.pagination?.totalCount,
    position: ['bottomLeft'],
  };

  return {
    paginate,
    pagination: pagination,
  };
};
