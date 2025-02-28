import { normalize, normalizeBN } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Button, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { ConvertEarlyZeroActions } from './ConvertEarlyZeroActions';
import { ChainId, gasLimitRecommendations, ProtocolAction } from '@aave/contract-helpers';
import { Box } from '@mui/system';
import { DurationBonusMapping, futureDate, IDurations } from '../../../modules/lock/ZeroLock';
import { FormattedNumber } from '../../primitives/FormattedNumber';
import { EZeroMerkleProofDataType } from 'src/modules/rewards/ZEROAirdrop';
import { useRootStore } from 'src/store/root';
import { ERC20TokenType } from 'src/libs/web3-data-provider/Web3Provider';
import { Warning } from '../../primitives/Warning';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export type ConvertEarlyZeroProps = {
  icon: string;
  merkleData: EZeroMerkleProofDataType | undefined;
  isClaimed: boolean | undefined;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

const Durations: IDurations[] = ['1 year', '2 years', '4 years'];

export const ConvertEarlyZeroModalContent = ({
  icon,
  merkleData,
  isClaimed,
}: ConvertEarlyZeroProps) => {
  const LineaChainId = 59144 as ChainId;
  const {
    chainId: connectedChainId,
    readOnlyModeAddress,
    sendTx,
    currentAccount,
  } = useWeb3Context();
  const { gasLimit, mainTxState, txError, setMainTxState, approvalTxState, setGasLimit } =
    useModalContext();
  const { currentChainId } = useProtocolDataContext();
  const [mode /*, setMode*/] = useState<'Stake' | 'Vest'>('Vest');
  const [duration, setDuration] = useState<IDurations>('4 years');
  const usdValue = useRootStore((store) => store.oraclePrice);

  function calculateFundTransfer() {
    if (!merkleData) return { directT: '0', vestT: '0', bonus: '0' };
    if (isClaimed) return { directT: '0', vestT: '0', bonus: '0' };

    let bonusValue = '';

    const directT = normalizeBN(merkleData.totalAmount || '', 18)
      .multipliedBy(40)
      .dividedBy(100)
      .toFixed(3)
      .toString();

    const vestT = normalizeBN(merkleData.totalAmount || '', 18)
      .multipliedBy(60)
      .dividedBy(100)
      .toFixed(3)
      .toString();

    if (DurationBonusMapping[duration]) {
      bonusValue = normalizeBN(merkleData.totalAmount || '', 18)
        .multipliedBy(60)
        .dividedBy(100)
        .multipliedBy(DurationBonusMapping[duration].perc)
        .dividedBy(100)
        .toFixed(3)
        .toString();
    }
    return { directT: directT, vestT: vestT, bonus: bonusValue };
  }

  // usd value
  function getUSDValue(value: string) {
    return usdValue && ((usdValue / 1e8) * Number(value)).toString();
  }

  // states
  const amountRef = useRef<string>();

  const calculateDuration: number = useMemo(() => {
    if (mode === 'Vest') return 0;

    if (duration === '4 years') return 4 * 365 * 86400;
    else if (duration === '2 years') return 2 * 365 * 86400;
    else return 1 * 365 * 86400;
  }, [duration]);

  const isWrongNetwork = connectedChainId !== currentChainId;

  const networkConfig = getNetworkConfig(currentChainId);

  const [addTransaction, claimAirdrop] = useRootStore((state) => [
    state.addTransaction,
    state.claimAirdrop,
  ]);

  const createClaimHandler = async () => {
    try {
      if (!merkleData) return;
      setMainTxState({ ...mainTxState, loading: true });
      const tx = claimAirdrop({
        user: merkleData.address,
        claimAmount: merkleData.totalAmount,
        merkleProof: merkleData.proofs,
        stakeNFT: mode === 'Stake',
        lockUntil: calculateDuration,
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
        amount: merkleData.totalAmount,
      });
    } catch (error) {
      console.log('error', error);
      setMainTxState({
        txHash: undefined,
        loading: false,
      });
    }
  };

  const addToken: ERC20TokenType = {
    address: zeroConfig.crossChainAddresses[currentChainId].ZERO_ADDRESS,
    symbol: 'ZERO',
    decimals: 18,
    aToken: false,
  };

  // Update gas estimation
  useEffect(() => {
    let supplyGasLimit = 0;
    supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.default].recommended);
    setGasLimit(supplyGasLimit.toString());
  }, [approvalTxState, setGasLimit]);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (mainTxState.success)
    return (
      <TxSuccessView
        action={<Trans>AirDrop</Trans>}
        amount={amountRef.current}
        symbol={icon}
        joinDiscord={true}
        addToken={addToken}
      />
    );

  const { directT, vestT, bonus } = calculateFundTransfer();

  return (
    <>
      <TxModalTitle title="Claim Airdrop" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={LineaChainId} />
      )}

      <Box display="flex" alignItems={'center'} justifyContent={'space-between'} mb={4}>
        <Box display="flex">
          <Typography variant="h4">Total Allocation</Typography>
        </Box>
        <FormattedNumber
          value={isClaimed ? 0 : normalize(Number(merkleData && merkleData.totalAmount), 18)}
          variant="h3"
          symbol="ZERO"
        />
      </Box>

      {/* <Box
        sx={{
          display: { xs: 'flex', lg: 'flex' },
          justifyContent: { xs: 'center', xsm: 'flex-start' },
          mb: { xs: 3, xsm: 4 },
        }}
      >
        <StyledToggleButtonGroup
          color="primary"
          value={mode}
          exclusive
          onChange={(_, value) => setMode(value)}
          sx={{ width: '100%', height: '44px' }}
        >
          <StyledToggleButton value="Stake" disabled={mode === 'Stake'}>
            <Typography variant="subheader1">
              <Trans>Stake</Trans>
            </Typography>
          </StyledToggleButton>
          <StyledToggleButton value="Vest" disabled={mode === 'Vest'}>
            <Typography variant="subheader1">
              <Trans>Vest</Trans>
            </Typography>
          </StyledToggleButton>
        </StyledToggleButtonGroup>
      </Box>*/}

      {mode === 'Stake' && (
        <Box mb={4}>
          <Typography component={'div'} mb={2}>
            Lock Length
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
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
      <TxModalDetails gasLimit={gasLimit} removePaddingTop={true}>
        {mode === 'Stake' ? (
          <>
            <DetailsNumberLine
              description={'Tokens Upfront [40%]'}
              value={directT}
              symbol={icon}
              usdValue={getUSDValue(directT)}
            />
            <DetailsNumberLine
              description={'Tokens Vested [60%]'}
              value={vestT}
              symbol={icon}
              usdValue={getUSDValue(vestT)}
            />
            <DetailsNumberLine
              description={'Bonus'}
              value={bonus}
              symbol={icon}
              usdValue={getUSDValue(bonus)}
            />
            <DetailsInfoLine description={'Locked Until'} value={futureDate(duration)} />
          </>
        ) : (
          <>
            <DetailsNumberLine
              description={'Tokens Upfront [40%]'}
              value={directT}
              symbol={icon}
              usdValue={getUSDValue(directT)}
            />
            <DetailsNumberLine
              description={'Tokens Vested [60%]'}
              value={vestT}
              symbol={icon}
              usdValue={getUSDValue(vestT)}
            />
            <DetailsInfoLine description={'Cliff'} value={'3 Months'} />
            <DetailsInfoLine description={'Vesting (Linear)'} value={'3 Months '} />
          </>
        )}
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <Box mt={4}>
        {/*<Warning severity="info" sx={{ mb: 2 }}>*/}
        {/*  <Typography variant="caption">*/}
        {/*    If you lock and stake for more than or equal to 1yrs then you would be eligible 10%*/}
        {/*    staking bonus amount &nbsp;*/}
        {/*    <Link href="https://discord.gg/zerolend" underline="always">*/}
        {/*      <Trans>Learn more</Trans>*/}
        {/*    </Link>*/}
        {/*  </Typography>*/}
        {/*</Warning>*/}
        <Warning severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            You will receive 40% upfront tokens in your wallet and 60% will be converted into a vest
            that you can then claim later or stake immediately.
          </Typography>
        </Warning>
        <ConvertEarlyZeroActions
          isWrongNetwork={isWrongNetwork}
          mainTxState={mainTxState}
          approvalTxState={approvalTxState}
          handleVestAction={createClaimHandler}
          isApproved={true}
          isClaimed={isClaimed ?? false}
          text={mode === 'Stake' ? 'Claim & Stake ZERO' : 'Claim ZERO 🚀'}
        />
      </Box>
    </>
  );
};
