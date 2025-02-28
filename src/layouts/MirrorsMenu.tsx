import { ChevronUpIcon, LinkIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

export function MirrorsMenu() {
  const [mirrorsOpen, setMirrorsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleMirrorsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    setMirrorsOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMirrorsOpen(false);
  };

  return (
    <>
      <Button
        variant="surface"
        aria-label="mirrors"
        id="mirrors-button"
        aria-controls={mirrorsOpen ? 'mirrors-menu' : undefined}
        aria-expanded={mirrorsOpen ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleMirrorsClick}
        sx={{ p: '7px 8px', minWidth: 'unset', ml: 2 }}
      >
        <Box display={'flex'} alignItems={'center'}>
          Mirrors
          <SvgIcon sx={{ color: '#F1F1F3' }} fontSize="small">
            <ChevronUpIcon />
          </SvgIcon>
        </Box>
      </Button>

      <Menu
        id="mirrors-menu"
        MenuListProps={{
          'aria-labelledby': 'mirrors-button',
        }}
        anchorEl={anchorEl}
        open={mirrorsOpen}
        onClose={handleClose}
        sx={{ '.MuiMenuItem-root.Mui-disabled': { opacity: 1 } }}
        keepMounted={true}
      >
        <Box sx={{ mb: '4px', px: 4, pt: 2 }} maxWidth={200}>
          <Typography variant="subheader1" color="text.secondary">
            <Trans>Mirrors</Trans>
          </Typography>
          <Typography variant="subheader2" color="text.muted">
            <Trans>Available centralized (web2) and decentralized (web3) website mirrors.</Trans>
          </Typography>
        </Box>

        <Box sx={{ color: 'text.primary' }}>
          <Box>
            <Typography
              variant="subheader2"
              color="text.secondary"
              sx={{ mb: '4px', px: 4, pt: 2 }}
            >
              <Trans>Centralized:</Trans>
            </Typography>
            <MenuItem
              component="a"
              href="https://app.zerolend.xyz"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
            >
              <ListItemText>
                <Trans>app.zerolend.xyz</Trans>
              </ListItemText>
              <SvgIcon sx={{ color: '#838383' }} fontSize="small">
                <LinkIcon />
              </SvgIcon>
            </MenuItem>
          </Box>
          <Divider />
          <Box>
            <Typography
              variant="subheader2"
              color="text.secondary"
              sx={{ mb: '4px', px: 4, pt: 2 }}
            >
              <Trans>Decentralized:</Trans>
            </Typography>
            <MenuItem
              component="a"
              href="https://zerolend.eth.limo/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
            >
              <ListItemText>
                <Trans>zerolend.eth.limo</Trans>
              </ListItemText>
              <SvgIcon sx={{ color: '#838383' }} fontSize="small">
                <LinkIcon />
              </SvgIcon>
            </MenuItem>
            <MenuItem
              component="a"
              href="https://zerolend.myfilebase.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
            >
              <ListItemText>
                <Trans>zerolend.myfilebase.com</Trans>
              </ListItemText>
              <SvgIcon sx={{ color: '#838383' }} fontSize="small">
                <LinkIcon />
              </SvgIcon>
            </MenuItem>
          </Box>
        </Box>
      </Menu>
    </>
  );
}
