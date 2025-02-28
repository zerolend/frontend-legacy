import { Trans } from '@lingui/macro';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const UserZBlastPoints = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        Blast Points are points that the protocol receives from BLAST for holding liquidity. 100% of
        all Blast Points will be distributed back to liquidity providers.{' '}
      </Trans>
    </TextWithTooltip>
  );
};
