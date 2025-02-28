import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useCallback, useEffect, useState } from 'react';

const useGetEarnedValue = () => {
  const { omniStakingDataService } = useSharedDependencies();
  const { currentAccount: user } = useWeb3Context();
  const [value, setValue] = useState<string>('');
  const fetchApr = useCallback(async () => {
    const res = await omniStakingDataService.getEarnedValue(user);

    setValue(res.toString());
  }, [user]);

  useEffect(() => {
    fetchApr().catch((err) => {
      console.error(`Failed to fetch earned Values: ${err.stack}`);
    });
  }, [fetchApr]);

  return value;
};

export default useGetEarnedValue;
