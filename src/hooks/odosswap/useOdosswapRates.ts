import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeysFactory } from 'src/ui-config/queries';
import {
  IOdosGenerateAssembleRequest,
  IOdosGenerateAssembleResponse,
  IOdosGenerateQuoteRequest,
  IOdosGenerateQuoteResponse,
  generateAssemble,
  generateQuote,
} from './common';
import { PopulatedTransaction, BigNumber } from 'ethers';

export const useOdoswapQuote = (arg: IOdosGenerateQuoteRequest) => {
  const { inputTokens } = arg;
  return useQuery<IOdosGenerateQuoteResponse | undefined>({
    queryFn: () => {
      return generateQuote(arg);
    },
    queryKey: queryKeysFactory.odosswapQuote(arg),
    enabled: inputTokens.filter(({ amount }) => amount === '0').length === 0,
    retry: 0,
    // refetchOnWindowFocus: (query) => (query.state.error ? false : true),
  });
};

export const useOdoswapAssemble = (arg: IOdosGenerateAssembleRequest) => {
  return useQuery<IOdosGenerateAssembleResponse | undefined>({
    queryFn: () => {
      return generateAssemble(arg);
    },
    queryKey: queryKeysFactory.odosswapAssemble(arg),
    // enabled: true,
    retry: 0,
    // refetchOnWindowFocus: (query) => (query.state.error ? false : true),
  });
};

export const useOdosswapSellTxParams = () => {
  // const FEE_CLAIMER_ADDRESS = getFeeClaimerAddress(chainId);
  return useMutation({
    mutationFn: async (arg: IOdosGenerateAssembleRequest) => {
      const assemble = useOdoswapAssemble(arg);
      const result: PopulatedTransaction = {
        ...assemble.data,
        gasLimit: BigNumber.from('500000'),
        gasPrice: undefined,
        value: BigNumber.from(assemble.data?.transaction.value || '0'),
      };
      return result;
    },
  });
};
