import { Box } from '@mui/system';
import { Button, Typography, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';
import { Trans } from '@lingui/macro';
import { ListWrapper } from '../lists/ListWrapper';

interface IProps {
  title: ReactNode;
  desc?: ReactNode;
  href: string;
}

const MoveToOne = (props: IProps) => {
  const { title, desc, href } = props;
  const theme = useTheme();
  return (
    <ListWrapper>
      <Box sx={{ px: 6, mb: 6 }}>
        <Box bgcolor={theme.palette.mode === 'dark' ? '#39375A80' : '#C9B3F94D'} p={6} borderRadius={4}>
          <Typography variant={'h2'} color={'text.primary'}>{title}</Typography>
          {desc && (
            <Typography variant={'caption'} color={'text.secondary'}>
              {desc}
            </Typography>
          )}
          <Button variant="contained" sx={{ mr: 4, mt: 6, width: '200px' }} href={href}>
            <Trans>Experience New UI</Trans>
          </Button>
        </Box>
      </Box>
    </ListWrapper>
  );
};

export default MoveToOne;
