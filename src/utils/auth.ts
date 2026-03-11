// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string | null | undefined): boolean => {
  if (!token) return true;

  try {
    const decoded: any = jwtDecode(token);
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    console.error('Error decoding token:', e);
    return true;
  }
};
