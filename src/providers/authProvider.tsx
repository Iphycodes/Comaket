// src/providers/AuthProvider.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { logout } from '@grc/redux/slices/auth';
import { isTokenExpired } from '@grc/utils/auth';
import { useAppDispatch, useAppSelector } from '@grc/redux/store';
import { AUTH_TOKEN_KEY } from '@grc/_shared/constant';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { sessionToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const token: string | undefined = Cookies.get(AUTH_TOKEN_KEY);

  const appSessionToken = sessionToken ?? token;

  // Check for token expiration on initial load and periodically
  useEffect(() => {
    if (!appSessionToken) return;

    // Function to check if token is expired
    const checkTokenExpiration = () => {
      if (isTokenExpired(appSessionToken) && isAuthenticated) {
        dispatch(logout());
        return true;
      }
      return false;
    };

    // Check on mount
    const isExpired = checkTokenExpiration();
    // const isExpired = true;

    if (isExpired) {
      dispatch(logout());
    }

    // Check periodically (every minute)
    const interval = setInterval(checkTokenExpiration, 60000);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [appSessionToken, isAuthenticated, dispatch, router]);

  return <>{children}</>;
};
