import optionType from '../index';
import { AccountNamespace } from '@grc/_shared/namespace/account';

export interface User {
  email: string;
  password: string;
}

export interface loginRequestType {
  payload: Record<'email' & 'password', string>;
  options?: optionType;
}

export interface registerRequestType {
  payload: Record<string, any>;
  options?: optionType;
}

export interface verifyRequestType {
  payload: Record<'email' & 'verificationCode', string>;
  options?: optionType;
}

export interface sendVerificationRequestType {
  payload: Record<'email' & 'type', string>;
  options?: optionType;
}

export interface forgotPasswordRequestType {
  payload: Record<'email', string>;
  options?: optionType;
}

export interface AuthDataType {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bvn: string;
  dob: Date;
  gender: string;
  mobile?: {
    phoneNumber: string;
    isoCode: 'NG';
    id: string;
  };
  address: {
    addressLine_1: string;
    city: string;
    state: string;
    country: string;
  };
  accounts: AccountNamespace.Account[];
  token: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  // accounts: Array<AccountNamespace.Account>;
  currentAccount: AccountNamespace.Account & {
    pubKey: { live: string; test: string };
    webhooks: Array<string>;
  };
}

export interface authResponseType {
  meta: Record<'token', string>;
  data: AuthDataType;
}

export interface accountResponseType {
  meta: Record<'token', string>;
  data: AccountNamespace.Account;
}

export interface AppDataType {
  id: number | string;
  name: string;
  business: string;
  webhooks: Array<string>;
  live: boolean;
  pubKey: { live: string; test: string };
  secKey: { live: string; test: string };
  createdAt: Date;
  updatedAt: Date;
}
