import { InterestRate } from '@aave/contract-helpers';
import { createContext, useContext, useState } from 'react';
import { EmodeModalType } from 'src/components/transactions/Emode/EmodeModalContent';
import { GetUserVestingData } from 'src/contract-helpers/types';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { IDurations } from 'src/modules/lock/ZeroLock';
import { EZeroMerkleProofDataType, GravityMerkleDataType } from 'src/modules/rewards/ZEROAirdrop';
import { useRootStore } from 'src/store/root';
import { TxErrorType } from 'src/ui-config/errorMapping';
import { GENERAL } from 'src/utils/mixPanelEvents';

export enum ModalType {
  Supply,
  Withdraw,
  Borrow,
  Repay,
  CollateralChange,
  RateSwitch,
  Stake,
  Unstake,
  StakeCooldown,
  StakeRewardClaim,
  ClaimRewards,
  ClaimZEROLpIncentives,
  ClaimZEROLockerIncentives,
  ClaimZEROLpLockerETHIncentives,
  ClaimLPLockerIncentives,
  ClaimZEROVestsRewards,
  Emode,
  Faucet,
  Swap,
  DebtSwitch,
  GovDelegation,
  GovVote,
  V3Migration,
  RevokeGovDelegation,
  StakeRewardsClaimRestake,
  Switch,
  Bridge,
  StakeZERO,
  ExitEarly,
  WithdrawVestZERO,

  //Vest Actions Modals
  StakeVest,
  TransferVest,
  ClaimVestedTokens,

  //Convert to ZERO action
  ConvertEZero,
  ConvertGravity,

  //Early Zero Actions
  StakeEZero,
  LockZero,
  NewLockZero,
  LockLP,
  WithdrawLockZero,
  UnstakeZero,

  LinkReferralCode,
  LockedDLP,
}

export interface ModalArgsType {
  underlyingAsset?: string;
  proposalId?: number;
  support?: boolean;
  power?: string;
  icon?: string;
  stakeAssetName?: string;
  currentRateMode?: InterestRate;
  emode?: EmodeModalType;
  isFrozen?: boolean;
  chainId?: number;
  vestId?: number;
  amount?: string;
  duration?: IDurations;
  stakeNFT?: boolean;
  nftId?: number;
  vests?: GetUserVestingData[];
  vest?: GetUserVestingData;
  vestLoading?: boolean;
  merkleData?: EZeroMerkleProofDataType;
  gravityMerkleData?: GravityMerkleDataType;
  isClaimed?: boolean;
  apy?: string;
  referrerCode?: string;
}

export type TxStateType = {
  txHash?: string;
  // txError?: string;
  loading?: boolean;
  success?: boolean;
  amount?: string;
};

export interface ModalContextType<T extends ModalArgsType> {
  openSupply: (
    underlyingAsset: string,
    currentMarket: string,
    name: string,
    funnel: string,
    isReserve?: boolean
  ) => void;
  openStakeZero: (nftId: number) => void;
  openExitEarly: (vest: GetUserVestingData) => void;
  openWithdrawVestZero: (underlyingAsset: string) => void;
  openWithdraw: (
    underlyingAsset: string,
    currentMarket: string,
    name: string,
    funnel: string
  ) => void;
  openBorrow: (
    underlyingAsset: string,
    currentMarket: string,
    name: string,
    funnel: string,
    isReserve?: boolean
  ) => void;
  openRepay: (
    underlyingAsset: string,
    currentRateMode: InterestRate,
    isFrozen: boolean,
    currentMarket: string,
    name: string,
    funnel: string
  ) => void;
  openCollateralChange: (
    underlyingAsset: string,
    currentMarket: string,
    name: string,
    funnel: string,
    usageAsCollateralEnabledOnUser: boolean
  ) => void;

