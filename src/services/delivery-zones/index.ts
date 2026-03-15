import { api } from '../api';
import { deliveryZoneTag } from '../tags';

export interface DeliveryZone {
  _id: string;
  name: string;
  states: string[];
  baseFee: number;
  isActive: boolean;
  description: string;
}

export interface DeliveryFeeResponse {
  zoneName: string | null;
  fee: number;
}

export const deliveryZonesApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Get active delivery zones (public)
    getDeliveryZones: builder.query<Record<string, any>, void>({
      query: () => ({
        url: '/delivery-zones',
        method: 'GET',
      }),
      providesTags: [deliveryZoneTag as any],
    }),

    // Get delivery fee for a specific state
    getDeliveryFee: builder.query<Record<string, any>, string>({
      query: (state) => ({
        url: `/delivery-zones/fee?state=${encodeURIComponent(state)}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetDeliveryZonesQuery,
  useLazyGetDeliveryZonesQuery,
  useGetDeliveryFeeQuery,
  useLazyGetDeliveryFeeQuery,
} = deliveryZonesApi;
