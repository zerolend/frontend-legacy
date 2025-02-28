import { Trans } from '@lingui/macro';
import * as React from 'react';
import { useState } from 'react';
import { IVests, Reward } from 'src/helpers/types';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

import { TxErrorView } from '../FlowCommons/Error';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsInfoLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { TransferVestAction } from './TransferVestAction';
import { VestSelect } from './VestSelect';
import { CompactableTypography } from '../../CompactableTypography';
import { Box, FormLabel, InputBase, Typography, useMediaQuery, useTheme } from '@mui/material';
import { utils } from 'ethers';

export enum ErrorType {
  ALREADY_STAKE,
  NOT_A_VALID_ADDRESS,
}

interface IProps {
  vestId: number;
}

const vestsConstant: IVests[] = [];

export const TransferVestModalContent = (props: IProps) => {
  const { gasLimit, mainTxState: claimRewardsTxState, txError } = useModalContext();
  const { currentChainId } = useProtocolDataContext();
  const { chainId: connectedChainId, readOnlyModeAddress } = useWeb3Context();
  const [selectedVestId, setSelectedVestId] = useState<number>(props.vestId);
  const [vests] = useState<IVests[]>(vestsConstant);
  const [tranferTo, setTransferTo] = useState<string>('0x961e45e3666029709c3ac50a26319029cde4e067');

  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down('sm'));

  const networkConfig = getNetworkConfig(currentChainId);

  // error handling
  let blockingError: ErrorType | undefined = undefined;
  if (false) {
    //ToDo: If vest is already staked
    blockingError = ErrorType.ALREADY_STAKE;
  } else if (!utils.isAddress(tranferTo)) {
    blockingError = ErrorType.NOT_A_VALID_ADDRESS;
  }

  // error handling render
  const handleBlocked = () => {
    switch (blockingError) {
      case ErrorType.ALREADY_STAKE:
        return <Trans>This vest is already staked</Trans>;
      case ErrorType.NOT_A_VALID_ADDRESS:
        return <Trans>Not a valid address</Trans>;
      default:
        return null;
    }
  };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
  //   event.preventDefault();
  // };

  // const selectedVest = undefined; //Todo: This should be fetching the vest details from the contracts;

  // is Network mismatched
  const isWrongNetwork = currentChainId !== connectedChainId;

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (claimRewardsTxState.success) return <TxSuccessView action={<Trans>Staked</Trans>} />;

  //ToDo: use to check if its a valid address
  //

  return (
    <>
      <TxModalTitle title="Transfer Vest" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={currentChainId} />
      )}

      {/*{blockingError !== undefined && (
        <Typography variant="helperText" color="error.main">
          {handleBlocked()}
        </Typography>
      )}*/}

      <Box mb={3}>
        {vests.length > 1 && (
          <VestSelect
            vests={vests}
            selectedVest={selectedVestId}
            setSelectedVest={(vestId) => setSelectedVestId(vestId)}
          />
        )}
      </Box>
      <Box>
        <FormLabel sx={{ mb: 1, color: 'text.secondary' }}>
          <Trans>Enter Wallet Address</Trans>
        </FormLabel>
        <InputBase
          sx={(theme) => ({
            py: 1,
            px: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '6px',
            mb: 1,
            overflow: 'show',
            fontSize: sm ? '16px' : '14px',
          })}
          placeholder="Enter ethereum address or username"
          fullWidth
          value={tranferTo}
          onChange={(e) => setTransferTo(e.target.value)}
          inputProps={{
            'aria-label': 'read-only mode address',
          }}
        />
        <Typography variant="helperText" color="error.main">
          {handleBlocked()}
        </Typography>
      </Box>

      {selectedVestId && (
        <TxModalDetails gasLimit={gasLimit}>
          <DetailsInfoLine description={'Vest ID'} value={`#${selectedVestId.toString()}`} />
          <DetailsInfoLine
            description={'Transfer To'}
            value={
              <CompactableTypography compact={true} loading={false}>
                {tranferTo}
              </CompactableTypography>
            }
          />
        </TxModalDetails>
      )}

      {txError && <GasEstimationError txError={txError} />}

      <TransferVestAction
        isWrongNetwork={isWrongNetwork}
        selectedReward={undefined ?? ({} as Reward)}
        blocked={blockingError !== undefined}
      />
    </>
  );
};
