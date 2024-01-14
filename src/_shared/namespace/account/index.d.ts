import { AppObject } from '@/_shared/namespace';

export namespace AccountNamespace {
  export interface Account extends AppObject {
    id: string;
    business: string;
    name: string;
    phone: string;
    country: string;
    category: number;
    state: number;
    address: boolean;
    token: string | null;
    isDefault: boolean;
    live?: boolean;
  }
}