  openRateSwitch: (underlyingAsset: string, currentRateMode: InterestRate) => void;
  openStake: (stakeAssetName: string, icon: string) => void;
  openUnstake: (stakeAssetName: string, icon: string) => void;
  openStakeCooldown: (stakeAssetName: string) => void;
  openStakeRewardsClaim: (stakeAssetName: string, icon: string) => void;
  openStakeRewardsRestakeClaim: (stakeAssetName: string, icon: string) => void;
  openClaimRewards: () => void;
  openZEROLpIncentivesRewards: () => void;
  openZEROLockerIncentives: (amount: string) => void;
  openZEROLPETHLockerIncentives: (amount: string) => void;
  openLPLockerIncentives: (amount: string) => void;
  openZEROVestsRewards: (vests: GetUserVestingData[], vestLoading: boolean) => void;
  openEmode: (mode: EmodeModalType) => void;
  openFaucet: (underlyingAsset: string) => void;
  openSwap: (underlyingAsset: string) => void;
  openDebtSwitch: (underlyingAsset: string, currentRateMode: InterestRate) => void;
  openGovDelegation: () => void;
  openRevokeGovDelegation: () => void;
  openV3Migration: () => void;
  openGovVote: (proposalId: number, support: boolean, power: string) => void;
  openSwitch: (underlyingAsset?: string, chainId?: number) => void;
  openBridge: (underlyingAsset?: string, chainId?: number) => void;

  //Vest Actions Modals
  openStakeVestModal: (vest: GetUserVestingData) => void;
  openTransferVestModal: (vestId: number) => void;
  openClaimVestedTokensModal: (vestId: number, amount: string) => void;

  //Early Zero Actions
  openStakeEZeroModal: () => void;
  openConvertEZeroModal: (merkleData: EZeroMerkleProofDataType, isClaimed: boolean) => void;
  openConvertGravityModal: (gravityMerkleData: GravityMerkleDataType) => void;
  openLockZeroModal: (amount: string, duration: IDurations, stakeNFT: boolean, apy: string) => void;
  openNewLockZeroModal: () => void;
  openLockLPModal: () => void;
  openWithdrawLockZeroModal: (icon: string, nftId: number, amount: string) => void;
  openUnstakeZero: (tokenId: number) => void;
  openLockedDLP: () => void;

  openLinkReferralModal: (referrerCode: string) => void;

  close: () => void;
  type?: ModalType;
  args: T;
  mainTxState: TxStateType;
  approvalTxState: TxStateType;
  setApprovalTxState: (data: TxStateType) => void;
  setMainTxState: (data: TxStateType) => void;
  gasLimit: string;
  setGasLimit: (limit: string) => void;
  loadingTxns: boolean;
  setLoadingTxns: (loading: boolean) => void;
  txError: TxErrorType | undefined;
  setTxError: (error: TxErrorType | undefined) => void;
}

export const ModalContext = createContext<ModalContextType<ModalArgsType>>(
  {} as ModalContextType<ModalArgsType>
);

