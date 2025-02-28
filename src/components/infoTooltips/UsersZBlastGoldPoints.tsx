import { Trans } from '@lingui/macro';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const UserZBlastGoldPoints = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        Blast Gold Points are points that the protocol receives from BLAST for holding liquidity.
        100% of all Blast Gold Points will be distributed back to liquidity providers.{' '}
      </Trans>
    </TextWithTooltip>
  );
};
