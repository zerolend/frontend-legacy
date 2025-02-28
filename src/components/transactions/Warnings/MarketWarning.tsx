import { Trans } from '@lingui/macro';
import { Link, Typography } from '@mui/material';

import { Warning } from '../../primitives/Warning';

const WarningMessage = ({ market }: { market: string }) => {
  if (market === 'Harmony') {
    return (
      <Trans>
        Due to the Horizon bridge exploit, certain assets on the Harmony network are not at parity
        with Ethereum, which affects the ZeroLend V3 Harmony market.
      </Trans>
    );
  } else if (market === 'Fantom') {
    return <Trans>Per the community, the Fantom market has been frozen.</Trans>;
  } else if (market === 'Ethereum AMM') {
    return <Trans>Per the community, the V2 AMM market has been deprecated.</Trans>;
  } else {
    return null;
  }
};

interface MarketWarningProps {
  marketName: string;
  forum?: boolean;
}

export const PolygonWarning = () => {
  return (
    <Warning severity="error">
      <Typography variant="caption">
        <Trans>
          Update: Disruptions reported for WETH, WBTC, WMATIC, and USDT. AIP 230 will resolve the
          disruptions and the market will be operating as normal on ~26th May 13h00 UTC.{' '}
        </Trans>
        <Link href="https://discord.gg/zerolend" underline="always">
          <Trans>Learn more</Trans>
        </Link>
      </Typography>
    </Warning>
  );
};

export const MarketWarning = ({ marketName }: MarketWarningProps) => {
  return (
    <Warning severity="error">
      <Typography variant="caption">
        <WarningMessage market={marketName} />{' '}
        <Link href="https://discord.gg/zerolend" underline="always">
          <Trans>Learn more</Trans>
        </Link>
      </Typography>
    </Warning>
  );
};
