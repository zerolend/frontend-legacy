import { useQuery } from '@tanstack/react-query';
import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { POLLING_INTERVAL } from 'src/ui-config/queries';

const useGetIsClaimed = () => {
  const { airdropDataService } = useSharedDependencies();
  const { currentAccount: walletAddress } = useWeb3Context();
  return useQuery({
    queryFn: async () => await airdropDataService.getUserRewardClaimed(walletAddress),
    queryKey: ['USER_REWARD_CLAIMED'],
    enabled: !!walletAddress,
    refetchInterval: POLLING_INTERVAL,
  });
};

export default useGetIsClaimed;
