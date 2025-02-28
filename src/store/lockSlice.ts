import { StateCreator } from 'zustand';

import { RootStore } from './root';
import { ERC20Service, MAX_UINT_AMOUNT, valueToWei } from '@aave/contract-helpers';
import { BigNumber, PopulatedTransaction } from 'ethers';
import { LockDataService } from 'src/services/LockDataService';
import { OmniStakingDataService } from 'src/services/OmniStakingDataService';
import { StakingBonusDataService } from 'src/services/StakingBonusDataService';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import { OracleDataService } from 'src/services/OracleDataService';
import { getProvider } from 'src/utils/marketsAndNetworksConfig';
import { LockLPDataService } from 'src/services/LockLPDataService';
import { ZAPDlpDataService } from 'src/services/ZAPDlpDataService';
import { OmniLPStakingDataService } from 'src/services/OmniLPStakingDataService';
import { OracleLPDataService } from 'src/services/OracleLPDataService';

export interface LockSlice {
  oraclePrice: number;
  LPoraclePrice: number;
  rewardRate: BigNumber;
  totalSupply: BigNumber;
  LPrewardRate: BigNumber;
  LPtotalSupply: BigNumber;

  setRewardData: () => Promise<void>;

  setLPRewardData: () => Promise<void>;

  refreshOraclePrice: () => Promise<void>;

  getLockApprovedAmount: (args: { token: string; spender: string }) => Promise<number>;

  generateLockApproval: (args: {
    token: string;
    lockerAddress: string;
  }) => Promise<PopulatedTransaction>;

  generateNFTAllowance: (args: { nftId: number }) => Promise<string>;

  approveNFT: (args: { to: string; nftId: number }) => Promise<PopulatedTransaction>;

  createLock: (args: {
    amount: string;
    duration: number;
    stakeNFT: boolean;
  }) => Promise<PopulatedTransaction>;

  createLPLock: (args: {
    amount: string;
    duration: number;
    stakeNFT: boolean;
  }) => Promise<PopulatedTransaction>;

  createZAPStake: (args: {
    amount: string;
    duration: number;
    odosData: string;
  }) => Promise<PopulatedTransaction>;

  withdrawLock: (args: { tokenId: number }) => Promise<PopulatedTransaction>;

  stakeNFT: (args: { nftId: number }) => Promise<PopulatedTransaction>;

  unStakeNFT: (args: { nftId: number }) => Promise<PopulatedTransaction>;

  unStakeWithdraw: (args: { nftId: number }) => Promise<PopulatedTransaction>;

  unStakeWithdrawLP: (args: { nftId: number }) => Promise<PopulatedTransaction>;
}

