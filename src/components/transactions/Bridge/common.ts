import { BaseNetworkConfig } from 'src/ui-config/networksConfig';
import {
  getSupportedChainIds,
  marketsData,
  networkConfigs,
} from 'src/utils/marketsAndNetworksConfig';

import { marketsData as _marketsData } from 'src/ui-config/marketsConfig';

export interface SupportedNetworkWithChainId extends BaseNetworkConfig {
  chainId: number;
}

export const supportedNetworksConfig: SupportedNetworkWithChainId[] = getSupportedChainIds().map(
  (chainId) => ({
    ...networkConfigs[chainId],
    chainId,
  })
);
export const supportedNetworksWithEnabledMarket = supportedNetworksConfig.filter((elem) =>
  Object.values(marketsData).find(
    (market) => market.chainId === elem.chainId && market.enabledFeatures?.bridge
  )
);

export const getCurMarketData = (chainId: number) => {
  for (const marketKey in _marketsData) {
    const market = marketsData[marketKey];
    if (market.chainId === chainId) {
      return market;
    }
  }
  return undefined;
};
