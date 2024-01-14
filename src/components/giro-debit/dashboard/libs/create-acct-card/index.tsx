import React, { Dispatch, SetStateAction } from 'react';
import { Button, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { InfoCircleOutlined } from '@ant-design/icons';
import CustomToolTip from '@grc/_shared/components/custom-tooltip';

interface ICreateAcctCard {
  setOpenCreateModal: Dispatch<SetStateAction<boolean>>;
  isVerified: boolean;
  theme?: string;
}

const CreateAcctCard = ({ setOpenCreateModal, isVerified }: ICreateAcctCard) => {
  const { push } = useRouter();
  return (
    <Card bodyStyle={{ padding: 18 }}>
      <div>
        <div>
          <div>
            Create a virtual account{' '}
            <CustomToolTip
              className="cursor-pointer"
              title="A virtual account allows you to commence funding and disbursement on Giro. To create virtual account(s), verify your profile."
              placement={'right'}
            >
              <InfoCircleOutlined />
            </CustomToolTip>
          </div>
        </div>
        <Button
          className="opacity-100 hover:opacity-70 mt-3 bg-blue text-white h-10 rounded-lg font-bold px-8"
          type="primary"
          block
          htmlType={'submit'}
          onClick={() => (isVerified ? setOpenCreateModal(true) : push('settings'))}
        >
          {isVerified ? 'Create Account' : 'Verify Profile '}
        </Button>
      </div>
    </Card>
  );
};

export default CreateAcctCard;
