import { Button } from 'antd';

interface CustomPaginationProps {
  total: number;
  current: number;
  pageSize: number;
  onChange: (page: number, pageSize?: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  total,
  current,
  pageSize,
  onChange,
}) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      {/* Default pagination controls */}
      <span>
        {current} / {Math.ceil(total / pageSize)}
      </span>
      <Button onClick={() => onChange(current - 1)} disabled={current === 1}>
        Previous
      </Button>
      <Button
        onClick={() => onChange(current + 1)}
        disabled={current === Math.ceil(total / pageSize)}
      >
        Next
      </Button>
    </div>
    <div>
      {/* Your custom button goes here */}
      <Button type="primary">Custom Button</Button>
    </div>
  </div>
);

export default CustomPagination;
