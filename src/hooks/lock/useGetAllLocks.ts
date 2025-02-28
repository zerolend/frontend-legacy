import { useQuery } from '@tanstack/react-query';
import { useSharedDependencies } from '../../ui-config/SharedDependenciesProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { POLLING_INTERVAL } from 'src/ui-config/queries';

const useGetAllLocks = () => {
  const { vestUIDataService } = useSharedDependencies();
  const { currentAccount: lockUser } = useWeb3Context();
  return useQuery({
    queryFn: async () => await vestUIDataService.getGenralStakeUIDataHumanized(lockUser),
    queryKey: ['USER_LOCK_UI_DATA'],
    enabled: !!lockUser,
    refetchInterval: POLLING_INTERVAL,
    initialData: [],
  });
};

export default useGetAllLocks;
