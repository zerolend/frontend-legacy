import { unPrefixSymbol } from 'src/hooks/app-data-provider/useAppDataProvider';

/**
 * Maps onchain symbols to different symbols.
 * This is useful when you want to explode symbols via _ to render multiple symbols or when the symbol has a bridge prefix or suffix.
 */
export const SYMBOL_MAP: { [key: string]: string } = {
  BPTBALWETH: 'BPT_BAL_WETH',
  BPTWBTCWETH: 'BPT_WBTC_WETH',
  UNIAAVEWETH: 'UNI_AAVE_WETH',
  UNIBATWETH: 'UNI_BAT_WETH',
  UNICRVWETH: 'UNI_CRV_WETH',
  UNIDAIUSDC: 'UNI_DAI_USDC',
  UNIDAIWETH: 'UNI_DAI_WETH',
  UNILINKWETH: 'UNI_LINK_WETH',
  UNIMKRWETH: 'UNI_MKR_WETH',
  UNIRENWETH: 'UNI_REN_WETH',
  UNISNXWETH: 'UNI_SNX_WETH',
  UNIUNIWETH: 'UNI_UNI_WETH',
  UNIUSDCWETH: 'UNI_USDC_WETH',
  UNIWBTCUSDC: 'UNI_WBTC_USDC',
  UNIWBTCWETH: 'UNI_WBTC_WETH',
  UNIYFIWETH: 'UNI_YFI_WETH',
  'vAMM-USDC/AERO': 'VAMM_AERO_USDC',
  sUSDZUSDC: 'VAMM_USDZ_USDC',
  'KS-LP USDC-USDT': 'KNC_USDC_USDT',
  fUSDT: 'USDT',
  // harmony
  '1DAI': 'DAI',
  '1USDC': 'USDC',
  '1USDT': 'USDT',
  '1AAVE': 'AAVE',
  '1ETH': 'ETH',
  '1WBTC': 'WBTC',
  // avalanche
  'DAI.e': 'DAI',
  'LINK.e': 'LINK',
  'WBTC.e': 'WBTC',
  'WETH.e': 'WETH',
  'AAVE.e': 'AAVE',
  'USDT.e': 'USDT',
  'USDC.e': 'USDC',
  'BTC.b': 'BTC',
  // polygon
  miMATIC: 'MAI',
  // metis
  'm.USDC': 'USDC',
  'm.USDT': 'USDT',
  'm.DAI': 'DAI',
  //linea
  NYLEETHZERO: 'NYLE_ETH_ZERO',
};

/**
 * Maps (potentially altered via SYMBOL_MAP) symbols to a name
 * With the next version of uipooldataprovider https://github.com/aave/aave-v3-periphery/pull/89 this list can be greatly reduced/removed.
 */
