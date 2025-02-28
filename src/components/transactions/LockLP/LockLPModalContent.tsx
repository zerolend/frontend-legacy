import { Trans } from '@lingui/macro';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

import { TxErrorView } from '../FlowCommons/Error';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsInfoLine, DetailsNumberLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { LockLPAction } from './LockLPAction';
import { futureDate, IDurations } from 'src/modules/lock/ZeroLock';
import { useRootStore } from 'src/store/root';
import { APPROVAL_GAS_LIMIT, checkRequiresApproval } from '../utils';
import {
  gasLimitRecommendations,
  MAX_UINT_AMOUNT,
  ProtocolAction,
  valueToWei,
} from '@aave/contract-helpers';
import { Box, Button, Typography } from '@mui/material';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import { AssetInput } from '../AssetInput';
import { normalizeBN } from '@aave/math-utils';
import useGetTokenBalance from 'src/hooks/tokens/useGetTokenBalance';
import { Link } from 'src/components/primitives/Link';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { defaultLPStakePoints } from '../../../ui-config/pointsConfig-v2';
import { PointsIncentivesButton } from '../../incentives/PointsIncentivesButton';
import { useGetLPAPR } from '../../../hooks/useGetLPAPR';

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export type LPProps = {
  icon: string;
};

const Durations: IDurations[] = ['3 months', '6 months', '1 year'];

