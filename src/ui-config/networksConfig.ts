export type ExplorerLinkBuilderProps = {
  tx?: string;
  address?: string;
};

export type ExplorerLinkBuilderConfig = {
  baseUrl: string;
  addressPrefix?: string;
  txPrefix?: string;
};

export type NetworkConfig = {
  name: string;
  privateJsonRPCUrl?: string; // private rpc will be used for rpc queries inside the client. normally has private api key and better rate
  privateJsonRPCWSUrl?: string;
  publicJsonRPCUrl: readonly string[]; // public rpc used if not private found, and used to add specific network to wallets if user don't have them. Normally with slow rates
  publicJsonRPCWSUrl?: string;
  // protocolDataUrl: string;
  // https://github.com/aave/aave-api
  ratesHistoryApiUrl?: string;
  // cachingServerUrl?: string;
  // cachingWSServerUrl?: string;
  baseUniswapAdapter?: string;
  /**
   * When this is set withdrawals will automatically be unwrapped
   */
  wrappedBaseAssetSymbol?: string;
  baseAssetSymbol: string;
  // needed for configuring the chain on metemask when it doesn't exist yet
  baseAssetDecimals: number;
  // usdMarket?: boolean;
  // function returning a link to etherscan et al
  explorerLink: string;
  explorerLinkBuilder: (props: ExplorerLinkBuilderProps) => string;
  // set this to show faucets and similar
  isTestnet?: boolean;
  // get's automatically populated on fork networks
  isFork?: boolean;
  networkLogoPath: string;
  // contains the forked off chainId
  underlyingChainId?: number;
  bridge?: {
    icon: string;
    name: string;
    url: string;
    oftAdapter?: boolean;
  };
};

export type BaseNetworkConfig = Omit<NetworkConfig, 'explorerLinkBuilder'>;

