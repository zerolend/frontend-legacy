import { Trans } from '@lingui/macro';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const UsersZLineaPoints = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        How much points you have earned from supplying liquidity onto ZeroLend. Data is fetched
        directly from Openblocks. The more assets you supply, the more points you earn.
      </Trans>
    </TextWithTooltip>
  );
};
