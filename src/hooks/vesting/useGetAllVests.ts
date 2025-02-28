import { useQuery } from '@tanstack/react-query';
import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { POLLING_INTERVAL } from 'src/ui-config/queries';

const useGetAllVests = () => {
  const { vestUIDataService } = useSharedDependencies();
  const { currentAccount: walletAddress } = useWeb3Context();
  return useQuery({
    queryFn: async () => await vestUIDataService.getGeneralVestUIDataHumanized(walletAddress),
    queryKey: ['USER_VEST_UI_DATA'],
    enabled: !!walletAddress,
    refetchInterval: POLLING_INTERVAL,
    initialData: [],
  });
};

export default useGetAllVests;
