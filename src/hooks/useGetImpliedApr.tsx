import { useCallback, useEffect, useState } from 'react';
import { IApi } from '../utils/interface';
import { IApi_LOADING, IApi_NON_LOADING } from '../utils/constants';
import { getImpliedAprs } from '../utils/ServerApi';

export type IImpliedApr = {
  data: { [key: string]: { [key: string]: string } } | undefined;
} & IApi;

export const NonLoadingImpliedApr: IImpliedApr = {
  ...IApi_NON_LOADING,
  data: undefined,
};
export const LoadingImpliedApr: IImpliedApr = {
  ...IApi_LOADING,
  data: undefined,
};

const useGetImpliedApr = () => {
  const [data, setData] = useState<IImpliedApr>(LoadingImpliedApr);

  const fetchApr = useCallback(async () => {
    try {
      getImpliedAprs()
        .then((res) => {
          setData({
            isLoading: false,
            success: true,
            data: res,
          });
        })
        .catch((e) => {
          setData(NonLoadingImpliedApr);
          console.log('useGetImpliedApr error', e);
        });
    } catch (e) {
      setData(NonLoadingImpliedApr);
    }
  }, []);

  useEffect(() => {
    setData(LoadingImpliedApr);
    fetchApr().catch((err) => {
      setData(NonLoadingImpliedApr);
      console.error(`Failed to fetch useGetImpliedApr Values: ${err.stack}`);
    });
  }, []);

  return data;
};

export default useGetImpliedApr;