export const LockLPModalContent = ({ icon }: LPProps) => {
  const {
    chainId: connectedChainId,
    readOnlyModeAddress,
    sendTx,
    currentAccount,
  } = useWeb3Context();
  const {
    gasLimit,
    mainTxState,
    txError,
    setTxError,
    setMainTxState,
    approvalTxState,
    setApprovalTxState,
    setGasLimit,
  } = useModalContext();
  const { currentChainId } = useProtocolDataContext();
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [requiresApproval, setRequiresApproval] = useState<boolean>(false);
  const [duration, setDuration] = useState<IDurations>('1 year');
  const [amount, setAmount] = useState<string>('');
  const usdValue = useRootStore((store) => store.LPoraclePrice);

  const pairBal = useGetTokenBalance(
    zeroConfig.crossChainAddresses[zeroConfig.chainId].ETH_ZERO_PAIR
  );

  const amountRef = useRef<string>();

  const isWrongNetwork = connectedChainId !== currentChainId;

  const networkConfig = getNetworkConfig(currentChainId);

  const isMaxSelected = amount === normalizeBN(pairBal.toString(), 18).toString();

  const handleChange = (_value: string) => {
    if (_value === '-1') {
      setAmount(normalizeBN(pairBal.toString(), 18).toString());
    } else {
      setAmount(_value);
    }
  };

  const calculateDuration: number = useMemo(() => {
    if (duration === '1 year') return 1 * 365 * 24 * 60 * 60;
    else if (duration === '6 months') return 6 * 30 * 24 * 60 * 60;
    else return 3 * 30 * 24 * 60 * 60;
  }, [duration]);

  const veZeroCalc = useMemo(() => {
    if (!amount) return 0;
    let seconds;
    const principal = Number(amount);

    switch (duration) {
      case '3 months':
        seconds = 3 * 30 * 86400;
        break;
      case '6 months':
        seconds = 6 * 30 * 86400;
        break;
      case '1 year':
        seconds = 1 * 365 * 86400;
        break;
      default:
        throw new Error('Invalid duration');
    }
    return (seconds / 31536000) * principal;
  }, [amount, duration]);

  const [
    generateLockApproval,
    estimateGasLimit,
    addTransaction,
    getLockApprovedAmount,
    createLPLock,
  ] = useRootStore((state) => [
    state.generateLockApproval,
    state.estimateGasLimit,
    state.addTransaction,
    state.getLockApprovedAmount,
    state.createLPLock,
  ]);

  // callback to fetch approved amount and determine execution path on dependency updates
  const fetchApprovedAmount = useCallback(
    async (forceApprovalCheck?: boolean) => {
      // Check approved amount on-chain on first load or if an action triggers a re-check such as an approval being confirmed
      if (!approvedAmount || forceApprovalCheck) {
        const approvedAmount = await getLockApprovedAmount({
          token: zeroConfig.crossChainAddresses[currentChainId].ETH_ZERO_PAIR,
          spender: zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_LP,
        });
        setApprovedAmount(approvedAmount);
      }

      const fetchedRequiresApproval = checkRequiresApproval({
        approvedAmount: String(approvedAmount),
        amount: amount,
        signedAmount: '0',
      });
      setRequiresApproval(fetchedRequiresApproval);
      if (fetchedRequiresApproval) setApprovalTxState({});
    },
    [approvedAmount, amount]
  );

  // Run on first load to decide execution path
  useEffect(() => {
    fetchApprovedAmount();
  }, [fetchApprovedAmount]);

  const approval = async () => {
    try {
      setApprovalTxState({
        ...approvalTxState,
        loading: true,
      });
      if (requiresApproval && approvedAmount === 0) {
        let approveTxData = await generateLockApproval({
          token: zeroConfig.crossChainAddresses[currentChainId].ETH_ZERO_PAIR,
          lockerAddress: zeroConfig.crossChainAddresses[zeroConfig.chainId].LOCKER_LP,
        });
        approveTxData = await estimateGasLimit(approveTxData);
        const response = await sendTx(approveTxData);
        await response.wait(1);

        setApprovalTxState({
          txHash: response.hash,
          loading: false,
          success: true,
        });
        addTransaction(response.hash, {
          action: ProtocolAction.approval,
          txState: 'success',
          asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
          amount: MAX_UINT_AMOUNT,
        });
        fetchApprovedAmount(true);
      }
    } catch (error) {
      const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
      setTxError(parsedError);
      setApprovalTxState({
        txHash: undefined,
        loading: false,
      });
    }
  };

  const createLockHandler = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });

      const tx = createLPLock({ amount, duration: calculateDuration, stakeNFT: true });

      const txData = await tx;
      txData.from = currentAccount;

      const res = await sendTx(txData);

      await res.wait(1);

      setMainTxState({
        txHash: res.hash,
        loading: false,
        success: true,
      });

      addTransaction(res.hash, {
        action: 'Lock',
        txState: 'success',
        asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
        amount: amount,
      });
    } catch (error) {
      console.log('err', error);
      setMainTxState({ txHash: undefined, loading: false });
      const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
      setTxError(parsedError);
    }
  };

  //token usd value
  const amountInUsd = usdValue && ((usdValue / 1e8) * Number(amount)).toString();

  const getAPY = useGetLPAPR(valueToWei(veZeroCalc.toFixed(5), 18), valueToWei(amount, 18));

  // Update gas estimation
  useEffect(() => {
    let supplyGasLimit = 0;
    supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.default].recommended);
    if (requiresApproval && !approvalTxState.success) {
      supplyGasLimit += Number(APPROVAL_GAS_LIMIT);
    }
    setGasLimit(supplyGasLimit.toString());
  }, [requiresApproval, approvalTxState, setGasLimit]);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (mainTxState.success)
    return (
      <TxSuccessView
        action={<Trans>Stake LP</Trans>}
        amount={amountRef.current}
        symbol={icon}
        joinDiscord={true}
      />
    );

  return (
    <>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Stake ZERO/ETH LP
      </Typography>
      <Typography variant="description" color={'text.muted'} sx={{ mb: 6 }}>
        If you don&apos;t have any LP tokens, visit the{' '}
        <Link
          href={'https://www.nile.build/manage/v1/0x0040f36784dda0821e74ba67f86e084d70d67a3a'}
          target="_blank"
        >
          ZERO/ETH liquidity
        </Link>{' '}
        page on Nile and supply liquidity to get LP tokens to stake.
      </Typography>

      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}
      <AssetInput
        value={amount}
        onChange={handleChange}
        usdValue={amountInUsd || ''}
        symbol={'ETH/ZERO'}
        assets={[
          {
            balance: normalizeBN(pairBal.toString(), 18).toString(),
            symbol: 'NYLE_ETH_ZERO',
            priceInUsd: '0',
            // iconSymbol: '', // SYMBOL_MAP['NYLEETHZERO'],
          },
        ]}
        isMaxSelected={isMaxSelected}
        disabled={false}
        maxValue={normalizeBN(pairBal.toString(), 18).toString()}
        balanceText={<Trans>Wallet balance</Trans>}
      />

      <Box mt={4}>
        <Typography component={'div'} mb={2}>
          Lock Duration
        </Typography>
        <Box display={'flex'}>
          {Durations.map((_d, index) => {
            return (
              <Box flex={1} px={1} key={index}>
                <Button
                  variant={duration === _d ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => {
                    setDuration(_d);
                  }}
                >
                  {_d}
                </Button>
              </Box>
            );
          })}
        </Box>
      </Box>
      <TxModalDetails gasLimit={gasLimit}>
        {/* <DetailsNumberLine description={'Locking Amount'} value={amount} symbol={icon} /> */}
        <DetailsInfoLine description={'Locked Until'} value={duration && futureDate(duration)} />
        <DetailsInfoLine description={'Voting Power'} value={`~${veZeroCalc.toFixed(5)} veZERO`} />
        <DetailsNumberLine description={'ETH APR (From Revenue)'} value={getAPY} percent={true} />
        <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
          <Typography variant="description">Incentives</Typography>
          <Box>
            {defaultLPStakePoints.map((data, index) => {
              return <PointsIncentivesButton {...data} key={index} />;
            })}
          </Box>
        </Box>
        {/* <DetailsNumberLine description={'ETH APR (From Revenue)'} value={getAPR} percent={true} /> */}
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <LockLPAction
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={Number(approvedAmount) !== 0}
        handleLockAction={Number(approvedAmount) === 0 ? approval : createLockHandler}
        text={`Stake ${icon} 🚀`}
        loadingText={`Staking ${icon}`}
      />
    </>
  );
};
