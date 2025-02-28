import { useQuery } from '@tanstack/react-query';
import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { POLLING_INTERVAL } from 'src/ui-config/queries';

const useGetAllPools = () => {
  const { poolVotingDataService } = useSharedDependencies();
  const { currentAccount: walletAddress } = useWeb3Context();
  return useQuery({
    queryFn: () => poolVotingDataService.getGeneralAllVotes(walletAddress),
    queryKey: ['USER_POOL_VOTE', poolVotingDataService.toHash()],
    refetchInterval: POLLING_INTERVAL,
  });
};

export default useGetAllPools;
