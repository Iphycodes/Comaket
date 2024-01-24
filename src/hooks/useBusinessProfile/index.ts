import { useEffect } from 'react';
import {
  useLazyGetBusinessProfileQuery,
  useUpdateBusinessProfileMutation,
} from '@grc/services/settings/business-profile';
import { useAppSelector } from '@grc/redux/store';
import { selectBusinessAccountData } from '@grc/redux/selectors/business-profile';
import { WalletNamespace } from '@grc/_shared/namespace/wallet';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';

interface useBusinessProfileProps {
  key?: string;
  callAllBusinessProfile?: boolean;
}

interface useBusinessProfileReturnProps {
  getBusinessProfileResponse: Record<string, any>;
  businessProfile: WalletNamespace.Wallet[] | any;
  updateBusinessProfile: MutationTrigger<any>;
  updateBusinessProfileResponse: Record<string, any>;
}

export const useBusinessProfile = ({
  callAllBusinessProfile,
}: useBusinessProfileProps): useBusinessProfileReturnProps => {
  const [triggerBusinessProfile, getBusinessProfileResponse] = useLazyGetBusinessProfileQuery();
  const [updateBusinessProfile, updateBusinessProfileResponse] = useUpdateBusinessProfileMutation();

  const businessProfile = useAppSelector((state) => selectBusinessAccountData(state, {}));

  useEffect(() => {
    if (callAllBusinessProfile) triggerBusinessProfile({});
  }, [callAllBusinessProfile]);

  return {
    getBusinessProfileResponse,
    businessProfile,
    updateBusinessProfileResponse,
    updateBusinessProfile,
  };
};
