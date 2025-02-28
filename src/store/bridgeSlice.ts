/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  PoolBaseCurrencyHumanized,
  ReserveDataHumanized,
  ReservesIncentiveDataHumanized,
  tEthereumAddress,
  UserReserveDataHumanized,
} from '@aave/contract-helpers';
import { BigNumber, Contract, PopulatedTransaction, utils } from 'ethers';
import { StateCreator } from 'zustand';

import { RootStore } from './root';
import OFTAdapterABI from 'src/utils/abi/ZeroOFTAdapter.json';
import {
  MessagingFeeStruct,
  MessagingFeeStructOutput,
  SendParamStruct,
  ZeroOFTAdapter,
  ZeroOFTAdapterInterface,
} from 'src/utils/abi/ZeroOFTAdapter';
import { getProvider } from 'src/utils/marketsAndNetworksConfig';

// TODO: what is the better name for this type?
export type PoolReserve = {
  reserves?: ReserveDataHumanized[];
  reserveIncentives?: ReservesIncentiveDataHumanized[];
  baseCurrencyData?: PoolBaseCurrencyHumanized;
  userEmodeCategoryId?: number;
  userReserves?: UserReserveDataHumanized[];
};

export type BridgeParamsType = {
  params: SendParamStruct;
  fee: MessagingFeeStruct;
  contract: tEthereumAddress;
  isAdapter: boolean;
};

export type QuoteBridgeType = {
  nativeFee: BigNumber;
  lzTokenFee: BigNumber;
};

export type QuoteBridgeParamsType = {
  params: {
    dstEid: number;
    to: string;
    amountLD: string;
    minAmountLD: string;
    extraOptions: string;
    composeMsg: Uint8Array;
    oftCmd: Uint8Array;
  };
  contract: tEthereumAddress;
  chainId: number;
  isAdapter: boolean;
};

// TODO: add chain/provider/account mapping
export interface BridgeSlice {
  bridge: (args: Omit<BridgeParamsType, 'user'>) => Promise<PopulatedTransaction>;
  quoteBridge: (args: Omit<QuoteBridgeParamsType, 'user'>) => Promise<MessagingFeeStructOutput>;
}

export const createBridgeSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  BridgeSlice
> = (_, get) => {
  return {
    bridge: async (args: Omit<BridgeParamsType, 'user'>) => {
      const currentAccount = get().account;
      const actionTx: PopulatedTransaction = {};
      const iface: ZeroOFTAdapterInterface = new utils.Interface(
        OFTAdapterABI.abi
      ) as ZeroOFTAdapterInterface;
      const txData = iface.encodeFunctionData('send', [args.params, args.fee, currentAccount]);

      actionTx.to = args.contract;
      actionTx.from = currentAccount;
      actionTx.data = txData;

      const fee = BigNumber.from((await args.fee.nativeFee) || BigNumber.from(0));
      actionTx.value = fee;
      // actionTx.gasLimit = BigNumber.from(
      //   gasLimitRecommendations[ProtocolAction.default].recommended,
      // );
      return actionTx;
    },
    quoteBridge: async (args: Omit<QuoteBridgeParamsType, 'user'>) => {
      const provider = getProvider(args.chainId);
      const contract = new Contract(args.contract, OFTAdapterABI.abi, provider) as ZeroOFTAdapter;
      const actionTx = await contract.quoteSend(args.params, false);
      return actionTx;
    },
  };
};
