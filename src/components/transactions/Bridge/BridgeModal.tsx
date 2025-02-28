import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ContractCallContext, ContractCallResults, Multicall } from 'ethereum-multicall';
import { formatUnits } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';
import { BRIDGE_TOKEN_LIST, TokenInfo } from 'src/ui-config/TokenList';
import {
  CustomMarket,
  getNetworkConfig,
  getProvider,
  marketsData,
} from 'src/utils/marketsAndNetworksConfig';

import { BasicModal } from '../../primitives/BasicModal';
import { supportedNetworksWithEnabledMarket } from './common';
import { BridgeModalContent } from './BridgeModalContent';

const sourceNetwork = marketsData[CustomMarket.proto_linea_v3];
const destNetwork = marketsData[CustomMarket.proto_blast_v3];

export interface TokenInfoWithBalance extends TokenInfo {
  balance: string;
}

export const BridgeModal = () => {
  const {
    type,
    close,
    args: { chainId },
  } = useModalContext();

  const currentChainId = useRootStore((store) => store.currentChainId);
  const user = useRootStore((store) => store.account);

  const [selectedChainId, setSelectedChainId] = useState(() => {
    if (supportedNetworksWithEnabledMarket.find((elem) => elem.chainId === currentChainId)) {
      return currentChainId;
    }
    return sourceNetwork.chainId;
  });

  const [destChainId, setDestChainId] = useState(destNetwork.chainId);

  const [tokenListWithBalance, setTokensListBalance] = useState<TokenInfoWithBalance[]>([]);

  const selectedNetworkConfig = getNetworkConfig(selectedChainId);
  const destNetworkConfig = getNetworkConfig(destChainId);

  useEffect(() => {
    // Passing chainId as prop will set default network for bridge modal
    if (chainId && supportedNetworksWithEnabledMarket.find((elem) => elem.chainId === chainId)) {
      setSelectedChainId(chainId);
    } else if (supportedNetworksWithEnabledMarket.find((elem) => elem.chainId === currentChainId)) {
      setSelectedChainId(currentChainId);
    } else {
      setSelectedChainId(sourceNetwork.chainId);
    }
  }, [currentChainId, chainId]);

  useEffect(() => {
    if (selectedChainId == destChainId) {
      const destChain = supportedNetworksWithEnabledMarket.find(
        (elem) => elem.chainId !== selectedChainId
      );
      setDestChainId(destChain?.chainId ?? destNetwork.chainId);
    }
  }, [selectedChainId]);

  useEffect(() => {
    if (selectedChainId == destChainId) {
      const sourceChain = supportedNetworksWithEnabledMarket.find(
        (elem) => elem.chainId !== destChainId
      );
      setSelectedChainId(sourceChain?.chainId ?? sourceNetwork.chainId);
    }
  }, [destChainId]);

  const filteredTokens = useMemo(() => {
    const transformedTokens = BRIDGE_TOKEN_LIST.tokens.map((token) => {
      return { ...token, balance: '0' };
    });
    return transformedTokens.filter(
      (token) => token.chainId === selectedChainId || token.chainId === destChainId
    );
  }, [selectedChainId, destChainId]);

  const contractCallContext: ContractCallContext[] = filteredTokens.map((token) => {
    return {
      reference: token.address,
      contractAddress: token.address,
      abi: [
        {
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: 'balance', type: 'uint256' }],
        },
      ],
      calls: [{ reference: 'balanceOfCall', methodName: 'balanceOf', methodParameters: [user] }],
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      setTokensListBalance([]);
      if (
        !type ||
        type !== ModalType.Bridge ||
        !user ||
        user.length !== 42 ||
        !user.startsWith('0x')
      ) {
        return;
      }

      const updatedTokens = await Promise.all(
        filteredTokens.map(async (token) => {
          const provider = getProvider(token.chainId);
          // const tokenBalanceService = new WalletBalanceService(
          //   provider,
          //   token.chainId == sourceNetwork.chainId ? sourceNetwork.addresses.WALLET_BALANCE_PROVIDER : destNetwork.addresses.WALLET_BALANCE_PROVIDER,
          //   token.chainId
          // );
          // const result = await tokenBalanceService.getTokenBalanceOf({ tokenAddress: token.address, user: user })
          let balance = '0';

          const multicall = new Multicall({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ethersProvider: provider as unknown as providers.Provider,
            tryAggregate: true,
            multicallCustomContractAddress:
              token.chainId == 324
                ? '0xF9cda624FBC7e059355ce98a31693d299FACd963'
                : '0xcA11bde05977b3631167028862bE2a173976CA11',
          });

          try {
            const { results }: ContractCallResults = await multicall.call(contractCallContext);
            // NOTE just for deploy
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Object.values(results).forEach((contract) => {
              if (
                contract.originalContractCallContext.contractAddress.toLowerCase() ===
                token.address.toLowerCase()
              ) {
                const balanceData = contract.callsReturnContext[0].returnValues[0];
                if (balanceData) {
                  balance = formatUnits(balanceData, token.decimals);
                }
              }
            });
          } catch (error) {
            console.error('Multicall error:', error);
          }

          return {
            ...token,
            balance,
          };
        })
      );

      setTokensListBalance(updatedTokens);
      // } catch (error) {
      //   console.error('Multicall error:', error);
      //   setTokensListBalance(filteredTokens)
      //   // should we just silently let answers fail?
      // }
    };

    fetchData();
  }, [user, selectedChainId, destChainId, type]);

  const tokenListSortedByBalace = tokenListWithBalance.sort(
    (a, b) => Number(b.balance) - Number(a.balance)
  );

  return (
    <BasicModal open={type === ModalType.Bridge} setOpen={close}>
      {tokenListSortedByBalace.length >= 1 ? (
        <BridgeModalContent
          key={selectedChainId}
          sourceChainId={selectedChainId}
          setSourceChainId={setSelectedChainId}
          destChainId={destChainId}
          setDestChainId={setDestChainId}
          supportedNetworks={supportedNetworksWithEnabledMarket}
          tokens={tokenListSortedByBalace}
          selectedNetworkConfig={selectedNetworkConfig}
          destNetworkConfig={destNetworkConfig}
        />
      ) : !user ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, alignItems: 'center' }}>
          <Typography sx={{ mb: 6, mt: 4, textAlign: 'center' }} color="text.secondary">
            <Trans>Please connect your wallet to be able to bridge ZERO.</Trans>
          </Typography>
          <ConnectWalletButton />
        </Box>
      ) : (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', my: '60px' }}>
          <CircularProgress />
        </Box>
      )}
    </BasicModal>
  );
};
