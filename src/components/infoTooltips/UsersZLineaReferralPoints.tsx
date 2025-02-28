import { Trans } from '@lingui/macro';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const UsersZLineaReferralPoints = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        How much points you have earned from ZeroLend&apos;s referral code. Referral points that
        ZeroLend earns, will be distributed to users who supply/borrow liquidity or to those who
        stake ZERO. These points will be calculated and distributed by the ZeroLend team.
      </Trans>
    </TextWithTooltip>
  );
};
