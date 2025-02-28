export type ImpliedAprsConfigProps = {
  toolTip: React.ReactNode;
};

const pendleDescription = (symbol: string) => (
  <span>
    The fixed APR is determined by the amount of {symbol} tokens, this PT token will be redeemable at the time of maturity. <br /><br />
    To learn more about how PT tokens work, please visit the <a href="https://docs.pendle.finance/ProtocolMechanics/YieldTokenization/PT" target="_blank" rel="noreferrer">Pendle Docs</a>.
    <br /><br />
    Leveraging on PT tokens when the fixed APR is high or when borrow APY is low will allow you to maximize your yield.
  </span>
);


const lrtDescription = () => (
  <span>
    This APR is the native restaking APR that comes from the underlying protocol. Stake your ETH to realize this yield.
  </span>
);


const lrtTemplate = (symbol: string) => ({
  [symbol]: {
    toolTip: lrtDescription(),
  },
})


export const ImpliedAprsConfig: { [key: number]: { [key: string]: ImpliedAprsConfigProps } } = {
  1: {
    'PT-EBTC-26DEC2024': {
      toolTip: pendleDescription('eBTC'),
    },
    // 'PT-USD0++-31OCT2024': {
    //   toolTip: pendleDescription('USD0'),
    // },
    'PT-USD0++-27MAR2025': {
      toolTip: pendleDescription('USD0'),
    },
    'PT-cornLBTC-26DEC2024': {
      toolTip: pendleDescription('LBTC'),
    },
    'PT-rsETH-26SEP2024': {
      toolTip: pendleDescription('rsETH'),
    },
    ...lrtTemplate('rsETH'),
    ...lrtTemplate('pufETH'),
    ...lrtTemplate('pzETH'),
    ...lrtTemplate('weETH'),
    ...lrtTemplate('ezETH')
  },
  59144: {
    ...lrtTemplate('wrsETH'),
    ...lrtTemplate('ezETH')
  }
};
