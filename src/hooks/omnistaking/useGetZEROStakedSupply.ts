import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useCallback, useEffect, useState } from 'react';

const useGetZEROStakedSupply = () => {
  const { omniStakingDataService } = useSharedDependencies();
  const { currentAccount: user } = useWeb3Context();
  const [value, setValue] = useState<string>('');
  const fetchApr = useCallback(async () => {
    const res = await omniStakingDataService.getStakedSupply(user);
    const supply = res.toNumber() / 1e8;
    setValue(supply.toString());
  }, [user]);

  useEffect(() => {
    fetchApr().catch((err) => {
      console.error(`Failed to fetch staked supply values: ${err.stack}`);
    });
  }, [fetchApr]);

  return value;
};

export default useGetZEROStakedSupply;
