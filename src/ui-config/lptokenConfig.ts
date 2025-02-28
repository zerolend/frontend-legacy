export const lptokensDetails: { [key: string]: { liquidityPoolLink: string } } = {
  KNC_USDC_USDT: {
    liquidityPoolLink:
      'https://kyberswap.com/zksync/add/0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4/0x493257fD37EDB34451f62EDf8D2a0C418852bA4C/0x4d321cd88c5680ce4f85bb58c578dfe9c2cc1ef6',
  },

  VAMM_AERO_USDC: {
    liquidityPoolLink:
      'https://aerodrome.finance/deposit?token0=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&token1=0x940181a94A35A4569E4529A3CDfB74e38FD98631&type=-1',
  },

  VAMM_USDZ_USDC: {
    liquidityPoolLink:
      'https://app.maha.xyz/earn/pool/8453/0x1097dFe9539350cb466dF9CA89A5e61195A520B0/',
  },

  NYLE_ETH_ZERO: {
    liquidityPoolLink:
      'https://www.nile.build/manage/v1/0x0040f36784dda0821e74ba67f86e084d70d67a3a',
  },
};

export function isLpToken(symbol: string): boolean {
  return !!lptokensDetails[symbol];
}