export const SYMBOL_NAME_MAP: { [key: string]: string } = {
  '1INCH': '1inch Network',
  'PT-CORNLBTC-26DEC2024': 'LBTC PT 26DEC24',
  'PT-EBTC-26DEC2024': 'eBTC PT 26DEC24',
  'PT-EZETH-26DEC2024': 'ezETH PT 26DEC24',
  'PT-CORN-EBTC-27MAR2025': 'eBTC PT 27MAR25',
  'PT-LBTC-27MAR2025': 'LBTC PT 27MAR25',
  WSTETH: 'Lido stETH',
  'PT-USD0++-31OCT2024': 'USD0++ PT 31OCT24',
  'PT-USD0++-27MAR2025': 'USD0++ PT 27MAR25',
  AVAX: 'Avalanche',
  CBBTC: 'Coinbase BTC',
  CBETH: 'Coinbase ETH',
  ETH: 'Ethereum',
  ZK: 'zkSync',
  EUROS: 'STASIS EURO',
  EZETH: 'Renzo ezETH',
  FAI: 'Fei USD',
  GHST: 'Aavegotchi GHST',
  GRAI: 'Gravita',
  GUSD: 'Gemini Dollar',
  SNECT: 'Staked NECTAR',
  KNC_USDC_USDT: 'Kyberswap USDT/USDT',
  KDK: 'Kodiak',
  POLLEN: 'Pollen',
  YEET: 'YEET',
  KNC: 'Kyber Legacy',
  STKGHO: 'GHO (Staked)',
  LBTC: 'Lombard LBTC',
  LINK: 'ChainLink',
  LUSD: 'LUSD Stablecoin',
  MAI: 'MAI',
  MANA: 'Decentraland',
  MKR: 'Maker',
  PAX: 'Paxos Standard',
  PUFETH: 'Puffer.fi ETH',
  PZETH: 'Renzo pzETH',
  RAI: 'Rai Reflex Index',
  REP: 'Augur',
  RSETH: 'Kelp rsETH',
  SAVAX: 'Benqi Staked Avalanche',
  STETH: 'Lido Staked Ether',
  STKAAVE: 'Stake ZeroLend',
  TUSD: 'TrueUSD',
  UNI: 'Uniswap',
  UNIDAIWETH: 'UNI DAI/WETH',
  UNIWBTCUSDC: 'UNI WBTC/USDC',
  USDT: 'Tether',
  WSUPEROETHB: 'Super OETH (Wrapped)',
  XUSDZ: 'ZAI Stablecoin',
  USDZ: 'USDz Anzen',
  WAVAX: 'Wrapped Avalanche',
  WBTC: 'Wrapped BTC',
  WEETH: 'Etherfi weETH',
  WETH: 'Wrapped ETH',
  WFTM: 'Wrapped FTM',
  WMATIC: 'Wrapped Matic',
  WEETHS: 'Symbiotic weETHs',
  WONE: 'Wrapped ONE',
  WRSETH: 'Kelp wrsETH',
  YFI: 'yearn.finance',
  ZRX: '0x Coin',
};

export interface IconSymbolInterface {
  underlyingAsset: string;
  symbol: string;
  name?: string;
}

interface IconMapInterface {
  iconSymbol: string;
  name?: string;
  symbol?: string;
}

