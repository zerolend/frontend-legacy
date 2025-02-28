import { Link } from '@mui/material';
import { ReactElement } from 'react';
import { Box } from '@mui/system';
import tZerolendShield from './shields/tZerolendShield.png';

export interface IncentivesButtonProps {
  text: string | ReactElement;
  color: string;
  tooltip: string | ReactElement;
  link?: string;
}

//Key: <assetSymbol>-<marketChainId>

export const zeroGravitySupplyConfig: { [key: string]: IncentivesButtonProps } = {
  default: {
    color: '#EFE8FE',
    text: '1x Gravity Points ',
    tooltip: (
      <span>
        Supplying this collateral will give you 1x points/USD/day. Visit{' '}
        <Link href={'https://airdrop.zerolend.xyz'} target={'_blank'}>
          airdrop.zerolend.xyz
        </Link>{' '}
        for more info
      </span>
    ),
  },
  'ETH-1': {
    color: '#EFE8FE',
    text: '+2x Gravity Points ',
    tooltip: (
      <span>
        Supplying this asset will boost your points by +2x under the Zero Gravity (+2x) ETH Boost
        Campaign.
        <br /> You will receive (1x+2x)=3 points/dollar/day. Visit{' '}
        <Link href={'https://airdrop.zerolend.xyz'} target={'_blank'}>
          airdrop.zerolend.xyz
        </Link>{' '}
        for more info.
      </span>
    ),
  },
  'WETH-1': {
    color: '#EFE8FE',
    text: '+2x Gravity Points ',
    tooltip: (
      <span>
        Supplying this asset will boost your points by +2x under the Zero Gravity (+2x) ETH Boost
        Campaign.
        <br /> You will receive (1x+2x)=3 points/dollar/day. Visit{' '}
        <Link href={'https://airdrop.zerolend.xyz'} target={'_blank'}>
          airdrop.zerolend.xyz
        </Link>{' '}
        for more info.
      </span>
    ),
  },
  'ezETH-1': {
    color: '#EFE8FE',
    text: '2x Gravity Points',
    tooltip: (
      <span>
        Supplying will give you 2x ZERO Gravity points. Visit{' '}
        <Link href={'https://airdrop.zerolend.xyz'}>airdrop.zerolend.xyz</Link> for more info
      </span>
    ),
  },
  'ezETH-81457': {
    color: '#EFE8FE',
    text: '2x Gravity Points',
    tooltip: (
      <span>
        Supplying will give you 2x ZERO Gravity points. Visit{' '}
        <Link href={'https://airdrop.zerolend.xyz'}>airdrop.zerolend.xyz</Link> for more info
      </span>
    ),
  },
  'ezETH-59144': {
    color: '#EFE8FE',
    text: '2x Gravity Points',
    tooltip: (
      <span>
        Supplying will give you 2x ZERO Gravity points. Visit{' '}
        <Link href={'https://airdrop.zerolend.xyz'}>airdrop.zerolend.xyz</Link> for more info
      </span>
    ),
  },
};

export const zeroGravityBorrowConfig: { [key: string]: IncentivesButtonProps } = {
  default: {
    color: '#EFE8FE',
    text: '4x Gravity Points ',
    tooltip: (
      <span>
        Borrowing this collateral will give you 4x points/USD/day. Visit{' '}
        <Link href={'https://airdrop.zerolend.xyz'} target={'_blank'}>
          airdrop.zerolend.xyz
        </Link>{' '}
        for more info
      </span>
    ),
  },
};

export const turtleSupplyConfig: { [key: string]: IncentivesButtonProps[] } = {
  default: [
    {
      color: '#c2eeff',
      text: (
        <Box display={'flex'} alignItems={'center'}>
          1x LXP-L Points
          <img src={tZerolendShield.src} width={16} alt={'tZerolendShield'} />
        </Box>
      ),
      tooltip: '',
      link: 'https://twitter.com/LineaBuild/status/1773055480396444044', //ToDo: add Link here
    },
    {
      color: 'rgba(168,213,97,0.56)',
      text: '1x Turtle Points',
      tooltip: '',
      link: 'https://turtle.club/dashboard/?ref=ZEROLEND', //ToDo: add Link here
    },
  ],
};

