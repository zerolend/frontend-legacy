import { ChainId } from '@aave/contract-helpers';
import { ReactNode } from 'react';

export const governance_start_date = new Date('May 6, 2024 8:00:00 UTC').getTime();
export const convert_start_date = new Date('May 6, 2024 7:30:00 UTC').getTime();
export const linkNew = 'https://one.zerolend.xyz';

export type MarketDataType = {
  v3?: boolean;
  marketTitle: string;
  marketAltName?: string;
  grpKey?: string;
  market?: CustomMarket;
  chainId: number; // the network the market operates on
  hideInMarketSwitcher?: boolean;
  isAlpha?: boolean;
  show1DBorrowAPR?: boolean;
  bg?: string;
  switchToNewUI?: boolean;
  enabledFeatures?: {
    paymasters?: boolean;
    liquiditySwap?: boolean;
    staking?: boolean;
    governance?: boolean;
    faucet?: boolean;
    collateralRepay?: boolean;
    incentives?: boolean;
    permissions?: boolean;
    debtSwitch?: boolean;
    isGasless?: boolean;
    withdrawAndSwitch?: boolean;
    switch?: boolean;
    bridge?: boolean;
  };
  whiteListedIncentives: readonly string[];
  isFork?: boolean;
  permissionComponent?: ReactNode;
  disableCharts?: boolean;
  description?: string;
  subgraphUrl?: string;
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    LENDING_POOL: string;
    WETH_GATEWAY?: string;
    PAYMASTER?: string;
    SWAP_COLLATERAL_ADAPTER?: string;
    REPAY_WITH_COLLATERAL_ADAPTER?: string;
    DEBT_SWITCH_ADAPTER?: string;
    WITHDRAW_SWITCH_ADAPTER?: string;
    FAUCET?: string;
    PERMISSION_MANAGER?: string;
    WALLET_BALANCE_PROVIDER: string;
    L2_ENCODER?: string;
    UI_POOL_DATA_PROVIDER: string;
    UI_INCENTIVE_DATA_PROVIDER?: string;
    COLLECTOR?: string;
    V3_MIGRATOR?: string;
    GHO_TOKEN_ADDRESS?: string;
    GHO_UI_DATA_PROVIDER?: string;
    EARLYZERO_ADDRESS?: string;
    LEVERAGE?: string;
    OFT_ADAPTER?: string;
    OFT?: string;
    VESTING_ADDRESS?: string;
    STAKING_BONUS?: string;
    OMNI_STAKING?: string;
    LOCKER_TOKEN?: string;
    LOCKER_LP?: string;
    EARLY_ZERO_VESTING?: string;
    ZERO_ADDRESS?: string;
    POOL_VOTER?: string;
    ZERO_AIRDROP?: string;
    ORACLE_ADDRESS?: string;
  };
  /**
   * https://www.hal.xyz/ has integrated aave for healtfactor warning notification
   * the integration doesn't follow aave market naming & only supports a subset of markets.
   * When a halIntegration is specified a link to hal will be displayed on the ui.
   */
  halIntegration?: {
    URL: string;
    marketName: string;
  };
};

export enum CustomMarket {
  proto_zksync_era_v3 = 'proto_zksync_era_v3',
  proto_linea_v3 = 'proto_linea_v3',
  proto_base_v3 = 'proto_base_v3',
  proto_linea_croak_v3 = 'proto_linea_croak_v3',
  // proto_barito_v3 = 'proto_barito_v3',
  proto_linea_foxy_v3 = 'proto_linea_foxy_v3',
  // proto_linea_v3_test = 'proto_linea_v3_test',
  proto_corn_v3 = 'proto_corn_v3',
  proto_manta_v3 = 'proto_manta_v3',
  // proto_linea_sepolia_v3 = 'proto_linea_sepolia_v3',
  proto_blast_v3 = 'proto_blast_v3',
  proto_abstract_v3 = 'proto_abstract_v3',
  proto_zircuit_v3 = 'proto_zircuit_v3',
  proto_mainnet_lrt_v3 = 'proto_mainnet_lrt_v3',
  proto_mainnet_btc_v3 = 'proto_mainnet_btc_v3',
  proto_mainnet_rwa_v3 = 'proto_mainnet_rwa_v3',
  proto_layerx_v3 = 'proto_layerx_v3',
}

