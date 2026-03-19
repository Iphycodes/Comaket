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
    const pagination = get(action, ['payload', 'meta', 'pagination']);
    const endpointName = get(action, ['meta', 'arg', 'endpointName']);
    const isWithPagination = isObject(originalArgs) && keys(originalArgs).includes('page');

    console.log('th original args::::', originalArgs);
    console.log('args pagination::::::', pagination);
    console.log('args payload', get(action, ['payload']));

    const { noErrorMessage, noSuccessMessage, errorMessage, successMessage } = options || {};

    console.log('endpoint return::::::', action.payload?.data?.message ?? '');

    const errMssg =
      errorMessage ||
      get(action, ['payload', 'data', 'message']) ||
      get(action, ['payload', 'data', 'meta', 'error', 'message']) ||
      get(action, ['payload', 'data', 'error_details'])?.[0]?.message ||
      get(action, ['payload', 'data', 'error_description']);

    // Skip error toasts for aborted requests (e.g., page navigating away to payment)
    const isAborted =
      action?.meta?.condition === true ||
      action?.error?.name === 'AbortError' ||
      action?.payload?.status === 'FETCH_ERROR';

    // Suppress error toast for 404s on queries — the page UI handles "not found" states
    const statusCode = action?.payload?.status || action?.payload?.data?.statusCode;
    const is404 = statusCode === 404;

    if (isRejectedWithValue(action) && !noErrorMessage && !isAborted) {
      if (isMutation) {
        message.error(errMssg);
      } else if (!is404) {
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
