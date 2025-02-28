import { Trans } from '@lingui/macro';
// import { Link } from '../primitives/Link';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const ZBlastGoldPoints = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        Blast Gold Points that protocol received from BLAST to developers. 100% of all Blast Gold
        will be distributed back to borrowers.{' '}
        {/* <Link
          href=""
          sx={{ textDecoration: 'underline' }}
          variant="caption"
          color="text.secondary"
        >
          Learn more
        </Link> */}
      </Trans>
    </TextWithTooltip>
  );
};