export const marketsData: {
  [key in keyof typeof CustomMarket]: MarketDataType;
} = {
  [CustomMarket.proto_linea_v3]: {
    //linea actual market
    marketTitle: 'Linea',
    marketAltName: 'Linea Main Market',
    grpKey: 'linea',
    chainId: 59144,
    disableCharts: false,
    v3: true,
    enabledFeatures: {
      governance: true,
      staking: true,
      collateralRepay: false,
      incentives: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xC44827C51d00381ed4C52646aeAB45b455d200eB',
      LENDING_POOL: '0x2f9bB73a8e98793e26Cb2F6C4ad037BDf1C6B269',
      WETH_GATEWAY: '0x5d50bE703836C330Fc2d147a631CDd7bb8D7171c',
      WALLET_BALANCE_PROVIDER: '0xE05361EA51E20118072aec0fB0FD178e8b09D69e',
      UI_POOL_DATA_PROVIDER: '0x81b3184A3B5d4612F2c26A53Da8D99474B91B2D2',
      UI_INCENTIVE_DATA_PROVIDER: '0xCbDc0aeD7CDf2472784068abEf23a902CafABb98',
      // COLLECTOR: '0x89fEc31daD373922879bd6279ccDc3666c5D1b7a',
      OFT_ADAPTER: '0x671FbC39D7C99735E99Ce6918ff0666E88971D45',
      STAKING_BONUS: '0xD676c56A93Fe2a05233Ce6EAFEfDe2bd4017B3eA',
      OMNI_STAKING: '0xf374229a18ff691406f99CCBD93e8a3f16B68888',
      LOCKER_TOKEN: '0x08D5FEA625B1dBf9Bae0b97437303a0374ee02F8',
      ZERO_ADDRESS: '0x78354f8DcCB269a615A7e0a24f9B0718FDC3C7A7',
      VESTING_ADDRESS: '0x9FA72ea96591e486FF065E7C8A89282dEDfA6C12',
      POOL_VOTER: '0x5346e9ab27D7874Db95993667D1Cb8338913f0aF',
      ORACLE_ADDRESS: '0x1C2B983E1FE9830B80c315b7dd2A331960C842DC',
      ZERO_AIRDROP: '0x569982A604cA61fa425fD924ADF08BE9e4f3035f',
    },
  },
  [CustomMarket.proto_abstract_v3]: {
    //linea actual market
    marketTitle: 'Abstract',
    description: 'Primary market on Abstract. Focused on growing the Abstract ecosystem.',
    chainId: 2741,
    v3: true,
    isAlpha: false,
    disableCharts: true,
    enabledFeatures: {

    },
    whiteListedIncentives: ['zero'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xde15Bc7060Eb299674D652f48b76BA18c1179028',
      LENDING_POOL: '0x7C4baE19949D77B7259Dc4A898e64DC5c2d10b02',
      WETH_GATEWAY: '0x2F6F0a4c07146B2AdF5c36951B130A52aeF284d7',
      WALLET_BALANCE_PROVIDER: '0xE67DCeeb392A5d3A8E205c2666d347B474291956',
      UI_POOL_DATA_PROVIDER: '0xAD6CA4eFab43c51f0bDd09c2dBBAa321FD0E5d37',
      UI_INCENTIVE_DATA_PROVIDER: '0x7AA9B563c1eC0aeaA900e6483FD01eEC4aCb2BCb',
      // COLLECTOR: '0x89fEc31daD373922879bd6279ccDc3666c5D1b7a',
    },
  },
  [CustomMarket.proto_base_v3]: {
    marketTitle: 'Base',
    chainId: 8453,
    v3: true,
    disableCharts: false,
    switchToNewUI: false,
    enabledFeatures: {
      incentives: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x5213ab3997a596c75Ac6ebF81f8aEb9cf9A31007',
      LENDING_POOL: '0x766f21277087E18967c1b10bF602d8Fe56d0c671',
      WETH_GATEWAY: '0x11CCDcFb19151FEb086ee6F1f62bfA0940C85612',
      WALLET_BALANCE_PROVIDER: '0x6eA9d99c6653DF987bDEa11ffcd56DFB4B5d38b4',
      COLLECTOR: '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4',
      UI_POOL_DATA_PROVIDER: '0x0A1198DDb5247a283F76077Bb1E45e5858ee100b',
      UI_INCENTIVE_DATA_PROVIDER: '0xa1e6BcDab01B9d7De83647d1Bbd4113c6c2B4e0d',
      OFT: '0x458AD5B487F4442245E4C5eA7249009E607A5583',
      VESTING_ADDRESS: '',
      ZERO_ADDRESS: '0x458AD5B487F4442245E4C5eA7249009E607A5583',
    },
  },

  [CustomMarket.proto_corn_v3]: {
    marketTitle: 'Corn',
    chainId: 21000000,
    v3: true,
    disableCharts: true,
    switchToNewUI: false,
    enabledFeatures: {
      staking: false,
      incentives: true,
      bridge: true,
    },
    isAlpha: false,
    whiteListedIncentives: ['zero'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xb518f444E19446E1A3c5225A5233B908941f8be4',
      LENDING_POOL: '0x87E279BcfF5Eb6C946039C3F84A98dB4fAf1a237',
      WETH_GATEWAY: '0x6Ff5bE919b2e5deB0e26c8c46603054D2d266E41',
      WALLET_BALANCE_PROVIDER: '0xE7c5cD2a2ad89A61762ab2B51586B2663660B9df',
      COLLECTOR: '0xde7DDF06E85A786Fb2C89953eeACC49DbfF6E9cF',
      UI_POOL_DATA_PROVIDER: '0x51120bFbCeC8A108D6C6494EC0843135488a72E3',
      UI_INCENTIVE_DATA_PROVIDER: '0x35B9A70778d9ca973f50257314266aB620081AfF',
      OFT: '',
      VESTING_ADDRESS: '',
      ZERO_ADDRESS: '',
    },
  },
  [CustomMarket.proto_mainnet_btc_v3]: {
    marketTitle: 'Bitcoin LRTs',
    chainId: ChainId.mainnet,
    description:
      'The Bitcoin LRT Market is a BTC-focused market that allows users to lend/borrow BTC-corelated assets at high LTVs. This market also supports Pendle PT tokens as collateral.',
    v3: true,
    disableCharts: false,
    marketAltName: 'Bitcoin LRTs',
    grpKey: 'ethereum',
    enabledFeatures: {
      staking: false,
      liquiditySwap: true,
      debtSwitch: false,
      incentives: true,
      withdrawAndSwitch: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x17878AFdD5772F4Ec93c265Ac7Ad8E2b29abB857',
      LENDING_POOL: '0xCD2b31071119D7eA449a9D211AC8eBF7Ee97F987',
      WETH_GATEWAY: '0x2787c0cb2F20010Ae2814Da9Ef20E04bb64B2466',
      WALLET_BALANCE_PROVIDER: '0xa1e6BcDab01B9d7De83647d1Bbd4113c6c2B4e0d',
      COLLECTOR: '0x4e88e72bd81c7ea394cb410296d99987c3a242fe',
      SWAP_COLLATERAL_ADAPTER: '0x189cfdb4d7a08D926CA209D84a713c4c629645aF',
      DEBT_SWITCH_ADAPTER: '0x80Ce5A187E477663fcFE99A108eefd9FBf0acC18',
      UI_POOL_DATA_PROVIDER: '0xa6EA08D16d47feE408505fda73520EbefC68Ef01',
      UI_INCENTIVE_DATA_PROVIDER: '0x0A1198DDb5247a283F76077Bb1E45e5858ee100b',
      OFT: '0x2Da17fAf782ae884faf7dB2208BBC66b6E085C22',
      VESTING_ADDRESS: '',
      ZERO_ADDRESS: '0x2Da17fAf782ae884faf7dB2208BBC66b6E085C22',
    },
  },
  [CustomMarket.proto_mainnet_rwa_v3]: {
    marketTitle: 'RWA Stablecoins',
    chainId: ChainId.mainnet,
    v3: true,
    disableCharts: false,
    switchToNewUI: false,
    description:
      'The RWA Stablecoin is a stablecoin-focused market that allows users to lend/borrow stablecoins backed by real-world assets at high LTVs.',
    // hideInMarketSwitcher: true,
    marketAltName: 'RWA Stablecoins',
    grpKey: 'ethereum',
    enabledFeatures: {
      staking: false,
      liquiditySwap: true,
      debtSwitch: false,
      incentives: true,
      withdrawAndSwitch: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero', 'usdc'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xe3c3c5ead58fc2bed4e577e38985b8f7f1ddff00',
      LENDING_POOL: '0xD3a4DA66EC15a001466F324FA08037f3272BDbE8',
      WETH_GATEWAY: '0x2787c0cb2F20010Ae2814Da9Ef20E04bb64B2466',
      WALLET_BALANCE_PROVIDER: '0xa1e6BcDab01B9d7De83647d1Bbd4113c6c2B4e0d',
      COLLECTOR: '0x4e88e72bd81c7ea394cb410296d99987c3a242fe',
      SWAP_COLLATERAL_ADAPTER: '0x189cfdb4d7a08D926CA209D84a713c4c629645aF',
      DEBT_SWITCH_ADAPTER: '0x80Ce5A187E477663fcFE99A108eefd9FBf0acC18',
      UI_POOL_DATA_PROVIDER: '0xa6EA08D16d47feE408505fda73520EbefC68Ef01',
      UI_INCENTIVE_DATA_PROVIDER: '0x0A1198DDb5247a283F76077Bb1E45e5858ee100b',
      OFT: '0x2Da17fAf782ae884faf7dB2208BBC66b6E085C22',
      VESTING_ADDRESS: '',
      ZERO_ADDRESS: '0x2Da17fAf782ae884faf7dB2208BBC66b6E085C22',
    },
  },
  [CustomMarket.proto_mainnet_lrt_v3]: {
    marketTitle: 'Ethereum LRTs',
    chainId: ChainId.mainnet,
    v3: true,
    disableCharts: false,
    switchToNewUI: false,
    description:
      'The Ethereum LRT Market is a ETH-focused market that allows users to lend/borrow ETH-corelated assets at high LTVs. This market also supports Pendle PT tokens as collateral.',
    marketAltName: 'Ethereum LRTs',
    grpKey: 'ethereum',
    // hideInMarketSwitcher: true,
    enabledFeatures: {
      staking: false,
      liquiditySwap: true,
      debtSwitch: true,
      withdrawAndSwitch: true,
      incentives: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xFD856E1a33225B86f70D686f9280435E3fF75FCF',
      LENDING_POOL: '0x3BC3D34C32cc98bf098D832364Df8A222bBaB4c0',
      WETH_GATEWAY: '0x6eA9d99c6653DF987bDEa11ffcd56DFB4B5d38b4',
      WALLET_BALANCE_PROVIDER: '0xa1e6BcDab01B9d7De83647d1Bbd4113c6c2B4e0d',
      // COLLECTOR: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
      SWAP_COLLATERAL_ADAPTER: '0x189cfdb4d7a08D926CA209D84a713c4c629645aF',
      DEBT_SWITCH_ADAPTER: '0x80Ce5A187E477663fcFE99A108eefd9FBf0acC18',
      UI_POOL_DATA_PROVIDER: '0xa6EA08D16d47feE408505fda73520EbefC68Ef01',
      UI_INCENTIVE_DATA_PROVIDER: '0x0A1198DDb5247a283F76077Bb1E45e5858ee100b',
      OFT: '0x2Da17fAf782ae884faf7dB2208BBC66b6E085C22',
      VESTING_ADDRESS: '',
      ZERO_ADDRESS: '0x2Da17fAf782ae884faf7dB2208BBC66b6E085C22',
    },
  },
  [CustomMarket.proto_zircuit_v3]: {
    marketTitle: 'Zircuit',
    chainId: 48900,
    isAlpha: false,
    v3: true,
    disableCharts: true,
    switchToNewUI: false,
    enabledFeatures: {
      staking: false,
      incentives: true,
      bridge: true,
    },
    whiteListedIncentives: [],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xFF679e5B4178A2f74A56f0e2c0e1FA1C80579385',
      LENDING_POOL: '0x2774C8B95CaB474D0d21943d83b9322Fb1cE9cF5',
      WETH_GATEWAY: '0x6eA9d99c6653DF987bDEa11ffcd56DFB4B5d38b4',
      WALLET_BALANCE_PROVIDER: '0xa1e6BcDab01B9d7De83647d1Bbd4113c6c2B4e0d',
      UI_POOL_DATA_PROVIDER: '0x189cfdb4d7a08D926CA209D84a713c4c629645aF',
      UI_INCENTIVE_DATA_PROVIDER: '0xa6EA08D16d47feE408505fda73520EbefC68Ef01',
      // COLLECTOR: '0x15785C5D383Fa33339CF5D5720546C24313BC66D',
      OFT: '0x458AD5B487F4442245E4C5eA7249009E607A5583',
      ZERO_ADDRESS: '0x458AD5B487F4442245E4C5eA7249009E607A5583',
    },
  },
  [CustomMarket.proto_layerx_v3]: {
    marketTitle: 'X Layer',
    chainId: 196,
    v3: true,
    switchToNewUI: false,
    enabledFeatures: {
      staking: false,
      incentives: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x2f7e54ff5d45f77bFfa11f2aee67bD7621Eb8a93',
      LENDING_POOL: '0xfFd79D05D5dc37E221ed7d3971E75ed5930c6580',
      WETH_GATEWAY: '0x0f9bfa294bE6e3CA8c39221Bb5DFB88032C8936E',
      WALLET_BALANCE_PROVIDER: '0xaa999eA356F925BF1e856038c5D182Ae5E8A4973',
      UI_POOL_DATA_PROVIDER: '0xFaDFb0BC400427663020887e7c8073D03A35dc3c',
      UI_INCENTIVE_DATA_PROVIDER: '0x33B13F46a25D836CC0ce91B370305902aB6CF1Be',
      // COLLECTOR: '0x15785C5D383Fa33339CF5D5720546C24313BC66D',
      OFT: '0x98D56d03be3C0B9C58C67b209cA557d7DA9eb611',
      ZERO_ADDRESS: '0x98D56d03be3C0B9C58C67b209cA557d7DA9eb611',
    },
  },

  [CustomMarket.proto_linea_croak_v3]: {
    //linea actual market
    marketTitle: 'Croak',
    marketAltName: 'Croak Market',
    grpKey: 'linea',
    description:
      'The CROAK Market is an experimental isolated market designed to support the CROAK community. It allows users to lend/borrow CROAK with stablecoins and other assets.',
    hideInMarketSwitcher: true,
    switchToNewUI: false,
    chainId: 59144,
    v3: true,
    show1DBorrowAPR: true,
    enabledFeatures: {
      staking: false,
      incentives: true,
    },
    disableCharts: false,
    whiteListedIncentives: ['croak'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xf38B16FA3FC809d40F568BFe5B092AD9Ef4E15ed',
      LENDING_POOL: '0xc6ff96AefD1cC757d56e1E8Dcc4633dD7AA5222D',
      WETH_GATEWAY: '0x60F97315200815DbdD003fAC19E94E68CaCB6230',
      WALLET_BALANCE_PROVIDER: '0xE1a4e28fF7515E8eC7CaDa5fCf583cd47698e826',
      UI_POOL_DATA_PROVIDER: '0x19dD9E60198D1a1b2f531005592222ed8DfdD826',
      UI_INCENTIVE_DATA_PROVIDER: '0xBbb913D8adaE54E34dA336EA5218432001292df2',
      // COLLECTOR: '0xbBe092a8cF3bFA489F933Ce69eA138CA1EEA2bbF',
      ZERO_ADDRESS: '0x78354f8DcCB269a615A7e0a24f9B0718FDC3C7A7',
    },
  },
  [CustomMarket.proto_linea_foxy_v3]: {
    marketTitle: 'Foxy',
    marketAltName: 'Foxy Market',
    grpKey: 'linea',
    switchToNewUI: false,
    description:
      'The FOXY Market is an experimental isolated market designed to support the FOXY community. It allows users to lend/borrow FOXY with stablecoins and other assets.',
    hideInMarketSwitcher: true,
    chainId: 59144,
    v3: true,
    enabledFeatures: {
      staking: false,
      incentives: true,
    },
    disableCharts: false,
    show1DBorrowAPR: true,
    whiteListedIncentives: [],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xaF9aB0C286a36A430C9bB7C58Ebf0BF075DDE595',
      LENDING_POOL: '0xbDAa004A456E7f2dAff00FfcDCbEaD5da27B7966',
      WETH_GATEWAY: '0x405BDA48cAB999865688eB1F5129C29a9cB0cDe1',
      WALLET_BALANCE_PROVIDER: '0xA770AF819A74BDB8a00e6C2aE19c4e434D276752',
      UI_POOL_DATA_PROVIDER: '0xa160571E7074EaC9652c0289C2969942Fc5CcA45',
      UI_INCENTIVE_DATA_PROVIDER: '0xbbe9548C50Db58cBEd8EbC2343fba02d3F8A5Af8',
      // COLLECTOR: '0x14aAD4668de2115e30A5FeeE42CFa436899CCD8A',
      ZERO_ADDRESS: '0x78354f8DcCB269a615A7e0a24f9B0718FDC3C7A7',
    },
  },
  [CustomMarket.proto_blast_v3]: {
    marketTitle: 'Blast',
    chainId: 81457,
    v3: true,
    switchToNewUI: false,
    enabledFeatures: {
      staking: false,
      incentives: true,
      // switch: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xb0811a1FC9Fb9972ee683Ba04c32Cb828Bcf587B',
      LENDING_POOL: '0xa70B0F3C2470AbBE104BdB3F3aaa9C7C54BEA7A8',
      WETH_GATEWAY: '0xFaDFb0BC400427663020887e7c8073D03A35dc3c',
      WALLET_BALANCE_PROVIDER: '0x4Fcb7F18FA9255B52793dfd865d245bcec871468',
      UI_POOL_DATA_PROVIDER: '0xE230cF9Cee7b299F69778EF950A61de0dE520ba7',
      UI_INCENTIVE_DATA_PROVIDER: '0x66f3015534fae808773422e32b74f5732668dD5b',
      EARLYZERO_ADDRESS: '0x81b3184A3B5d4612F2c26A53Da8D99474B91B2D2',
      // COLLECTOR: '0x9698FdF843cbe4531610aC231B0047d9FFc13bC6',
      VESTING_ADDRESS: '',
      OFT: '0x6195FDA19376d2A3B3F7ED552247272308c644Dd',
      ZERO_ADDRESS: '0x6195FDA19376d2A3B3F7ED552247272308c644Dd',
    },
  },

  [CustomMarket.proto_zksync_era_v3]: {
    marketTitle: 'zkSync',
    chainId: 324,
    v3: true,
    disableCharts: false,
    enabledFeatures: {
      paymasters: true,
      staking: false,
      incentives: true,
      isGasless: true,
      debtSwitch: true,
      switch: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero', 'weth', 'zk', 'm-btc', 'usdc.e'],
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x4f285Ea117eF0067B59853D6d16a5dE8088bA259',
      LENDING_POOL: '0x4d9429246EA989C9CeE203B43F6d1C7D83e3B8F8',
      WETH_GATEWAY: '0x767b4A087c11d7581Ac95eaFfc1FeBFA26bad3d2',
      PAYMASTER: '0x03173eFe71e4201FDb439e716C801E41A239d58c',
      WALLET_BALANCE_PROVIDER: '0xdeEa10da04D867e3303AB6E50FA26C2d8a5e9f70',
      UI_POOL_DATA_PROVIDER: '0x8FE0ac76b634B7D343Bd32282B98E9f271B43367',
      UI_INCENTIVE_DATA_PROVIDER: '0x91ccF57c1E9A7F5A9537eE59306faF8dA3b7e960',

      GHO_TOKEN_ADDRESS: '0x90059C32Eeeb1A2aa1351a58860d98855f3655aD',
      GHO_UI_DATA_PROVIDER: '0x3d65cEDCb8Bbf19b477e5FF09057567F3B052b1f',

      // EARLYZERO_ADDRESS: '0x9793eac2fECef55248efA039BEC78e82aC01CB2f',
      // OFT: '0x27d0A2b5316b98088294378692F4EAbfB3222e36',
      VESTING_ADDRESS: '',
      ZERO_ADDRESS: '0x27d0A2b5316b98088294378692F4EAbfB3222e36',
    },
    // halIntegration: {
    //   URL: 'https://app.hal.xyz/recipes/aave-v3-track-health-factor',
    //   marketName: 'aavev3',
    // },
  },
  [CustomMarket.proto_manta_v3]: {
    marketTitle: 'Manta',
    chainId: 169,
    switchToNewUI: false,
    v3: true,
    disableCharts: false,
    enabledFeatures: {
      governance: true,
      staking: true,
      liquiditySwap: true,
      collateralRepay: true,
      incentives: true,
      withdrawAndSwitch: true,
      debtSwitch: true,
      switch: true,
      bridge: true,
    },
    whiteListedIncentives: ['zero'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xC44827C51d00381ed4C52646aeAB45b455d200eB',
      LENDING_POOL: '0x2f9bB73a8e98793e26Cb2F6C4ad037BDf1C6B269',
      WETH_GATEWAY: '0xE05361EA51E20118072aec0fB0FD178e8b09D69e',
      WALLET_BALANCE_PROVIDER: '0xCbDc0aeD7CDf2472784068abEf23a902CafABb98',
      UI_POOL_DATA_PROVIDER: '0xa32Eb787F2A3DC1F2c2da0E5d8caE7Ff74E6fD32',
      UI_INCENTIVE_DATA_PROVIDER: '0x81b3184A3B5d4612F2c26A53Da8D99474B91B2D2',
      EARLYZERO_ADDRESS: '0x642ce49f36f74fcc430ff79a76eb984737a7672d',
      // COLLECTOR: '0x97e59722318F1324008484ACA9C343863792cBf6',
      VESTING_ADDRESS: '',
      OFT: '0xFCCa0098e740CE6D87e372717B210f5e2c27159D',
      ZERO_ADDRESS: '0xFCCa0098e740CE6D87e372717B210f5e2c27159D',
    },
  },
  /*[CustomMarket.proto_linea_sepolia_v3]: {
    marketTitle: 'Linea Sepolia',
    chainId: 168587773,
    v3: true,
    switchToNewUI: true,
    disableCharts: true,
    enabledFeatures: {
      staking: false,
      incentives: true,
    },
    whiteListedIncentives: ['zero'],
    // subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xa9eE3E04F102c6ba1A6468d641094A0BB83d6D2c',
      LENDING_POOL: '0x2B6106B5e7b01042f9039f75CEeEAEca69Fc0ab7',
      WETH_GATEWAY: '0xe165750b9882E9AF6A76082996392d0592A5CF16',
      WALLET_BALANCE_PROVIDER: '0xA79641b126194929C9c959794A24A77913D3502C',
      UI_POOL_DATA_PROVIDER: '0x7cf23595BA89D309983B9dDbe617B3892DF24a9A',
      UI_INCENTIVE_DATA_PROVIDER: '0x8a209c303FebE28569404C1435f282543fE65c0D',
      STAKING_BONUS: '0xe5ccA68b9E1D5575B7e3062fA34B0C725B003a69',
      OMNI_STAKING: '0xC35022eCbb36D81b9c92AD13f8e2D417e7F7a1C3',
      LOCKER_TOKEN: '0x1Fe7E6Cc96f9DA66b803E9573c083427b13C4370',
      LOCKER_LP: '0x6850E5D5396e4ce3CB6919E790b8Fce2Ebdf49eC',
      EARLYZERO_ADDRESS: '0x0082f3184a0b36c957F38f19fBdD3570ad9F095f',
      EARLY_ZERO_VESTING: '0xaBeD86D5eEe2Bf39A7d389B95bd4b92aAE24D04D',
      ZERO_ADDRESS: '0xA386758Dfb9B695c8C21245f61Fb71c38d045169',
      VESTING_ADDRESS: '0x1Ac68a3141745AA3c835fA518d2bAf70fDCE9F4B',
      POOL_VOTER: '0x8bf50096aA1ddBc7930d726F9d3a67EA138F010A',
      ZERO_AIRDROP: '0x56b83bc8886274DC0bE2273FbBc985710099D5C4',
    },
  },*/
  /*[CustomMarket.proto_barito_v3]: {
    marketTitle: 'Berachain Bartio',
    chainId: 80084,
    v3: true,
    isAlpha: true,
    bg: '/bear.jpg',
    disableCharts: true,
    switchToNewUI: true,
    enabledFeatures: {
      staking: false,
      incentives: true,
    },
    whiteListedIncentives: ['zero'],
    // subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x3fC90e521397b251D4aAA1FBeAC7cc32f25E78fa',
      FAUCET: '0x59423CCeB710266520dB98034ff62dD1E2090E10',
      LENDING_POOL: '0x431B8680f2BbDEB51ee366C51Db3aC60d58a3789',
      WETH_GATEWAY: '0xCbDc0aeD7CDf2472784068abEf23a902CafABb98',
      WALLET_BALANCE_PROVIDER: '0x81b3184A3B5d4612F2c26A53Da8D99474B91B2D2',
      UI_POOL_DATA_PROVIDER: '0x65fc5280E838751eDafB6f171391FE0AC5C1d05a',
      UI_INCENTIVE_DATA_PROVIDER: '0xa32Eb787F2A3DC1F2c2da0E5d8caE7Ff74E6fD32',
    },
  },*/
} as const;

export const MARKET_IDS: any = {
  proto_mainnet_lrt_v3: 'mainnet',
  proto_linea_v3: 'linea',
  proto_mainnet_btc_v3: 'mainnet_btc',
  proto_linea_croak_v3: 'linea_croak',
  proto_linea_foxy_v3: 'linea_foxy',
  proto_layerx_v3: 'xlayer',
  proto_blast_v3: 'blast',
  proto_zksync_era_v3: 'zksync',
  proto_manta_v3: 'manta',
  proto_base_v3: 'base',
  proto_mainnet_rwa_v3: 'mainnet_rwa',
};
