import { ExclamationIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, SvgIcon } from '@mui/material';

import { frozenProposalMap } from '../../utils/marketsAndNetworksConfig';
import { ContentWithTooltip } from '../ContentWithTooltip';
import { Link } from '../primitives/Link';

interface FrozenTooltipProps {
  symbol?: string;
  currentMarket?: string;
}

export const getFrozenProposalLink = (
  symbol: string | undefined,
  currentMarket: string | undefined
): string => {
  if (currentMarket && currentMarket === 'proto_harmony_v3') {
    return 'https://discord.gg/zerolend';
  } else if (currentMarket && currentMarket === 'proto_fantom_v3') {
    return 'https://discord.gg/zerolend';
  } else if (symbol && frozenProposalMap[symbol.toUpperCase() + currentMarket]) {
    return frozenProposalMap[symbol.toUpperCase() + currentMarket];
  } else {
    return 'https://discord.gg/zerolend';
  }
};

export const FrozenTooltip = ({ symbol, currentMarket }: FrozenTooltipProps) => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <Box>
          <Trans>
            This asset is frozen due to an ZeroLend Protocol Governance decision.
            <Link
              href={getFrozenProposalLink(symbol, currentMarket)}
              sx={{ textDecoration: 'underline' }}
            >
              <Trans>More details</Trans>
            </Link>
          </Trans>
        </Box>
      }
    >
      <SvgIcon sx={{ fontSize: '20px', color: 'error.main', ml: 2 }}>
        <ExclamationIcon />
      </SvgIcon>
    </ContentWithTooltip>
  );
};
