import { Trans } from '@lingui/macro';

import { Link } from '../primitives/Link';

export const BUSDOffBoardingWarning = () => {
  return (
    <Trans>
      This asset is planned to be offboarded due to an ZeroLend Protocol Governance decision.{' '}
      <Link href="https://discord.gg/zerolend" underline="always">
        <Trans>Learn more</Trans>
      </Link>
    </Trans>
  );
};
