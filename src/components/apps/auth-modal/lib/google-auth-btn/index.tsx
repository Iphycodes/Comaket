// src/components/auth/google-auth-button.tsx
import { Button, message } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import { useAuth } from '@grc/hooks/useAuth';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  disabled?: boolean;
  handleClaimToken?: (token: string) => Promise<void>;
}

export const GoogleAuthButton = ({ onSuccess, disabled }: GoogleAuthButtonProps) => {
  const { isAuthenticated, googleAuth, googleAuthResponse } = useAuth();

  useEffect(() => {
    if (googleAuthResponse?.isSuccess && isAuthenticated) {
      onSuccess?.();
    }
  }, [googleAuthResponse?.isSuccess, isAuthenticated]);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await googleAuth({ token: response?.access_token })
          .then(() => {
            onSuccess?.();
          })
          .catch((err: any) => {
            message.error(err.data?.message || 'Something went wrong. Please try again.');
          });
      } catch (error: any) {
        message.error(error.data?.message || 'Something went wrong. Please try again.');
      }
    },
  });

  const handleLogin = () => {
    login();
  };

  const GoogleIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  return (
    <Button
      onClick={() => handleLogin()}
      className="w-full !h-12 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 bg-white dark:!bg-neutral-800 !border !border-neutral-200 dark:border-neutral-700 !text-neutral-700 dark:!text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-750 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-sm"
      disabled={disabled || googleAuthResponse?.isLoading}
    >
      <GoogleIcon size={18} />
      {googleAuthResponse?.isLoading ? 'Processing...' : 'Continue with Google'}
    </Button>
  );
};
