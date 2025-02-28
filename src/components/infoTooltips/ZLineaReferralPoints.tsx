import { Trans } from '@lingui/macro';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const ZLineaReferralPoints = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        This is the Linea LXP-L earned by ZeroLend from referring users onto Linea&apos;s LXP-L
        campaign using ZeroLend&apos;s referral link. 60% of all LXP-L points will go to LPs &
        borrowers and 40% will go towards ZERO stakers. These points will be calculated and
        distributed by the ZeroLend team.
      </Trans>
    </TextWithTooltip>
  );
};
