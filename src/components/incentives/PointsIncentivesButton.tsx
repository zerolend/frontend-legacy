import { Box, Typography } from '@mui/material';
import { useState } from 'react';

import { ContentWithTooltip } from '../ContentWithTooltip';
import { IncentivesButtonProps } from '../../ui-config/pointsConfig-v2';
// import Image from 'next/image';

export const PointsIncentivesButton = (props: IncentivesButtonProps) => {
  const [open, setOpen] = useState(false);
  // const [shieldToolTip, setShieldToolTip] = useState(false);

  return (
    <Box display={'flex'} alignItems={'center'} position={'relative'}>
      <ContentWithTooltip
        placement="bottom"
        tooltipContent={<Typography>{props?.tooltip || ''}</Typography>}
        // withoutHover
        withoutHover
        setOpen={setOpen}
        open={open}
      >
        <Box>
          {props.pointsIcon ? (
            <Box
              /*border={'1px solid black'}*/ borderRadius={'50%'}
              height={'22px'}
              onClick={() => {
                if (props.link) {
                  window.open(props.link, '_blank');
                } else if (props?.tooltip) {
                  setOpen(!open);
                }
              }}
            >
              <Box border={'1px solid white'} borderRadius={'50%'} height={'20px'}>
                <img
                  src={`https://zerolend.github.io/token-lists/src${props.pointsIcon}`}
                  alt={'.'}
                  width={'18px'}
                  height={'18px'}
                  style={{ borderRadius: '50%' }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={(theme) => ({
                p: { xs: '4px', xsm: '2px 4px' },
                border: `1px solid ${open ? theme.palette.action.disabled : theme.palette.divider}`,
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s ease',
                // bgcolor: open ? `${props.color}80` : props.color,
                // '&:hover': {
                //   bgcolor: `${props.color}80`,
                //   borderColor: 'action.disabled',
                // },
              })}
              onClick={() => {
                if (props.link) {
                  window.open(props.link, '_blank');
                } else if (props?.tooltip) {
                  setOpen(!open);
                }
              }}
            >
              <Typography variant="main12" color="text.secondary" sx={{ textWrap: 'nowrap' }}>
                {props.text}
              </Typography>
            </Box>
          )}
        </Box>
      </ContentWithTooltip>
      {/*<Box position={'absolute'} bottom={'-8px'} right={'3px'}>
        {props.shield && (
          <ContentWithTooltip
            placement="bottom"
            tooltipContent={<Typography>{props.shield?.shieldToolTip}</Typography>}
            setOpen={() => {
              if (props.shield?.shieldLink) {
                window.open(props.shield?.shieldLink, '_blank');
              } else if (props.shield?.shieldToolTip) {
                setShieldToolTip(!shieldToolTip);
              }
            }}
            open={shieldToolTip}
          >
            {props.shield?.img?.src && (
              <Box ml={1}>
                {' '}
                <img
                  src={props.shield?.img.src}
                  width={18}
                  height={18}
                  alt={'tZerolendShield'}
                />{' '}
              </Box>
            )}
          </ContentWithTooltip>
        )}
      </Box>*/}
    </Box>
  );
};