export const supplyPointsConfig: { [key: string]: IncentivesButtonProps[] } = {
  'rsETH-1': [
    {
      color: '#D8F0F0',
      text: '1.5-4.5x Kelp Miles',
      tooltip: (
        <span>
          Supplying this collateral will give you 1.5x Kelp Miles on KelpDao. You can get more
          points (upto 4.5x) by leveraging on your deposit.
          <br /> 100% of all Kelp Miles go back to suppliers of this asset.
        </span>
      ),
    },
    {
      color: '#e5f293',
      text: '1-3x EigenLayer Points',
      tooltip: (
        <span>
          Supplying this collateral will give you 1x EigenLayer points. You can get more points
          (upto 3x) by leveraging on your deposit.
          <br />
          100% of all EigenLayer points go back to suppliers of this asset.
        </span>
      ),
    },
  ],
  'ezETH-1': [
    {
      color: '#ACE731',
      text: '2-6x ezPoints',
      tooltip: (
        <span>
          Supplying this collateral will give you 2x ezPoints on Renzo. You can get more points
          (upto 6x) by leveraging on your deposit.
          <br /> 100% of all Renzo points go back to suppliers of this asset.
        </span>
      ),
    },
    {
      color: '#e5f293',
      text: '1-3x EigenLayer Points',
      tooltip: (
        <span>
          Supplying this collateral will give you 1x EigenLayer points. You can get more points
          (upto 3x) by leveraging on your deposit.
          <br />
          100% of all EigenLayer points go back to suppliers of this asset.
        </span>
      ),
    },
  ],
  'ezETH-81457': [
    {
      color: '#ACE731',
      text: '2-6x ezPoints',
      tooltip: (
        <span>
          Supplying this collateral will give you 2x ezPoints on Renzo. You can get more points
          (upto 6x) by leveraging on your deposit.
          <br /> 100% of all Renzo points go back to suppliers of this asset.
        </span>
      ),
    },
    {
      color: '#e5f293',
      text: '1-3x EigenLayer Points',
      tooltip: (
        <span>
          Supplying this collateral will give you 1x EigenLayer points. You can get more points
          (upto 3x) by leveraging on your deposit.
          <br />
          100% of all EigenLayer points go back to suppliers of this asset.
        </span>
      ),
    },
    {
      color: '#f5f5af',
      text: '1x Blast Gold Points',
      tooltip: '', //ToDo: add tooltip content here for blast points
    },
  ],
  'pufETH-1': [
    {
      color: '#ACE731',
      text: '1-3x Puffer Points',
      tooltip: (
        <span>
          Supplying this collateral will give you 1x Puffer points. You can get more points (upto
          3x) by leveraging on your deposit.
          <br /> 100% of all Puffer points go back to suppliers of this asset.
        </span>
      ),
    },
  ],
  'ezETH-59144': [
    {
      color: '#ACE731',
      text: '2-6x ezPoints',
      tooltip: (
        <span>
          Supplying this collateral will give you 2x ezPoints from Renzo. You can get more points
          (upto 6x) by leveraging on your deposit.
          <br /> 100% of all Renzo points go back to suppliers of this asset.
        </span>
      ),
    },
    {
      color: '#e5f293',
      text: '1-3x EigenLayer Points',
      tooltip: (
        <span>
          Supplying this collateral will give you 1x EigenLayer points. You can get more points
          (upto 3x) by leveraging on your deposit.
          <br />
          100% of all EigenLayer points go back to suppliers of this asset.
        </span>
      ),
    },
  ],
  'weETH-1': [
    {
      color: '#ACE731',
      text: '2-6x Loyalty Points',
      tooltip: (
        <span>
          Supplying this collateral will give you 2x Loyalty points from ether.fi. You can get more
          points (upto 6x) by leveraging on your deposit.
          <br /> 100% of all Loyalty points go back to suppliers of this asset.
        </span>
      ),
    },
    {
      color: '#e5f293',
      text: '1-3x EigenLayer Points',
      tooltip: (
        <span>
          Supplying this collateral will give you 1x EigenLayer points. You can get more points
          (upto 3x) by leveraging on your deposit.
          <br />
          100% of all EigenLayer points go back to suppliers of this asset.
        </span>
      ),
    },
  ],
  'USDB-81457': [
    {
      color: '#f5f5af',
      text: '1x Blast Points',
      tooltip: '', //ToDo: add tooltip content here for blast points
    },
  ],
  'ETH-81457': [
    {
      color: '#f5f5af',
      text: '1x Blast Points',
      tooltip: '', //ToDo: add tooltip content here for blast points
    },
  ],
};

export const borrowPointsConfig: { [key: string]: IncentivesButtonProps[] } = {
  'USDB-81457': [
    {
      color: '#f5f5af',
      text: '4x Blast Points',
      tooltip: '', //ToDo: add tooltip content here for blast points
    },
    {
      color: '#f5f5af',
      text: '1x Blast Gold Points',
      tooltip: '', //ToDo: add tooltip content here for blast points
    },
  ],
  'ETH-81457': [
    {
      color: '#f5f5af',
      text: '4x Blast Points',
      tooltip: '', //ToDo: add tooltip content here for blast points
    },
    {
      color: '#f5f5af',
      text: '1x Blast Gold Points',
      tooltip: '', //ToDo: add tooltip content here for blast points
    },
  ],
};