export const createLockSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  LockSlice
> = (set, get) => {
  return {
    oraclePrice: 0,
    LPoraclePrice: 0,
    rewardRate: BigNumber.from(0),
    totalSupply: BigNumber.from(0),
    LPrewardRate: BigNumber.from(0),
    LPtotalSupply: BigNumber.from(0),

    setRewardData: async () => {
      const provider = getProvider(zeroConfig.chainId);

      const omniStakingDataService = new OmniStakingDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING,
        zeroConfig.chainId
      );

      const rewardRate = await omniStakingDataService.getRewardRate();
      const totalSupply = await omniStakingDataService.getTotalSupply();

      set({
        rewardRate: rewardRate,
        totalSupply: totalSupply,
      });
    },
    setLPRewardData: async () => {
      const provider = getProvider(zeroConfig.chainId);

      const omniLPStakingDataService = new OmniLPStakingDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING_LP,
        zeroConfig.chainId
      );

      const rewardRate = await omniLPStakingDataService.getRewardRate();
      const totalSupply = await omniLPStakingDataService.getTotalSupply();

      set({
        LPrewardRate: rewardRate,
        LPtotalSupply: totalSupply,
      });
    },

    refreshOraclePrice: async () => {
      const provider = getProvider(zeroConfig.chainId);

      const oracleDataService = new OracleDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].ORACLE_ADDRESS,
        zeroConfig.chainId
      );

      const res = await oracleDataService.getLatestAnswer();

      const LPoracleDataService = new OracleLPDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].LP_ORACLE_ADDRESS,
        zeroConfig.chainId
      );

      const LPres = await LPoracleDataService.getPrice();
      set({ oraclePrice: res.toNumber(), LPoraclePrice: LPres.toNumber() });
    },
    getLockApprovedAmount: (args: { token: string; spender: string }) => {
      const provider = getProvider(zeroConfig.chainId);

      const account = get().account;
      const tokenERC20Service = new ERC20Service(provider);
      return tokenERC20Service.approvedAmount({
        user: account,
        token: args.token,
        spender: args.spender,
      });
    },
    generateLockApproval: async (args: { token: string; lockerAddress: string }) => {
      const provider = getProvider(zeroConfig.chainId);
      const tokenERC20Service = new ERC20Service(provider);
      const account = get().account;
      return await tokenERC20Service.approveTxData({
        user: account,
        spender: args.lockerAddress,
        token: args.token,
        amount: MAX_UINT_AMOUNT,
      });
    },
    createLock: async (args: { amount: string; duration: number; stakeNFT: boolean }) => {
      const provider = getProvider(zeroConfig.chainId);

      const stakingBonusDataService = new StakingBonusDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].STAKING_BONUS,
        zeroConfig.chainId
      );

      return await stakingBonusDataService.setGeneralCreateLock({
        amount: valueToWei(args.amount, 18),
        duration: args.duration,
        stakeNFT: args.stakeNFT,
      });
    },
    createLPLock: async (args: { amount: string; duration: number; stakeNFT: boolean }) => {
      const provider = getProvider(zeroConfig.chainId);

      const lockLPDataService = new LockLPDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_LP,
        zeroConfig.chainId
      );

      return await lockLPDataService.setGeneralCreateLock({
        amount: valueToWei(args.amount, 18),
        duration: args.duration,
        stakeNFT: args.stakeNFT,
      });
    },

    createZAPStake: async (args: { amount: string; duration: number; odosData: string }) => {
      const provider = getProvider(zeroConfig.chainId);

      const ZapDataService = new ZAPDlpDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].ZAP_DLP,
        zeroConfig.chainId
      );

      return await ZapDataService.setGeneralCreateDLP({
        amount: valueToWei(args.amount, 18),
        duration: args.duration,
        odosData: args.odosData,
      });
    },

    withdrawLock: async (args: { tokenId: number }) => {
      const provider = getProvider(zeroConfig.chainId);

      const lockDataService = new LockDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_TOKEN,
        zeroConfig.chainId
      );

      return await lockDataService.setGeneralWithdrawLock(args.tokenId);
    },
    generateNFTAllowance: async (args: { nftId: number }) => {
      const provider = getProvider(zeroConfig.chainId);

      const lockDataService = new LockDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_TOKEN,
        zeroConfig.chainId
      );

      return await lockDataService.getNFTAllowance(args.nftId);
    },
    approveNFT: async (args: { to: string; nftId: number }) => {
      const provider = getProvider(zeroConfig.chainId);

      const lockDataService = new LockDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_TOKEN,
        zeroConfig.chainId
      );

      return await lockDataService.setNFTApproval(args.to, args.nftId);
    },
    stakeNFT: async (args: { nftId: number }) => {
      const provider = getProvider(zeroConfig.chainId);

      const lockDataService = new LockDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_TOKEN,
        zeroConfig.chainId
      );

      return await lockDataService.setStakeNFT(
        get().account,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING,
        args.nftId
      );
    },

    unStakeNFT: async (args: { nftId: number }) => {
      const provider = getProvider(zeroConfig.chainId);

      const omniStakingDataService = new OmniStakingDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING,
        zeroConfig.chainId
      );

      return await omniStakingDataService.setUnstakeNFT(args.nftId);
    },

    unStakeWithdraw: async (args: { nftId: number }) => {
      const provider = getProvider(zeroConfig.chainId);

      const omniStakingDataService = new OmniStakingDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING,
        zeroConfig.chainId
      );

      return await omniStakingDataService.setUnstakeandWithdraw(args.nftId);
    },

    unStakeWithdrawLP: async (args: { nftId: number }) => {
      const provider = getProvider(zeroConfig.chainId);

      const omniLPStakingDataService = new OmniLPStakingDataService(
        provider,
        zeroConfig.crossChainAddresses[zeroConfig.chainId].OMNI_STAKING_LP,
        zeroConfig.chainId
      );

      return await omniLPStakingDataService.setUnstakeandWithdraw(args.nftId);
    },
  };
};
