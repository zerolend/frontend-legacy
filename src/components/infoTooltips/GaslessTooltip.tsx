import { Trans } from '@lingui/macro';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const GaslessTooltip = ({ ...rest }: TextWithTooltipProps) => {
  //ToDo: add content here for gas less tx;
  return (
    <TextWithTooltip
      event={{
        eventName: GENERAL.TOOL_TIP,
        eventParams: { tooltip: 'Gas-less Calc' },
      }}
      {...rest}
    >
      <Trans>You wont be charged any gas fees.</Trans>
    </TextWithTooltip>
  );
};
