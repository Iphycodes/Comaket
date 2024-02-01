import { useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react';
import debounce from 'lodash/debounce';

interface useSearchReturnProps {
  searchValue: string;
  debouncedChangeHandler: (e: string) => void;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const useSearch = (time?: number): useSearchReturnProps => {
  const [searchValue, setSearchValue] = useState<string>('');
  const changeHandler = (e: string) => setSearchValue(e);
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, time ?? 1000),
    [searchValue]
  );

  /**Remove debounce**/
  useEffect(() => {
    return () => debouncedChangeHandler.cancel();
  }, [searchValue]);

  return {
    searchValue,
    debouncedChangeHandler,
    setSearchValue,
  };
};
