import { Trans } from '@lingui/macro';
import { GitHub, Twitter } from '@mui/icons-material';
import { Box, styled, SvgIcon, Typography } from '@mui/material';
import { Link } from 'src/components/primitives/Link';

import DiscordIcon from '/public/icons/discord.svg';
import { MirrorsMenu } from './MirrorsMenu';

interface StyledLinkProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const StyledLink = styled(Link)<StyledLinkProps>(({ theme }) => ({
  color: theme.palette.text.muted,
  '&:hover': {
    color: theme.palette.text.primary,
  },
  display: 'flex',
  alignItems: 'center',
}));

const FOOTER_ICONS = [
  {
    href: 'https://twitter.com/zerolendxyz',
    icon: <Twitter />,
    title: 'Twitter',
  },
  {
    href: 'https://discord.gg/zerolend',
    icon: <DiscordIcon />,
    title: 'Discord',
  },
  {
    href: 'https://github.com/zerolend',
    icon: <GitHub />,
    title: 'Github',
  },
];

export function AppFooter() {
  const FOOTER_LINKS = [
    {
      href: 'https://docs.zerolend.xyz/',
      label: <Trans>Docs</Trans>,
      key: 'Docs',
    },
    {
      href: 'https://mirror.xyz/0xb32591b2D8b8129702A4214CE344D2F87A9250F2',
      label: <Trans>Blog</Trans>,
      key: 'Blog',
    },
    {
      href: 'https://github.com/zerolend/',
      label: <Trans>Github</Trans>,
      key: 'Github',
    },
    {
      href: 'https://discord.gg/zerolend',
      label: <Trans>Discord</Trans>,
      key: 'Discord',
    },
    {
      href: 'https://roadmap.zerolend.xyz/feature-requests',
      label: <Trans>Feedback</Trans>,
      key: 'Feedback',
    },
    {
      href: '/terms-of-service',
      label: <Trans>Terms of service</Trans>,
      key: 'ts',
    },
    {
      href: 'https://debank.com/official/ZeroLend',
      label: <Trans>Debank</Trans>,
      key: 'db',
    },
    {
      href: 'https://tokenterminal.com/terminal/studio/dashboards/c52237b9-7e87-43c5-8a95-185b0f385691',
      label: <Trans>Token Terminal</Trans>,
      key: 'tt',
    },
  ];

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        padding: ['22px 0px 40px 0px', '0 22px 0 40px', '20px 22px'],
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '22px',
        flexDirection: ['column', 'column', 'row'],
        boxShadow:
          theme.palette.mode === 'light'
            ? 'inset 0px 1px 0px rgba(0, 0, 0, 0.04)'
            : 'inset 0px 1px 0px rgba(255, 255, 255, 0.12)',
      })}
    >
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {FOOTER_LINKS.map((link) => (
          <StyledLink key={link.key} href={link.href}>
            <Typography variant="caption">{link.label}</Typography>
          </StyledLink>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {FOOTER_ICONS.map((icon) => (
          <StyledLink href={icon.href} key={icon.title}>
            <SvgIcon
              sx={{
                fontSize: [24, 24, 20],
              }}
            >
              {icon.icon}
            </SvgIcon>
          </StyledLink>
        ))}
        <MirrorsMenu />
      </Box>
    </Box>
  );
}