export function fetchIconSymbolAndName({ underlyingAsset, symbol, name }: IconSymbolInterface) {
  const underlyingAssetMap: Record<string, IconMapInterface> = {
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': {
      name: 'Bridged USDC',
      symbol: 'USDC.e',
      iconSymbol: 'USDC',
    },
    '0xdf0b24095e15044538866576754f3c964e902ee6': {
      name: 'Bridged USDC',
      symbol: 'USDC.e',
      iconSymbol: 'USDC',
    },
    '0x386e7a3a0c0919c9d53c3b04ff67e73ff9e45fb6': {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTCN',
      iconSymbol: 'WBTCN',
    },
    '0x69000405f9dce69bd4cbf4f2865b79144a69bfe0': {
      name: 'ZAI (Depreciated)',
      symbol: 'USDz',
      iconSymbol: 'ZAI',
    },
    '0x4bcc7c793534246bc18acd3737aa4897ff23b458': {
      name: 'Eigenpie egETH',
      symbol: 'egETH',
      iconSymbol: 'egETH',
    },
    '0x1c1fb35334290b5ff1bf7b4c09130885b10fc0f4': {
      name: 'Eigenpie mstETH',
      symbol: 'mstETH',
      iconSymbol: 'mstETH',
    },
    '0x3b952c8c9c44e8fe201e2b26f6b2200203214cff': {
      name: 'USDC',
      symbol: 'USDC.e',
      iconSymbol: 'USDC',
    },
    '0xd077abe1663166c0920d41fd37ea2d9a00fabd40': {
      name: 'ZAI (Depreciated)',
      symbol: 'xUSDz',
      iconSymbol: 'xUSDz',
    },
    '0x0a27e060c0406f8ab7b64e3bee036a37e5a62853': {
      name: 'ZAI (Depreciated)',
      symbol: 'xUSDz',
      iconSymbol: 'xUSDz',
    },
    '0x5d83c0850570de35eaf5c9d6215bf2e8020f656b': {
      iconSymbol: 'KNC_USDC_USDT',
      name: 'Kyberswap USDC/USDT',
    },
    '0x6cdcb1c4a4d1c3c6d054b27ac5b77e89eafb971d': {
      iconSymbol: 'VAMM_AERO_USDC',
      name: 'USDC/AERO LP (Aerodrome)',
    },
    '0x1097dfe9539350cb466df9ca89a5e61195a520b0': {
      iconSymbol: 'VAMM_XUSDZ_USDC',
      name: 'xUSDz/USDC Staked LP (MAHA.xyz)',
    },
    '0x97e59722318f1324008484aca9c343863792cbf6': {
      iconSymbol: 'HAMM_HONEY_USDC',
      name: 'HONEY/USDC LP',
    },
    '0xa693B19d2931d498c5B318dF961919BB4aee87a5': { iconSymbol: 'UST', name: 'UST (Wormhole)' },
    '0x59a19d8c652fa0284f44113d0ff9aba70bd46fb4': { iconSymbol: 'BPT_BAL_WETH' },
    '0x1eff8af5d577060ba4ac8a29a13525bb0ee2a3d5': { iconSymbol: 'BPT_WBTC_WETH' },
    '0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f': { iconSymbol: 'UNI_AAVE_WETH' },
    '0xb6909b960dbbe7392d405429eb2b3649752b4838': { iconSymbol: 'UNI_BAT_WETH' },
    '0x3da1313ae46132a397d90d95b1424a9a7e3e0fce': { iconSymbol: 'UNI_CRV_WETH' },
    '0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5': { iconSymbol: 'UNI_DAI_USDC' },
    '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11': { iconSymbol: 'UNI_DAI_WETH' },
    '0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974': { iconSymbol: 'UNI_LINK_WETH' },
    '0xc2adda861f89bbb333c90c492cb837741916a225': { iconSymbol: 'UNI_MKR_WETH' },
    '0x8bd1661da98ebdd3bd080f0be4e6d9be8ce9858c': { iconSymbol: 'UNI_REN_WETH' },
    '0x43ae24960e5534731fc831386c07755a2dc33d47': { iconSymbol: 'UNI_SNX_WETH' },
    '0xd3d2e2692501a5c9ca623199d38826e513033a17': { iconSymbol: 'UNI_UNI_WETH' },
    '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc': { iconSymbol: 'UNI_USDC_WETH' },
    '0x004375dff511095cc5a197a54140a24efef3a416': { iconSymbol: 'UNI_BTC_USDC' },
    '0xbb2b8038a1640196fbe3e38816f3e67cba72d940': { iconSymbol: 'UNI_WBTC_WETH' },
    '0x2fdbadf3c4d5a8666bc06645b8358ab803996e28': { iconSymbol: 'UNI_YFI_WETH' },
    '0x0040F36784dDA0821E74BA67f86E084D70d67a3A': { iconSymbol: 'ETH_ZERO' },
  };

  const lowerUnderlyingAsset = underlyingAsset.toLowerCase();
  if (underlyingAssetMap.hasOwnProperty(lowerUnderlyingAsset)) {
    return {
      symbol,
      ...underlyingAssetMap[lowerUnderlyingAsset],
    };
  }

  const unifiedSymbol = unPrefixSymbol((SYMBOL_MAP[symbol] || symbol).toUpperCase(), 'AMM');
  return {
    iconSymbol: unifiedSymbol,
    name: SYMBOL_NAME_MAP[unifiedSymbol.toUpperCase()] || name || unifiedSymbol,
    symbol,
  };
}

// tokens flagged stable will be sorted on top when no other sorting is selected
export const STABLE_ASSETS = [
  'DAI',
  'TUSD',
  'BUSD',
  'GUSD',
  'USDC',
  'USDT',
  'EUROS',
  'FEI',
  'FRAX',
  'PAX',
  'USDP',
  'SUSD',
  'UST',
  'EURS',
  'JEUR',
  'AGEUR',
  'LUSD',
  'MAI',
];
