import { Trans } from '@lingui/macro';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';
import BigNumber from 'bignumber.js';

import { TxErrorView } from '../FlowCommons/Error';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsInfoLine, DetailsNumberLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { LockedDLPAction } from './LockedDLPAction';
import { APPROVAL_GAS_LIMIT } from '../utils';
import {
  API_ETH_MOCK_ADDRESS,
  gasLimitRecommendations,
  ProtocolAction,
  valueToWei,
} from '@aave/contract-helpers';
import { AssetInput } from '../AssetInput';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import { useRootStore } from 'src/store/root';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { parseEther } from 'ethers/lib/utils';
import { assembleTx, generateQuote, IGenerateQuoteInput } from './GenerateOdosData';
import { futureDate, IDurations } from 'src/modules/lock/ZeroLock';
import { Box, Button, Typography } from '@mui/material';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { USD_DECIMALS } from '@aave/math-utils';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { Warning } from '../../../components/primitives/Warning';
import { PointsIncentivesButton } from '../../incentives/PointsIncentivesButton';
import { defaultLPStakePoints } from '../../../ui-config/pointsConfig-v2';
import { useGetLPAPR } from '../../../hooks/useGetLPAPR';

export type StakeProps = {
  icon: string;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

const WRAPPED_ETH = '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f';

const Durations: IDurations[] = ['3 months', '6 months', '1 year'];

export const LockedDLPModalContent = ({ icon }: StakeProps) => {
  const { marketReferencePriceInUsd, reserves } = useAppDataContext();
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
    setGasLimit,
  } = useModalContext();
  const { currentChainId } = useProtocolDataContext();
  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<IDurations>('1 year');
  const { walletBalances } = useWalletBalances();

  const [addTransaction, createZAPStake] = useRootStore((state) => [
    state.addTransaction,
    state.createZAPStake,
  ]);

  const ethBal = walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount || '0';

  const poolReserve = reserves.find((reserve) => {
    return reserve.isWrappedBaseAsset;
  }) as ComputedReserveData;

  const amountIntEth = new BigNumber(amount).multipliedBy(
    poolReserve.formattedPriceInMarketReferenceCurrency
  );
  // TODO: is it correct to ut to -1 if user doesnt exist?
  const amountInUsd = amountIntEth.multipliedBy(marketReferencePriceInUsd).shiftedBy(-USD_DECIMALS);
  console.log(
    '🚀 ~ LockedDLPModalContent ~ amountInUsd:',
    poolReserve.formattedPriceInMarketReferenceCurrency
  );

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

  const createZAPHandler = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });

      const odosQuote: IGenerateQuoteInput = {
        chainId: zeroConfig.chainId,
        inputTokens: [
          {
            tokenAddress: WRAPPED_ETH,
            amount: parseEther(amount).toString(),
          },
        ],
        outputTokens: [
          {
            tokenAddress: zeroConfig.crossChainAddresses[zeroConfig.chainId].ETH_ZERO_PAIR,
            proportion: 1,
          },
        ],
        userAddr: zeroConfig.crossChainAddresses[zeroConfig.chainId].ZAP_DLP,
      };
      const quote = await generateQuote(odosQuote);
      if (!quote) throw new Error('invalid quote from odos');

      const odosData = await assembleTx(
        zeroConfig.crossChainAddresses[zeroConfig.chainId].ZAP_DLP,
        quote
      );
      if (!odosData) throw new Error('invalid tx data from odos');

      const tx = createZAPStake({
        amount,
        duration: calculateDuration,
        odosData: odosData?.transaction.data,
      });

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
      const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
      setTxError(parsedError);
      setMainTxState({ txHash: undefined, loading: false });
    }
  };

  const isMaxSelected = amount === ethBal;

  const handleChange = (_value: string) => {
    if (_value === '-1') {
      setAmount(ethBal);
    } else {
      setAmount(_value);
    }
  };

  const amountRef = useRef<string>();

  const isWrongNetwork = connectedChainId !== currentChainId;

  const networkConfig = getNetworkConfig(currentChainId);

  const getAPY = useGetLPAPR(valueToWei(veZeroCalc.toFixed(5), 18), valueToWei(amount, 18));

  // Update gas estimation
  useEffect(() => {
    let supplyGasLimit = 0;
    supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.default].recommended);
    if (!approvalTxState.success) {
      supplyGasLimit += Number(APPROVAL_GAS_LIMIT);
    }
    setGasLimit(supplyGasLimit.toString());
  }, [approvalTxState, setGasLimit]);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (mainTxState.success)
    return (
      <TxSuccessView
        action={<Trans>Stake</Trans>}
        amount={amountRef.current}
        symbol={icon}
        joinDiscord={true}
      />
    );

  return (
    <>
      {/* <TxModalTitle title="Zap into LP" /> */}
      <Typography variant="h2" sx={{ mb: 3 }}>
        Zap and claim ETH Rewards
      </Typography>
      <Typography variant="description" color={'text.muted'} sx={{ mb: 6 }}>
        Convert your ETH into ZERO/ETH LP on Nile and stake your tokens in just one click. You can
        immediately claim rewards in ETH from protocol revenue.
      </Typography>

      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}
      <AssetInput
        value={amount}
        onChange={handleChange}
        usdValue={amountInUsd.toString(10)}
        symbol={icon}
        assets={[
          {
            balance: ethBal,
            symbol: icon,
            iconSymbol: icon,
          },
        ]}
        isMaxSelected={isMaxSelected}
        disabled={false}
        maxValue={ethBal}
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
        <DetailsInfoLine description={'Locked Until'} value={futureDate(duration)} />
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
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      {amount && Number(amount) < 0.1 && (
        <Warning severity="warning" sx={{ mb: 2, mt: 2 }}>
          <Typography variant="caption">Zaps below 0.1 ETH might fail when swapping.</Typography>
        </Warning>
      )}

      <LockedDLPAction
        amount={amount}
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={true}
        handleLockAction={createZAPHandler}
        text={'Zap & Stake 🚀'}
        loadingText={'ZAPPING'}
      />
    </>
  );
};
