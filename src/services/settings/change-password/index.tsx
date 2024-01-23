import { changePasswordUrl, POST } from '@grc/_shared/constant';
import { changePasswordTag } from '../../tags';
import { api } from '@grc/services/api';

export const changePasswordApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.mutation({
      query: ({ payload }) => {
        return {
          url: changePasswordUrl,
          method: POST,
          body: payload,
        };
      },
      invalidatesTags: [changePasswordTag],
    }),
  }),
});

export const { useUpdatePasswordMutation } = changePasswordApi;
