import { ChainId } from '@aave/contract-helpers';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError } from '@web3-react/core';
import { FrameConnector } from '@web3-react/frame-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { TorusConnector } from '@web3-react/torus-connector';
import { ConnectorUpdate } from '@web3-react/types';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';
import { LedgerHQFrameConnector } from 'web3-ledgerhq-frame-connector';

import { WalletConnectConnector } from './WalletConnectConnector';
import { OkxWalletConnector } from './OkxWalletConnector';
import { getWeb3Connector } from '@binance/w3w-web3-connector';

export enum WalletType {
  OKX = 'okx',
  BITGET = 'bitget',
  INJECTED = 'injected',
  WALLET_CONNECT = 'wallet_connect',
  WALLET_LINK = 'wallet_link',
  TORUS = 'torus',
  FRAME = 'frame',
  GNOSIS = 'gnosis',
  LEDGER = 'ledger',
  READ_ONLY_MODE = 'read_only_mode',
  BINANCE = 'binance',
}

const APP_NAME = 'ZeroLend';
const APP_LOGO_URL = 'https://app.zerolend.xyz/favicon.ico';

const mockProvider = {
  request: Promise.resolve(null),
};

/**
 *  This is a connector to be used in read-only mode.
 *  On activate, the connector expects a local storage item called `readOnlyModeAddress` to be set, otherwise an error is thrown.
 *  When the connector is deactivated (i.e. on disconnect, switching wallets), the local storage item is removed.
 */
export class ReadOnlyModeConnector extends AbstractConnector {
  readAddress = '';

  activate(): Promise<ConnectorUpdate<string | number>> {
    const address = localStorage.getItem('readOnlyModeAddress');
    if (!address || address === 'undefined') {
      throw new Error('No address found in local storage for read-only mode');
    }

    this.readAddress = address;

    return Promise.resolve({
      provider: mockProvider,
      chainId: ChainId.mainnet,
      account: this.readAddress,
    });
  }
  getProvider(): Promise<unknown> {
    return Promise.resolve(mockProvider);
  }
  getChainId(): Promise<string | number> {
    return Promise.resolve(ChainId.mainnet);
  }
  getAccount(): Promise<string | null> {
    return Promise.resolve(this.readAddress);
  }
  deactivate(): void {
    const storedReadAddress = localStorage.getItem('readOnlyModeAddress');
    if (storedReadAddress === this.readAddress) {
      // Only update local storage if the address is the same as the one this connector stored.
      // This will be different if the user switches to another account to observe because
      // the new connector gets initialized before this one is deactivated.
      localStorage.removeItem('readOnlyModeAddress');
    }
  }
}

export class BitgetConnector extends InjectedConnector {}

export const getWallet = (
  wallet: WalletType,
  chainId: ChainId = ChainId.mainnet,
  currentChainId: ChainId = ChainId.mainnet
): AbstractConnector => {
  switch (wallet) {
    case WalletType.OKX:
      return new OkxWalletConnector({});
    case WalletType.BITGET:
      return new BitgetConnector({});
    case WalletType.READ_ONLY_MODE:
      return new ReadOnlyModeConnector();
    case WalletType.LEDGER:
      return new LedgerHQFrameConnector({});
    case WalletType.INJECTED:
      return new InjectedConnector({});
    case WalletType.WALLET_LINK:
      const networkConfig = getNetworkConfig(chainId);
      return new WalletLinkConnector({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        url: networkConfig.privateJsonRPCUrl || networkConfig.publicJsonRPCUrl[0],
      });
    case WalletType.WALLET_CONNECT:
      return new WalletConnectConnector(currentChainId);
    case WalletType.GNOSIS:
      if (window) {
        return new SafeAppConnector();
      }
      throw new Error('Safe app not working');
    case WalletType.TORUS:
      return new TorusConnector({
        chainId,
        initOptions: {
          network: {
            host: chainId === ChainId.polygon ? 'matic' : chainId,
          },
          showTorusButton: false,
          enableLogging: false,
          enabledVerifiers: false,
        },
      });
    case WalletType.FRAME: {
      if (chainId !== ChainId.mainnet) {
        throw new UnsupportedChainIdError(chainId, [1]);
      }
      return new FrameConnector({ supportedChainIds: [1] });
    }
    case WalletType.BINANCE:
      const Connector = getWeb3Connector();
      return new Connector({
        rpc: {
          [1]: 'https://cloudflare-eth.com/v1/mainnet',
          [81457]: 'https://rpc.ankr.com/blast',
          [324]: 'https://mainnet.era.zksync.io',
          [280]: 'https://testnet.era.zksync.dev',
          [59144]: 'https://linea.blockpi.network/v1/rpc/public',
          [169]: 'https://pacific-rpc.manta.network/http',
          [168587773]: 'https://sepolia.blast.io',
        },
        supportedChainIds: [1, 81457, 324, 280, 59144, 169, 168587773],
        // supportedChainIds: [chainId, currentChainId],
      });
    default: {
      throw new Error(`unsupported wallet`);
    }
  }
};
