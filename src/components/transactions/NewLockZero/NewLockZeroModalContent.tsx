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
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { NewLockZeroAction } from './NewLockZeroAction';
import { useRootStore } from 'src/store/root';
import { APPROVAL_GAS_LIMIT, checkRequiresApproval } from '../utils';
import {
  ChainId,
  gasLimitRecommendations,
  MAX_UINT_AMOUNT,
  ProtocolAction,
} from '@aave/contract-helpers';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { zeroConfig } from 'src/ui-config/zeroConfig';
import useGetTokenBalance from 'src/hooks/tokens/useGetTokenBalance';
import { normalizeBN } from '@aave/math-utils';
import { BigNumber } from 'ethers';
import { useGetRewardRateValue } from 'src/hooks/useGetRewardRateValue';
import { AssetInput } from '../AssetInput';
import { Warning } from '../../../components/primitives/Warning';
import { DurationBonusMapping, IDurations } from './lockHelper';
import { TxAction, getErrorTextFromError } from 'src/ui-config/errorMapping';

export type StakeProps = {
  icon: string;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

const Durations: IDurations[] = ['3 months', '6 months', '1 year', '2 years', '3 years', '4 years'];

export const NewLockZeroModalContent = ({ icon }: StakeProps) => {
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
  const LineaChainId = 59144 as ChainId;
  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<IDurations>('4 years');
  const usdValue = useRootStore((store) => store.oraclePrice);

  const amountRef = useRef<string>();

  const networkConfig = getNetworkConfig(currentChainId);

  const zeroBal = useGetTokenBalance(
    zeroConfig.crossChainAddresses[zeroConfig.chainId].ZERO_ADDRESS
  );
  const isWrongNetwork = LineaChainId !== connectedChainId;

  const isMaxSelected = amount === normalizeBN(zeroBal.toString(), 18).toString();

  const handleChange = (_value: string) => {
    if (_value === '-1') {
      setAmount(normalizeBN(zeroBal.toString(), 18).toString());
    } else {
      setAmount(_value);
    }
  };

  const calculateDuration: number = useMemo(() => {
    if (duration === '4 years') return 4 * 365 * 24 * 60 * 60;
    else if (duration === '3 years') return 3 * 365 * 24 * 60 * 60;
    else if (duration === '2 years') return 2 * 365 * 24 * 60 * 60;
    else if (duration === '1 year') return 1 * 365 * 24 * 60 * 60;
    else if (duration === '6 months') return 6 * 30 * 24 * 60 * 60;
    else return 3 * 30 * 24 * 60 * 60;
  }, [duration]);

  const veZeroCalc = useMemo(() => {
    let seconds;

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
      case '2 years':
        seconds = 2 * 365 * 86400;
        break;
      case '3 years':
        seconds = 3 * 365 * 86400;
        break;
      case '4 years':
        seconds = 4 * 365 * 86400;
        break;
      default:
        throw new Error('Invalid duration');
    }
    let amountBonus = Number(amount);
    if (DurationBonusMapping[duration]) {
      amountBonus = Number(amount) + (Number(amount) * DurationBonusMapping[duration].perc) / 100;
    }
    return (seconds / 126144000) * amountBonus;
  }, [amount, duration]);

  const e18 = BigNumber.from(10).pow(18);
  const apr = useGetRewardRateValue(
    e18.mul(Math.floor(veZeroCalc)),
    e18.mul(Math.floor(Number(amount)))
  );

  const showBonusInfo = useMemo(() => !duration.includes('year'), [duration]);
  const showLongerInfoInfo = useMemo(() => duration != '4 years', [duration]);

  //token usd value
  const amountInUsd = usdValue && ((usdValue / 1e8) * Number(amount)).toString();

  const [
    generateLockApproval,
    estimateGasLimit,
    addTransaction,
    getLockApprovedAmount,
    createLock,
  ] = useRootStore((state) => [
    state.generateLockApproval,
    state.estimateGasLimit,
    state.addTransaction,
    state.getLockApprovedAmount,
    state.createLock,
  ]);

  // callback to fetch approved amount and determine execution path on dependency updates
  const fetchApprovedAmount = useCallback(
    async (forceApprovalCheck?: boolean) => {
      // Check approved amount on-chain on first load or if an action triggers a re-check such as an approval being confirmed
      if (!approvedAmount || forceApprovalCheck) {
        const approvedAmount = await getLockApprovedAmount({
          token: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
          spender: zeroConfig.crossChainAddresses[zeroConfig.chainId].STAKING_BONUS,
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
          token: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
          lockerAddress: zeroConfig.crossChainAddresses[zeroConfig.chainId].STAKING_BONUS,
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

      const tx = createLock({ amount, duration: calculateDuration, stakeNFT: true });

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
        action: 'Stake',
        txState: 'success',
        asset: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
        amount: amount,
      });
    } catch (error) {
      console.log('err', error);
      setMainTxState({ txHash: undefined, loading: false });
    }
  };

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
        action={<Trans>Stake</Trans>}
        amount={amountRef.current}
        symbol={icon}
        joinDiscord={true}
      />
    );

  return (
    <>
      <TxModalTitle title="Stake" symbol={icon} />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}

      <Box mb={4}>
        <AssetInput
          value={amount}
          onChange={handleChange}
          usdValue={amountInUsd || ''}
          symbol={'ZERO'}
          assets={[
            {
              balance: normalizeBN(zeroBal.toString(), 18).toString(),
              symbol: 'ZERO',
              iconSymbol: 'ZERO',
            },
          ]}
          isMaxSelected={isMaxSelected}
          disabled={false}
          maxValue={normalizeBN(zeroBal.toString(), 18).toString()}
          balanceText={<Trans>Wallet balance</Trans>}
        />
      </Box>
      <Box mb={4}>
        <Typography component={'h4'} mb={2}>
          Lock Duration
        </Typography>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={1}>
          {Durations.map((_d, index) => {
            return (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <Button
                  variant={duration === _d ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => setDuration(_d)}
                >
                  {_d}
                </Button>
                {DurationBonusMapping[_d] && (
                  <Typography
                    variant="description"
                    color={'green'}
                    textAlign={'center'}
                    mt={1}
                    key={index}
                    fontSize={12}
                    fontWeight={duration === _d ? '600' : '300'}
                  >
                    {DurationBonusMapping[_d].text}
                  </Typography>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <TxModalDetails gasLimit={gasLimit}>
        {/* <DetailsNumberLine
          description={'Locking Amount'}
          value={
            DurationBonusMapping[duration]
              ? Number(amount) + (Number(amount) * DurationBonusMapping[duration].perc) / 100
              : amount
          }
          symbol={icon}
        /> */}
        <DetailsNumberLine description={'APR'} value={Number(apr)} percent={true} />
        <DetailsInfoLine description={'Voting Power'} value={`~${veZeroCalc.toFixed(2)} veZERO`} />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      {showBonusInfo && (
        <Warning severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            If you lock and stake for 1-4 years, then you would be eligible 5-20% bonus{' '}
            {/* <Link href="https://discord.gg/zerolend" underline="always">
                  <Trans>Learn more</Trans>
                </Link> */}
          </Typography>
        </Warning>
      )}
      {showLongerInfoInfo && (
        <Warning severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            The longer you stake, the more voting power, rewards and airdrops you receive. Users
            also receive a staking bonus for staking more than 1 year{' '}
            <Link
              href="https://docs.zerolend.xyz/governance/token-overview/staking"
              underline="always"
            >
              Learn more.
            </Link>
          </Typography>
        </Warning>
      )}

      <NewLockZeroAction
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isApproved={Number(approvedAmount) !== 0}
        handleLockAction={Number(approvedAmount) === 0 ? approval : createLockHandler}
        text={'Stake ZERO 🚀'}
        loadingText={'Staking ZERO'}
      />
    </>
  );
};
