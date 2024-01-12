import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import tagTypes from '@grc/services/tags';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { AppCookie } from '@grc/_shared/helpers';
import { RootState } from '@grc/redux/store';

/**Create our baseQuery instance - similar to axios**/
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.sessionToken;
    headers.set('x-api-key', process.env.NEXT_PUBLIC_APP_API_KEY as string);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('accept', 'application/json');
    return headers;
  },
});

/**change the returned data**/
const baseQueryWithResponse: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const {
    data,
    error,
  }: QueryReturnValue<any, any, Record<string, any>> = await baseQuery(args, api, extraOptions);
  const token = data?.meta?.token;
  if (error) {
    return { error: { status: error?.status, data: error?.data } };
  }
  if (token) AppCookie({ cookie: token });
  return { data };
};

// const baseQueryWithRetry = retry(baseQuery, { maxRetries: 6 })
export const api = createApi({
  baseQuery: baseQueryWithResponse,
  tagTypes,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: () => ({}),
});
