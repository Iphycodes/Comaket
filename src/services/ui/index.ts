import { isRejectedWithValue, isFulfilled, Dispatch } from '@reduxjs/toolkit';
import { message } from 'antd';
import { paginate } from '@grc/redux/slices/ui';
import { get, isEmpty, isObject, keys } from 'lodash';

message.config({
  duration: 5,
});

export const appMiddleware =
  ({ dispatch }: { dispatch: Dispatch }) =>
  (next: any) =>
  (action: Record<string, any>) => {
    const isMutation = get(action, ['meta', 'arg', 'type']) === 'mutation';
    const originalArgs = get(action, ['meta', 'arg', 'originalArgs']);
    const options = originalArgs?.options;
    const pagination = get(action, ['payload', 'meta']);
    const endpointName = get(action, ['meta', 'arg', 'endpointName']);
    const isWithPagination = isObject(originalArgs) && keys(originalArgs).includes('page');

    const { noErrorMessage, noSuccessMessage, errorMessage, successMessage } = options || {};

    const errMssg =
      errorMessage ||
      get(action, ['payload', 'data', 'meta', 'error', 'message']) ||
      get(action, ['payload', 'data', 'error_details'])?.[0]?.message ||
      get(action, ['payload', 'data', 'error_description']);

    if (isRejectedWithValue(action) && !noErrorMessage) {
      if (isMutation) {
        message.error(errMssg);
      } else {
        message.error('A problem occurred, please refresh');
      }
    }
    if (isFulfilled(action) && isMutation && !noSuccessMessage) {
      message.success(successMessage || 'Action Successful!');
    }

    if (isWithPagination && !isEmpty(pagination)) {
      dispatch(paginate({ pagination, endpointName }));
    }
    return next(action);
  };
