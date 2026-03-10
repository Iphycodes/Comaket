import { Pagination } from '@grc/_shared/namespace';
import { useAppSelector } from '@grc/redux/store';
import { Dispatch, SetStateAction, useState } from 'react';

interface usePaginationType {
  key?: string;
  perPage?: number;
}

interface usePaginationReturnProps {
  paginate: Record<'page' | 'perPage', any>;
  setPaginate?: Dispatch<SetStateAction<Record<'page' | 'perPage', any>>>;
  pagination: Pagination;
}

export const usePagination = ({
  key = '',
  perPage = 7,
}: usePaginationType): usePaginationReturnProps => {
  const [paginate, setPaginate] = useState({
    page: 1,
    perPage: perPage,
  });

  const { pagination: _pagination } = useAppSelector((state) => state.ui);

  const handlePageChange = (page: number, pageSize: number) => {
    setPaginate({ page: page, perPage: pageSize });
  };
  const pagination = {
    showSizeChanger: false,
    onChange: handlePageChange,
    current: _pagination?.[key]?.page,
    pageSize: _pagination?.[key]?.perPage,
    total: _pagination?.[key]?.total,
    totalPages: _pagination?.[key]?.totalPages,
  };

  return {
    paginate,
    pagination,
    setPaginate,
  };
};
