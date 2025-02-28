import React from 'react';
import { Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Warning } from '../components/primitives/Warning';
import { MarketBannerProps } from '../modules/markets/MarketBanners';

export const marketBorrowBanners: { [key: string]: React.ReactNode } = {
  // proto_mainnet_btc_v3: (
  //   <Warning severity="info">
  //     <Typography variant="subheader1">
  //       <Trans>aaa! You now have special access to our Discord!</Trans>
  //     </Typography>
  //     <Trans>
  //       As a liquidity provider, you will get roles (Shrimp/Shark/Whale) in our discord that give
  //       you exclusive access to private channels. Visit{' '}
  //       <a href="https://guild.xyz/zerolend" target="_blank" rel="noreferrer">
  //         Guild.xyz
  //       </a>{' '}
  //       to claim these roles.
  //     </Trans>
  //   </Warning>
  // ),
};

export const marketMainBanners: { [key: string]: MarketBannerProps } = {
  proto_mainnet_btc_v3: {
    img: '/icons/other/pendleicon.svg',
    title: 'Earn 50%-80% Native Yields On Your BTCs With Leverage 👨‍🌾',
    cta: {
      link: 'https://zerolend.contango.xyz/strategies/leveraged-staking/btc?selectedChains=1',
      text: 'Start Leveraging',
    },
    description:
      'Contango now supports ZeroLend markets! Which means you can now leverage your BTC postions by 10x in just one click. ' +
      'Farm a max APR of 80% in BTC and 430% in ZERO by leveraging on eBTC Pendle tokens.',
  },
  proto_mainnet_lrt_v3: {
    title: 'Leverage Your LRT Yields or Points by 10x!',
    img: '/icons/other/pendleicon.svg',
    description:
      'Supply your ETH assets and earn passive yield from borrowers. Borrowers can' +
      ' borrow upto 90% of their collateral and leverage their ETH LRT yields or points by 10x.' +
      ' You can even leverage on Pendle PT tokens to borrow more of the underlying assets.',
  },
  // proto_base_v3: {
  //   title: 'Farm USDC, MAHA & ZERO by supplying liquidity to ZAI 🧑‍🌾',
  //   img: '/icons/tokens/xusdz.svg',
  //   cta: {
  //     link: 'https://app.maha.xyz/earn/pool/8453/0x1097dFe9539350cb466dF9CA89A5e61195A520B0/',
  //     text: 'Start Farming',
  //   },
  //   description:
  //     'As liquidity partners for the ZeroLend Base market, you can now earn 15-20% yields by supplying liquidity to the ZAI pool on MAHA.xyz. ' +
  //     'More liquidity on the ZAI pool means more borrowing on ZeroLend 🚀.',
  // },
  proto_mainnet_rwa_v3: {
    title: `Supply USDC and claim X% rewards on Merkle 🧑‍🌾`,
    img: '/icons/tokens/usdc.svg',
    cta: {
      link: 'https://merkl.angle.money/ethereum/hold/1/0x3ce38A9e2403415c50661a3f78acf4d392320e7E',
      text: 'View Rewards',
    },
    description:
      'Supply USDC and earn a 10-20% native yield along with third party rewards from Merkle. Supplied USDC is borrowed by traders ' +
      'looking to maximize their Pendle PT yields. Users who stake ZERO also earn a 6x boost in their yields!',
  },
};

const pendleDescription = (marketId: string) => (
  <Warning severity="info">
    <Typography variant="subheader1">
      <Trans>This is a Pendle PT Token which offers a fixed yield</Trans>
    </Typography>
    <Trans>
      Pendle PT tokens are fixed yield assets that represent the future yield of the underlying
      asset. By using PT tokens as collateral, you can borrow the underlying asset to loop and gain
      more exposure to the PT tokens. To get more information about this PT token, visit the{' '}
      <a
        target="blank"
        href={`https://app.pendle.finance/trade/markets/${marketId}/swap?view=pt&py=output&chain=ethereum`}
        rel="noreferrer"
      >
        Pendle market
      </a>
      .
    </Trans>
  </Warning>
);

export const marketAssetBanners: { [key: string]: { [key: string]: React.ReactNode } } = {
  proto_mainnet_btc_v3: {
    'pt-corn-ebtc-27mar2025': pendleDescription('0x2c71ead7ac9ae53d05f8664e77031d4f9eba064b'),
    'pt-cornlbtc-26dec2024': pendleDescription('0xcae62858db831272a03768f5844cbe1b40bb381f'),
    'pt-ebtc-26dec2024': pendleDescription('0x36d3ca43ae7939645c306e26603ce16e39a89192'),
    'pt-lbtc-27mar2025': pendleDescription('0x70b70ac0445c3ef04e314dfda6caafd825428221'),
  },
  proto_mainnet_lrt_v3: {
    'pt-rseth-26sep2024': pendleDescription('0x6b4740722e46048874d84306b2877600abcea3ae'),
    'pt-ezeth-26dec2024': pendleDescription('0xd8f12bcde578c653014f27379a6114f67f0e445f'),
  },
  proto_mainnet_rwa_v3: {
    'pt-usd0++-27mar2025': pendleDescription('0xafdc922d0059147486cc1f0f32e3a2354b0d35cc'),
  },
};