export const ModalContextProvider: React.FC = ({ children }) => {
  const { setSwitchNetworkError } = useWeb3Context();
  // contains the current modal open state if any
  const [type, setType] = useState<ModalType>();
  // contains arbitrary key-value pairs as a modal context
  const [args, setArgs] = useState<ModalArgsType>({});
  const [approvalTxState, setApprovalTxState] = useState<TxStateType>({});
  const [mainTxState, setMainTxState] = useState<TxStateType>({});
  const [gasLimit, setGasLimit] = useState<string>('');
  const [loadingTxns, setLoadingTxns] = useState(false);
  const [txError, setTxError] = useState<TxErrorType>();
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <ModalContext.Provider
      value={{
        openSupply: (underlyingAsset, currentMarket, name, funnel, isReserve) => {
          setType(ModalType.Supply);
          setArgs({ underlyingAsset });

          if (isReserve) {
            trackEvent(GENERAL.OPEN_MODAL, {
              modal: 'Supply',
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
              funnel,
            });
          } else {
            trackEvent(GENERAL.OPEN_MODAL, {
              modal: 'Supply',
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
              funnel,
            });
          }
        },
        openWithdraw: (underlyingAsset, currentMarket, name, funnel) => {
          setType(ModalType.Withdraw);
          setArgs({ underlyingAsset });

          trackEvent(GENERAL.OPEN_MODAL, {
            modal: 'Withdraw',
            market: currentMarket,
            assetName: name,
            asset: underlyingAsset,
            funnel: funnel,
          });
        },
        openBorrow: (underlyingAsset, currentMarket, name, funnel, isReserve) => {
          setType(ModalType.Borrow);
          setArgs({ underlyingAsset });
          if (isReserve) {
            trackEvent(GENERAL.OPEN_MODAL, {
              modal: 'Borrow',
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
              funnel,
            });
          } else {
            trackEvent(GENERAL.OPEN_MODAL, {
              modal: 'Borrow',
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
              funnel,
            });
          }
        },
        openRepay: (underlyingAsset, currentRateMode, isFrozen, currentMarket, name, funnel) => {
          setType(ModalType.Repay);
          setArgs({ underlyingAsset, currentRateMode, isFrozen });

          trackEvent(GENERAL.OPEN_MODAL, {
            modal: 'Repay',
            asset: underlyingAsset,
            assetName: name,
            market: currentMarket,
            funnel,
          });
        },
        openCollateralChange: (
          underlyingAsset,
          currentMarket,
          name,
          funnel,
          usageAsCollateralEnabledOnUser
        ) => {
          setType(ModalType.CollateralChange);
          setArgs({ underlyingAsset });
          trackEvent(GENERAL.OPEN_MODAL, {
            modal: 'Toggle Collateral',
            market: currentMarket,
            assetName: name,
            asset: underlyingAsset,
            usageAsCollateralEnabledOnUser: usageAsCollateralEnabledOnUser,
            funnel,
          });
        },
        openRateSwitch: (underlyingAsset, currentRateMode) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Rate Switch' });
          setType(ModalType.RateSwitch);
          setArgs({ underlyingAsset, currentRateMode });
        },
        openStake: (stakeAssetName, icon) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Stake', assetName: stakeAssetName });
          setType(ModalType.Stake);
          setArgs({ stakeAssetName, icon });
        },
        openUnstake: (stakeAssetName, icon) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Untake', assetName: stakeAssetName });
          setType(ModalType.Unstake);
          setArgs({ stakeAssetName, icon });
        },
        openStakeCooldown: (stakeAssetName) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Cooldown', assetName: stakeAssetName });
          setType(ModalType.StakeCooldown);
          setArgs({ stakeAssetName });
        },
        openStakeRewardsClaim: (stakeAssetName, icon) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Stake Rewards', assetName: stakeAssetName });
          setType(ModalType.StakeRewardClaim);
          setArgs({ stakeAssetName, icon });
        },
        openStakeRewardsRestakeClaim: (stakeAssetName, icon) => {
          trackEvent(GENERAL.OPEN_MODAL, {
            modal: 'Restatke Stake Rewards',
            assetName: stakeAssetName,
          });
          setType(ModalType.StakeRewardsClaimRestake);
          setArgs({ stakeAssetName, icon });
        },
        openClaimRewards: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Claim' });
          setType(ModalType.ClaimRewards);
        },
        openZEROLpIncentivesRewards: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'ClaimZEROLpIncentives' });
          setType(ModalType.ClaimZEROLpIncentives);
        },
        openZEROLPETHLockerIncentives: (amount) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'ClaimZEROLpLockerETHIncentives' });
          setType(ModalType.ClaimZEROLpLockerETHIncentives);
          setArgs({ amount });
        },
        openZEROLockerIncentives: (amount) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'ClaimZEROLockerIncentives' });
          setType(ModalType.ClaimZEROLockerIncentives);
          setArgs({ amount });
        },
        openLPLockerIncentives: (amount) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'ClaimLPLockerIncentives' });
          setType(ModalType.ClaimLPLockerIncentives);
          setArgs({ amount });
        },
        openZEROVestsRewards: (vests: GetUserVestingData[], vestLoading: boolean) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'ClaimZEROVestsRewards' });
          setType(ModalType.ClaimZEROVestsRewards);
          setArgs({ vests, vestLoading });
        },
        openEmode: (mode) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'eMode' });
          setType(ModalType.Emode);
          setArgs({ emode: mode });
        },
        openFaucet: (underlyingAsset) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Faucet' });
          setType(ModalType.Faucet);
          setArgs({ underlyingAsset });
        },
        openSwap: (underlyingAsset) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Swap' });
          setType(ModalType.Swap);
          setArgs({ underlyingAsset });
        },
        openDebtSwitch: (underlyingAsset, currentRateMode) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Debt Switch' });
          setType(ModalType.DebtSwitch);
          setArgs({ underlyingAsset, currentRateMode });
        },
        openGovDelegation: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Governance Delegation' });
          setType(ModalType.GovDelegation);
        },
        openRevokeGovDelegation: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Revoke Governance Delegation' });
          setType(ModalType.RevokeGovDelegation);
        },
        openGovVote: (proposalId, support, power) => {
          trackEvent(GENERAL.OPEN_MODAL, {
            modal: 'Vote',
            proposalId: proposalId,
            voteSide: support,
          });
          setType(ModalType.GovVote);
          setArgs({ proposalId, support, power });
        },
        openV3Migration: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'V2->V3 Migration' });
          setType(ModalType.V3Migration);
        },
        openSwitch: (underlyingAsset, chainId) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Switch' });
          setType(ModalType.Switch);
          setArgs({ underlyingAsset, chainId });
        },
        openBridge: (underlyingAsset, chainId) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Bridge' });
          setType(ModalType.Bridge);
          setArgs({ underlyingAsset, chainId });
        },
        openExitEarly: (vest) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Exit Early' });
          setType(ModalType.ExitEarly);
          setArgs({ vest });
        },
        openWithdrawVestZero: (underlyingAsset) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Withdraw vest zero' });
          setType(ModalType.WithdrawVestZERO);
          setArgs({ underlyingAsset });
        },

        //Vest Actions Modals
        openStakeVestModal: (vest) => {
          setType(ModalType.StakeVest);
          setArgs({ vest });
        },
        openTransferVestModal: (vestId) => {
          setType(ModalType.TransferVest);
          setArgs({ vestId });
        },
        openClaimVestedTokensModal: (vestId, amount) => {
          setType(ModalType.ClaimVestedTokens);
          setArgs({ vestId, amount });
        },

        //EarlyZero Action Modal
        openStakeEZeroModal: () => {
          setType(ModalType.StakeEZero);
        },
        openConvertEZeroModal: (merkleData, isClaimed) => {
          setType(ModalType.ConvertEZero);
          setArgs({ merkleData, isClaimed });
        },

        openConvertGravityModal: (gravityMerkleData) => {
          setType(ModalType.ConvertGravity);
          setArgs({ gravityMerkleData });
        },

        //Zero Action Modals
        openLockZeroModal: (amount, duration, stakeNFT) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Lock Zero' });
          setType(ModalType.LockZero);
          setArgs({ amount, duration, stakeNFT });
        },
        openNewLockZeroModal: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Lock Zero' });
          setType(ModalType.NewLockZero);
        },

        openLockLPModal: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Lock LP' });
          setType(ModalType.LockLP);
        },

        openStakeZero: (nftId) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Stake Zero' });
          setType(ModalType.StakeZERO);
          setArgs({ nftId });
        },

        openWithdrawLockZeroModal: (icon, nftId, amount) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Withdraw Zero' });
          setType(ModalType.WithdrawLockZero);
          setArgs({ icon, nftId, amount });
        },

        openUnstakeZero: (nftId) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Unstake Zero' });
          setType(ModalType.UnstakeZero);
          setArgs({ nftId });
        },

        openLinkReferralModal: (referrerCode: string) => {
          setType(ModalType.LinkReferralCode);
          setArgs({ referrerCode });
        },

        openLockedDLP: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: 'Locked DLP' });
          setType(ModalType.LockedDLP);
        },

        close: () => {
          setType(undefined);
          setArgs({});
          setMainTxState({});
          setApprovalTxState({});
          setGasLimit('');
          setTxError(undefined);
          setSwitchNetworkError(undefined);
        },
        type,
        args,
        approvalTxState,
        mainTxState,
        setApprovalTxState,
        setMainTxState,
        gasLimit,
        setGasLimit,
        loadingTxns,
        setLoadingTxns,
        txError,
        setTxError,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }

  return context;
};
