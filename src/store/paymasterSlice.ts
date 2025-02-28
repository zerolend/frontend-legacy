import { StateCreator } from 'zustand';

import { RootStore } from './root';
import axios from 'axios';
import produce from 'immer';
import { BigNumber, ethers } from 'ethers';

export interface IPaymasterData {
  feeTokenAddress: string;
  gasLimit: string;
  txData: {
    from: string;
    to: string;
    value: string;
    data: string;
  };
}

export interface IPaymasterTransaction {
  from: string;
  to: string;
  data: string;
  value: BigNumber;
  customData: {
    paymasterParams: {
      paymaster: string;
      paymasterInput: string;
    };
    gasPerPubdata: string;
  };
  maxPriorityFeePerGas: BigNumber;
  maxFeePerGas: BigNumber;
  gasLimit: BigNumber;
}

export interface IPaymasterResult {
  txData: IPaymasterTransaction;
  gasLimit: string;
  gasPrice: string;
  tokenAddress: string;
  tokenPrice: string;
  feeTokenAmount: string;
  feeTokendecimals: string;
  feeUSD: string;
  markup: string;
  estimatedFinalFeeUSD: string;
}

export type PaymasterSlice = {
  fetchPaymasterData: (id: string, input: IPaymasterData) => void;
  paymasterData: {
    [id: string]: {
      success: boolean;
      loading: boolean;
      data?: IPaymasterResult;
    };
  };
};

export const createPaymasterSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  PaymasterSlice
> = (set, get) => {
  return {
    paymasterData: {},
    fetchPaymasterData: async (id: string, input: IPaymasterData) => {
      const data = get().paymasterData || {};

      // don't do anything if there is already a request in place
      if (data[id] && data[id].loading) return;

      set((state) =>
        produce(state, (draft) => {
          draft.paymasterData = {
            ...draft.paymasterData,
            [id]: {
              success: false,
              loading: true,
            },
          };
        })
      );

      const res = await axios.post('https://api.zyfi.org/api/erc20_paymaster/v1', input);

      // check for success; sometimes the API might be down or might throw an error
      const success = res.status === 200;

      const check = ethers.utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'bytes'],
        ethers.utils.hexDataSlice(res.data.txData.customData.paymasterParams.paymasterInput, 4)
      );

      set((state) =>
        produce(state, (draft) => {
          draft.paymasterData = {
            ...draft.paymasterData,
            [id]: {
              success,
              loading: false,
              data:
                success &&
                check[0].toLowerCase() === res.data.tokenAddress.toLowerCase() &&
                res.data.feeTokenAmount === check[1].toString()
                  ? res.data
                  : undefined,
            },
          };
        })
      );
    },
  };
};
