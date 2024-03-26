import React from 'react';
import { Input } from 'antd';

const { Search } = Input;
interface Props {
  // Add your prop types here
  onSearch: () => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  return (
    <Search
      className="w-full"
      placeholder="What are you buying today?"
      allowClear
      onSearch={onSearch}
      size="large"
    />
  );
};

export default SearchBar;
