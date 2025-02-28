import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import React, { useState } from 'react';

// interface IProps {
//   lockId: number;
// }

const ManageZeroLockOption = () => {
  const [manageOpen, setManageOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleManageClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    setManageOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setManageOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        aria-label="manage"
        id="manage-button"
        aria-controls={manageOpen ? 'manage-menu' : undefined}
        aria-expanded={manageOpen ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleManageClick}
        sx={{ p: '7px 8px', minWidth: 'unset', ml: 2 }}
      >
        Manage
      </Button>

      <Menu
        id="manage-menu"
        MenuListProps={{
          'aria-labelledby': 'manage-button',
        }}
        anchorEl={anchorEl}
        open={manageOpen}
        onClose={handleClose}
        sx={{ '.MuiMenuItem-root.Mui-disabled': { opacity: 1 } }}
        keepMounted={true}
      >
        <MenuItem disabled sx={{ mb: '4px' }}>
          <Typography variant="subheader2" color="text.secondary">
            <Trans>Manage Vest</Trans>
          </Typography>
        </MenuItem>

        {/* <MenuItem>
          <Typography variant="subheader1">
            <Trans>View Details</Trans>
          </Typography>
        </MenuItem>*/}
        {/*<MenuItem>
          <Typography variant="subheader1">
            <Trans>Spilt</Trans>
          </Typography>
        </MenuItem>*/}

        <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          <Typography variant="subheader1">
            <Trans>Transfer</Trans>
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ManageZeroLockOption;
