export const numberFormat = (value: number | bigint, currency?: string) => {
  const formatter = new Intl.NumberFormat();
  return currency ? currency + formatter.format(value) : formatter.format(value);
};

export const transactionBal = (transBalances: Record<string, any>) => {
  return Object.values(transBalances)?.reduce((acc, curr) => acc + curr?.availableAmount, 0);
};

export const truncate = (text: string, length = 8) => {
  return text.length <= length ? text : text.slice(0, length).concat('...');
};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
export const isValidPassword = (password: string) => {
  return passwordRegex.test(password);
};
