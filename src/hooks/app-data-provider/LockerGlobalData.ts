import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useCallback, useEffect, useState } from 'react';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import { useRootStore } from 'src/store/root';

const LockerGlobalData = () => {
  const { tokenBalanceService } = useSharedDependencies();
  const { currentAccount: user } = useWeb3Context();
  const [value, setValue] = useState<string>('');
  const [percLocked, setPercLocked] = useState<string>('');
  const [avgLockPeriod, setAvgLockPeriod] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getTokenBalance = tokenBalanceService.getTokenBalanceOf;
  const totalSupply = useRootStore((store) => store.totalSupply);

  const fetchApr = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      setValue('');
      setPercLocked('');
      setAvgLockPeriod(0);
    }
    setIsLoading(true);

    const totalZeroLocked = await getTokenBalance({
      tokenAddress: zeroConfig.crossChainAddresses[zeroConfig.chainId].ZERO_ADDRESS,
      user: zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_TOKEN,
    });

    const percLocked = await totalZeroLocked.div(25000000000);
    const lockPeriod = await totalSupply.mul(4 * 1e8).div(totalZeroLocked);

    setValue(totalZeroLocked.toString());
    setPercLocked(percLocked.toString());
    setAvgLockPeriod(lockPeriod.toNumber() / 1e8);
    setIsLoading(false);
  }, [
    user,
    zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_TOKEN,
    zeroConfig.crossChainAddresses[zeroConfig.chainId].ZERO_ADDRESS,
    tokenBalanceService,
    totalSupply,
  ]);

  useEffect(() => {
    fetchApr().catch((err) => {
      console.error(`Failed to fetch Lock Data Values: ${err.stack}`);
      setIsLoading(false);
      setValue('');
      setPercLocked('');
      setAvgLockPeriod(0);
    });
  }, [fetchApr, user, tokenBalanceService]);

  return { data: value, perc: percLocked, avgLock: avgLockPeriod, isLoading: isLoading };
};

export default LockerGlobalData;
