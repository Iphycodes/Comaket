import { AppObject } from '@/_shared/namespace';

export namespace WalletNamespace {
  export interface Wallet extends AppObject {
    id: string;
    _id: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
    live: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    balance: number;
    amount: number;
    account: string;
    entry: string;
    beneficiary: {
      accountName: string;
      accountNumber: string;
      bankCode: string;
      bankName: string;
    };
    source: {
      accountName: string;
      accountNumber: string;
      bankCode: string;
      bankName: string;
    };
  }
}

export interface IBalance {
  availableAmount: number;
  withdrawableAmount: number;
}

export interface IBanks {
  bankCode: string;
  name: string;
  nibssBankCode: string;
}
