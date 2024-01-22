'use client';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import ReactCodeInput from '@grc/_shared/components/react-code-input';

type VerifyEmailProps = {
  mobileResponsive: boolean;
  theme: string;
  handleVerifyEmail: (code: string) => void;
  handleResendPasscode: () => void;
  email: string | null;
  isLoading: {
    isSendVerificationCodeLoading: boolean;
    verifyEmailLoading: boolean;
  };
  error?: string | undefined;
};

const circularIcon = (size = '32px') => <LoadingOutlined style={{ fontSize: size }} spin />;
const VerifyEmail = (props: VerifyEmailProps) => {
  const { handleVerifyEmail, handleResendPasscode, email, isLoading, mobileResponsive } = props;

  return (
    <motion.div
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', duration: 1 }}
      className="w-3/4"
    >
      <div className="w-full">
        <header className="text-left text-3xl font-bold text-blue pb-3">Email Verification</header>
        <span className=" text-muted-foreground">
          We have sent a verification code to your registered email address ({email ?? ''})
        </span>
        {/* 
        {
          error && <h3 className='my-7'>
            <Alert type="error" message={error} showIcon closable={true}></Alert>
          </h3>
        } */}
        <div className="relative">
          <ReactCodeInput
            type={'number'}
            autoFocus
            inputProps={{
              disabled: isLoading.verifyEmailLoading || isLoading.isSendVerificationCodeLoading,
            }}
            onCompleted={handleVerifyEmail}
            className="react-code-input"
          />
          {isLoading.verifyEmailLoading && (
            <div
              className={`absolute ${mobileResponsive ? 'top-0 right-2/4' : 'top-2.5 right-[48%]'}`}
            >
              <Spin indicator={circularIcon()} />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-5 items-center">
          <span className="dark:text-white">Didn't get the email?</span>
          <Button
            className="font-semibold py-1 px-1.5 text-blue"
            type="link"
            onClick={handleResendPasscode}
            disabled={isLoading.verifyEmailLoading || isLoading.isSendVerificationCodeLoading}
          >
            Click to resend
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
