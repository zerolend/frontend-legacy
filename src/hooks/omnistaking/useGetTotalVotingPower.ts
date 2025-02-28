import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useCallback, useEffect, useState } from 'react';

const useGetTotalVotingPower = () => {
  const { omniStakingDataService, omniLPStakingDataService } = useSharedDependencies();
  const { currentAccount: user } = useWeb3Context();
  const [value, setValue] = useState<{
    totalPower: string,
    zeroStakedPerc: string,
    lpStakedPerc: string,
    totalStakedPerc: string,
  }>({
    totalPower: '0',
    zeroStakedPerc: '0',
    lpStakedPerc: '0',
    totalStakedPerc: '0',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const fetchApr = useCallback(async () => {
    setLoading(true);
    const zeroVotingPower = await omniStakingDataService.getVotingPower(user);
    const zeroVotingPowerTotalSupply = await omniStakingDataService.getTotalSupply();
    const lpVotingPower = await omniLPStakingDataService.getVotingPower(user);
    const lpVotingPowerTotalSupply = await omniLPStakingDataService.getTotalSupply();

    try {
      const totalPower = zeroVotingPower.add(lpVotingPower);
      const totalSupply = lpVotingPowerTotalSupply.add(zeroVotingPowerTotalSupply);
      const zeroStakedPerc = zeroVotingPower.mul(1e8).div(zeroVotingPowerTotalSupply);
      const lpStakedPerc = lpVotingPower.mul(1e8).div(lpVotingPowerTotalSupply);
      const totalStakedPerc = totalPower.mul(1e8).div(totalSupply);

      setValue({
        totalPower: totalPower.toString(),
        zeroStakedPerc: (zeroStakedPerc.toNumber() / 1e8).toString(),
        lpStakedPerc: (lpStakedPerc.toNumber() / 1e8).toString(),
        totalStakedPerc: (totalStakedPerc.toNumber() / 1e8).toString(),
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }

  }, [user]);

  useEffect(() => {
    fetchApr().catch((err) => {
      console.error(`Failed to fetch staked supply values: ${err.stack}`);
    });
  }, [fetchApr]);

  return { value, loading };
};

export default useGetTotalVotingPower;
