import { createSlice } from '@reduxjs/toolkit';

interface initialStateProps {
  pagination: Record<string, any> | null;
}

const initialState = {
  pagination: null,
} as initialStateProps;

const UI_KEY = 'ui';

export const uiSlice = createSlice({
  name: UI_KEY,
  initialState,
  reducers: {
    paginate: (state, action) => {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [action.payload.endpointName]: action.payload.pagination,
        },
      };
    },
  },
});

export const { paginate } = uiSlice.actions;

export default uiSlice.reducer;
