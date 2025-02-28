import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useIsWrongNetwork } from 'src/hooks/useIsWrongNetwork';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getNetworkConfig, NetworkConfig } from 'src/utils/marketsAndNetworksConfig';
import { GENERAL } from 'src/utils/mixPanelEvents';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { SupportedNetworkWithChainId } from './common';
import { NetworkSelector } from './NetworkSelector';
import { BridgeActions } from './BridgeActions';
import { BridgeAssetInput } from './BridgeAssetInput';
import { BridgeErrors } from './BridgeErrors';
import { TokenInfoWithBalance } from './BridgeModal';
import { BridgeTxSuccessView } from './BridgeTxSuccessView';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';

interface BridgeModalContentProps {
  sourceChainId: number;
  setSourceChainId: (value: number) => void;
  destChainId: number;
  setDestChainId: (value: number) => void;
  supportedNetworks: SupportedNetworkWithChainId[];
  tokens: TokenInfoWithBalance[];
  selectedNetworkConfig: NetworkConfig;
  destNetworkConfig: NetworkConfig;
}

export const BridgeModalContent = ({
  supportedNetworks,
  sourceChainId,
  setSourceChainId,
  destChainId,
  setDestChainId,
  tokens,
  selectedNetworkConfig,
  destNetworkConfig,
}: BridgeModalContentProps) => {
  const [inputAmount, setInputAmount] = useState('');
  const { mainTxState: bridgeTxState, txError, setTxError } = useModalContext();
  const user = useRootStore((store) => store.account);

  const getDefaultToken = () => {
    const sourceToken = tokens.find((elem) => elem.chainId === sourceChainId);
    return sourceToken ?? tokens[0];
  };

  const [bridgeToken, setBridgeToken] = useState(() => getDefaultToken());
  const [targetEId, setTargetEId] = useState(0);

  useEffect(() => {
    setBridgeToken(getDefaultToken());
    const destToken = tokens.find((elem) => elem.chainId === destChainId);
    setTargetEId(destToken?.eId ?? 0);
  }, [tokens]);

  useEffect(() => {
    const destChain = tokens.find((elem) => elem.chainId === destChainId);
    setTargetEId(destChain?.eId ?? 0);
  }, [destChainId, sourceChainId]);

  const { readOnlyModeAddress } = useWeb3Context();

  const isWrongNetwork = useIsWrongNetwork(sourceChainId);

  const handleInputChange = (value: string) => {
    setTxError(undefined);
    if (value === '-1') {
      setInputAmount(bridgeToken.balance);
    } else {
      setInputAmount(value);
    }
  };

  if (bridgeTxState.success) {
    return (
      <BridgeTxSuccessView
        txHash={bridgeTxState.txHash}
        amount={inputAmount}
        symbol={bridgeToken.symbol}
        iconSymbol={bridgeToken.symbol}
        iconUri={selectedNetworkConfig.networkLogoPath}
        outSymbol={bridgeToken.symbol}
        outIconSymbol={bridgeToken.symbol}
        outIconUri={destNetworkConfig.networkLogoPath}
        outAmount={inputAmount}
      />
    );
  }

  const handleSourceNetworkChange = (value: number) => {
    setTxError(undefined);
    setSourceChainId(value);
  };

  const handleDestNetworkChange = (value: number) => {
    setTxError(undefined);
    setDestChainId(value);
  };

  return (
    <>
      {/* <TxModalTitle title="Bridge ZERO" /> */}
      <Typography variant="h2" sx={{ mb: 3 }}>
        Bridge ZERO
      </Typography>
      <Typography variant="description" sx={{ mb: 3 }}>
        Bridge ZERO to other networks using LayerZero.
      </Typography>
      {isWrongNetwork.isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning
          networkName={getNetworkConfig(sourceChainId).name}
          chainId={sourceChainId}
          event={{
            eventName: GENERAL.SWITCH_NETWORK,
          }}
        />
      )}

      {!bridgeToken ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            <NetworkSelector
              networks={supportedNetworks}
              selectedNetwork={sourceChainId}
              setSelectedNetwork={handleSourceNetworkChange}
              isSource={true}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <BridgeAssetInput
              assets={tokens}
              value={inputAmount}
              onChange={handleInputChange}
              usdValue={'0'}
              symbol={bridgeToken.symbol}
              inputTitle={' '}
              sx={{ width: '100%' }}
              chainId={sourceChainId}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'left', mt: 4 }}>
            <NetworkSelector
              networks={supportedNetworks}
              selectedNetwork={destChainId}
              setSelectedNetwork={handleDestNetworkChange}
              isSource={false}
              sourceChainId={sourceChainId}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <BridgeAssetInput
              assets={tokens}
              value={inputAmount}
              usdValue={'0'}
              symbol={bridgeToken.symbol}
              disableInput={true}
              inputTitle={' '}
              sx={{ width: '100%' }}
              chainId={destChainId}
            />
          </Box>
          {user ? (
            <>
              <BridgeErrors balance={bridgeToken.balance} inputAmount={inputAmount} />
              {txError && <GasEstimationError txError={txError} />}
              <BridgeActions
                isWrongNetwork={isWrongNetwork.isWrongNetwork}
                inputAmount={inputAmount}
                inputToken={bridgeToken.address}
                outputToken={bridgeToken.address}
                inputName={bridgeToken.name}
                outputName={bridgeToken.name}
                blocked={Number(inputAmount) > Number(bridgeToken.balance) || !user}
                chainId={sourceChainId}
                targetEId={targetEId}
              />
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, alignItems: 'center' }}>
              <Typography sx={{ mb: 6, textAlign: 'center' }} color="text.secondary">
                <Trans>Please connect your wallet to be able to bridge ZERO.</Trans>
              </Typography>
              <ConnectWalletButton />
            </Box>
          )}
        </>
      )}
    </>
  );
};
