import { Trans } from '@lingui/macro';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const TXPLineaPoints = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        These are total Linea XP points that protocol has accumulated. Linea XP points allows users
        to become eligible for a potential Linea airdrop.
      </Trans>
    </TextWithTooltip>
  );
};
