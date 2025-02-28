import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useCallback, useEffect, useState } from 'react';

const useGetEarnedValueETH = () => {
  const { omniLPStakingDataService } = useSharedDependencies();
  const { currentAccount: user } = useWeb3Context();
  const [value, setValue] = useState<string>('');
  const fetchApr = useCallback(async () => {
    const res = await omniLPStakingDataService.getEarnedValue(user);

    setValue(res.toString());
  }, [user]);

  useEffect(() => {
    fetchApr().catch((err) => {
      console.error(`Failed to fetch earned Values: ${err.stack}`);
    });
  }, [fetchApr]);

  return value;
};

export default useGetEarnedValueETH;
