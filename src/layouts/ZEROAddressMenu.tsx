import { Trans } from '@lingui/macro';
import { Button, Menu, MenuItem, SvgIcon, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { TokenIcon } from '../components/primitives/TokenIcon';
import { useWeb3Context } from '../libs/hooks/useWeb3Context';
import { availableMarkets, CustomMarket } from '../utils/marketsAndNetworksConfig';
import { getMarketInfoById } from '../components/MarketSwitcher';
import { useProtocolDataContext } from '../hooks/useProtocolDataContext';
import { zeroConfig } from 'src/ui-config/zeroConfig';

export function ZEROAddressMenu() {
  const [listOpen, setListOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { currentChainId } = useProtocolDataContext();
  const { addERC20Token, chainId: connectedChainId, switchNetwork } = useWeb3Context();

  const handleListClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    setListOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setListOpen(false);
  };

  return (
    <>
      <Button
        variant="surface"
        aria-label="settings"
        id="address-button"
        aria-controls={listOpen ? 'address-menu' : undefined}
        aria-expanded={listOpen ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleListClick}
        sx={{ p: '7px 8px', minWidth: 'unset', ml: 2 }}
        endIcon={
          <SvgIcon
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            {listOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </SvgIcon>
        }
      >
        ZERO Address
      </Button>

      <Menu
        id="address-menu"
        MenuListProps={{
          'aria-labelledby': 'address-button',
        }}
        anchorEl={anchorEl}
        open={listOpen}
        onClose={handleClose}
        sx={{ '.MuiMenuItem-root.Mui-disabled': { opacity: 1 } }}
        keepMounted={true}
      >
        <MenuItem disabled sx={{ mb: '4px' }}>
          <Typography variant="subheader2" color="text.secondary">
            <Trans>ZERO Address</Trans>
          </Typography>
        </MenuItem>
        {availableMarkets.map((marketId: CustomMarket) => {
          const { market } = getMarketInfoById(marketId);
          if (zeroConfig.crossChainAddresses[market.chainId].ZERO_ADDRESS) {
            return (
              <MenuItem
                key="underlying"
                value="underlying"
                divider
                onClick={() => {
                  if (currentChainId !== connectedChainId) {
                    switchNetwork(currentChainId);
                  } else {
                    addERC20Token({
                      address: zeroConfig.crossChainAddresses[market.chainId].ZERO_ADDRESS,
                      decimals: 18,
                      symbol: 'ZERO',
                      image: undefined,
                    });
                  }
                  handleClose();
                }}
              >
                <TokenIcon symbol={'zero'} sx={{ fontSize: '20px' }} />
                <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
                  {zeroConfig.crossChainAddresses[market.chainId].ZERO_ADDRESS}
                </Typography>
              </MenuItem>
            );
          }
        })}
      </Menu>
    </>
  );
}