export const networkConfigs: Record<string, BaseNetworkConfig> = {
  [1]: {
    name: 'Ethereum',
    // privateJsonRPCUrl: 'https://eth-mainnet.rpc.grove.city/v1/62b3314e123e6f00397f19ca',
    publicJsonRPCUrl: [
      'https://rpc.ankr.com/eth',
      'https://rpc.flashbots.net',
      'https://eth-mainnet.public.blastapi.io',
      'https://cloudflare-eth.com/v1/mainnet',
    ],
    // isTestnet: true,
    // publicJsonRPCWSUrl: 'wss://eth-mainnet.alchemyapi.io/v2/demo',
    // cachingServerUrl: 'https://cache-api-1.aave.com/graphql',
    // cachingWSServerUrl: 'wss://cache-api-1.aave.com/graphql',
    // protocolDataUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
    baseUniswapAdapter: '0xc3efa200a60883a96ffe3d5b492b121d6e9a1f3f',
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://etherscan.io',
    // ratesHistoryApiUrl: 'https://aave-api-v2.aave.com/data/rates-history',
    networkLogoPath: '/networks/ethereum.svg',
  },
  [2741]: {
    name: 'Abstract',
    publicJsonRPCUrl: ['https://api.mainnet.abs.xyz'],
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    explorerLink: 'https://abscan.org/',
    baseAssetDecimals: 18,
    networkLogoPath: '/networks/2741.svg',
    // bridge: {
    //   icon: '/icons/networks/okb.svg',
    //   name: 'OKX Bridge',
    //   url: 'https://www.okx.com/xlayer/bridge',
    // },
  },
  [21000000]: {
    name: 'Corn',
    publicJsonRPCUrl: ['https://rpc.ankr.com/corn_maizenet'],
    baseAssetSymbol: 'BTCN',
    wrappedBaseAssetSymbol: 'WBTCN',
    explorerLink: 'https://cornscan.io',
    baseAssetDecimals: 18,
    networkLogoPath: '/networks/corn.svg',
    // bridge: {
    //   icon: '/networks/corn.svg',
    //   name: 'Corn Bridge',
    //   url: 'https://www.okx.com/xlayer/bridge',
    // },
  },
  [196]: {
    name: 'X Layer',
    publicJsonRPCUrl: ['https://xlayerrpc.okx.com'],
    baseAssetSymbol: 'OKB',
    wrappedBaseAssetSymbol: 'WOKB',
    explorerLink: 'https://www.okx.com/explorer/xlayer',
    baseAssetDecimals: 18,
    networkLogoPath: '/networks/okb.svg',
    bridge: {
      icon: '/networks/okb.svg',
      name: 'OKX Bridge',
      url: 'https://www.okx.com/xlayer/bridge',
    },
  },
  [48900]: {
    name: 'Zircuit',
    publicJsonRPCUrl: [
      'https://zircuit1-mainnet.p2pify.com/',
      'https://zircuit-mainnet.drpc.org',
      'https://zircuit1-mainnet.liquify.com',
    ],
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    explorerLink: 'https://explorer.zircuit.com/',
    baseAssetDecimals: 18,
    networkLogoPath: '/networks/zircuit.svg',
    bridge: {
      icon: '/networks/zircuit.svg',
      name: 'Zircuit Bridge',
      url: 'https://bridge.zircuit.com/',
    },
  },
  [81457]: {
    name: 'Blast',
    publicJsonRPCUrl: ['https://rpc.blast.io'],
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://blastscan.io',
    networkLogoPath: '/networks/blast.svg',
    bridge: {
      icon: '/networks/blast.svg',
      name: 'Blast Bridge',
      url: 'https://docs.blast.io/building/bridges/mainnet',
    },
  },
  [324]: {
    name: 'zkSync Era',
    publicJsonRPCUrl: ['https://mainnet.era.zksync.io'],
    baseUniswapAdapter: '0x0',
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://era.zksync.network/',
    // usdMarket: true,
    isTestnet: false,
    bridge: {
      icon: '/networks/zksync.svg',
      name: 'zkSync Bridge',
      url: 'https://portal.zksync.io/bridge/',
    },
    networkLogoPath: '/networks/zksync.svg',
  },
  [59144]: {
    name: 'Linea',
    publicJsonRPCUrl: ['https://rpc.linea.build'],
    baseUniswapAdapter: '0x0',
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://lineascan.build',
    networkLogoPath: '/networks/linea.svg',
    bridge: {
      icon: '/networks/linea.svg',
      name: 'Linea Bridge',
      url: 'https://linea.build/apps?types=bridge',
      oftAdapter: true,
    },
  },
  [8453]: {
    name: 'Base',
    publicJsonRPCUrl: ['https://mainnet.base.org'],
    baseUniswapAdapter: '0x0',
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://basescan.org',
    networkLogoPath: '/networks/base.svg',
    bridge: {
      icon: '/networks/base.svg',
      name: 'Base Bridge',
      url: 'https://bridge.base.org/deposit',
      oftAdapter: true,
    },
  },
  [169]: {
    name: 'Manta',
    publicJsonRPCUrl: ['https://pacific-rpc.manta.network/http', 'https://1rpc.io/manta'],
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://pacific-explorer.manta.network',
    networkLogoPath: '/networks/manta.svg',
    bridge: {
      icon: '/networks/manta.svg',
      name: 'Manta Bridge',
      url: 'https://pacific-bridge.manta.network/',
    },
  },
  [11155111]: {
    name: 'Ethereum Sepolia',
    privateJsonRPCUrl: 'https://eth-sepolia.g.alchemy.com/v2/VAfNJrTN-TopQjFDwcdLeeDOLDiFQcBP',
    publicJsonRPCUrl: [
      'https://eth-sepolia.public.blastapi.io',
      'https://rpc.sepolia.org',
      'https://rpc2.sepolia.org',
      'https://rpc.sepolia.online',
      'https://www.sepoliarpc.space',
    ],
    // publicJsonRPCWSUrl: 'wss://eth-goerli.public.blastapi.io',
    // protocolDataUrl: '',
    baseUniswapAdapter: '0x0',
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://sepolia.etherscan.io',
    // usdMarket: true,
    isTestnet: true,
    networkLogoPath: '/networks/ethereum.svg',
  },
  [168587773]: {
    name: 'Blast Sepolia',
    publicJsonRPCUrl: ['https://sepolia.blast.io'],
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    isTestnet: true,
    explorerLink: 'https://testnet.blastscan.io',
    networkLogoPath: '/networks/blast.svg',
    bridge: {
      icon: '/networks/blast.svg',
      name: 'Blast Bridge',
      url: 'https://docs.blast.io/building/bridges/mainnet',
    },
  },
  [280]: {
    name: 'zkSync Goerli',
    publicJsonRPCUrl: ['https://testnet.era.zksync.dev'],
    // publicJsonRPCWSUrl: 'wss://eth-goerli.public.blastapi.io',
    // protocolDataUrl: '',
    baseUniswapAdapter: '0x0',
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://goerli.explorer.zksync.io/',
    isTestnet: true,
    networkLogoPath: '/networks/zksync.svg',
  },
  [11155420]: {
    name: 'Optimism Sepolia',
    publicJsonRPCUrl: ['https://sepolia.optimism.io/'],
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    isTestnet: true,
    explorerLink: 'https://optimism-sepolia.blockscout.com/',
    networkLogoPath: '/networks/optimism.svg',
  },
  [80084]: {
    name: 'Berachain Bartio',
    publicJsonRPCUrl: ['https://bartio.rpc.berachain.com/'],
    baseAssetSymbol: 'BERA',
    wrappedBaseAssetSymbol: 'WBERA',
    baseAssetDecimals: 18,
    // isTestnet: true,
    explorerLink: 'https://bartio.beratrail.io/',
    networkLogoPath: '/networks/berachain.svg',
  },
} as const;

export const MULTICALL_CUSTOM_CONTRACT_ADDRESS: Record<string, string> = {
  [1]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [11155111]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [59144]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [42]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [169]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [168587773]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [81457]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [324]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
  [280]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
};
