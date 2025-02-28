import { t } from '@lingui/macro';
import { ReactNode } from 'react';
import { ROUTES } from 'src/components/primitives/Link';
import { ENABLE_TESTNET } from 'src/utils/marketsAndNetworksConfig';

import { MarketDataType } from '../marketsConfig';

interface Navigation {
  link: string;
  title: string;
  isVisible?: (data: MarketDataType) => boolean | undefined;
  dataCy?: string;
}

export const navigation = (_bridgeLink: string): Navigation[] => {
  return [
    {
      link: ROUTES.markets,
      title: t`Home`,
      dataCy: 'menuMarkets',
    },
    {
      link: ROUTES.dashboard,
      title: t`Dashboard`,
      dataCy: 'menuDashboard',
    },
    {
      link: ROUTES.rewards,
      title: t`Rewards`,
      dataCy: 'menuMarkets',
    },
    {
      link: ROUTES.stake,
      title: t`Stake`,
      dataCy: 'menuMarkets',
    },
    // {
    //   link: ROUTES.emissionVoting,
    //   title: t`Voting`,
    //   dataCy: 'menuMarkets',
    // },
    {
      link: ROUTES.gravity,
      title: t`Gravity 🚀`,
      dataCy: 'menuMarkets',
    },
    // {
    //   link: 'https://docs.google.com/forms/d/e/1FAIpQLSf2RmxTce7xDZueULr2vjmSntSm0lmesiFi1sqxpnkPblN0vA/viewform',
    //   title: t`NFTs`,
    //   dataCy: 'menuNFT',
    // },
    /*{
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSdqA5ym974JwLt-Ci1k2hoW9jsZjfDyF6BO5J0w9FZ12FQXZg/viewform',
      title: t`FTX Claims`,
      dataCy: 'menuFTX',
    },*/
    /*{
      link: 'https://docs.zerolend.xyz',
      title: t`Docs`,
      dataCy: 'menuDocs',
    },*/
    // {
    //   link: bridgeLink,
    //   title: t`Bridge`,
    //   dataCy: 'menuBridge',
    // },
    {
      link: ROUTES.faucet,
      title: t`Faucet`,
      isVisible: () => process.env.NEXT_PUBLIC_ENV === 'staging' || ENABLE_TESTNET,
    },
    {
      link: ROUTES.strategy,
      title: t`Strategy`,
      dataCy: 'menuMarkets',
      isVisible: () => false,
      // isVisible: () => process.env.NEXT_PUBLIC_ENV === 'staging' || ENABLE_TESTNET,
    },
  ];
};

interface MoreMenuItem extends Navigation {
  icon: ReactNode;
  makeLink?: (walletAddress: string) => string;
}

const moreMenuItems: MoreMenuItem[] = [];

const fiatEnabled = process.env.NEXT_PUBLIC_FIAT_ON_RAMP;
if (fiatEnabled === 'true') {
  // moreMenuItems.push({
  //   link: 'https://global.transak.com',
  //   makeLink: (walletAddress) =>
  //     `${process.env.NEXT_PUBLIC_TRANSAK_APP_URL}/?apiKey=${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}&walletAddress=${walletAddress}&disableWalletAddressForm=true`,
  //   title: t`Buy Crypto With Fiat`,
  //   icon: <CreditCardIcon />,
  // });
}
export const moreNavigation: MoreMenuItem[] = [...moreMenuItems];
