export namespace TransactionNamespace {
  export interface Transaction {
    _id: string;
    transactionType: string;
    status: string;
    amount: number;
    entry: string;
    currency: string;
  }
}
