import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';

const useGetTokenBalance = (tokenAddress: string) => {
  const [data, setData] = useState<BigNumber>(BigNumber.from('0'));
  const { tokenBalanceService } = useSharedDependencies();
  const { currentAccount: walletAddress } = useWeb3Context();
  const getTokenBalance = tokenBalanceService.getTokenBalanceOf;

  const fetchApr = useCallback(async () => {
    if (tokenAddress !== '') {
      const value = await getTokenBalance({ tokenAddress: tokenAddress, user: walletAddress });
      setData(value);
    }
  }, [tokenAddress, tokenBalanceService, walletAddress]);

  useEffect(() => {
    fetchApr().catch((err) => {
      setData(BigNumber.from('0'));
      console.error(`Failed to fetch token balance Values: ${err.stack}`);
    });
  }, [fetchApr, tokenAddress, walletAddress]);

  return data;
};

export default useGetTokenBalance;
