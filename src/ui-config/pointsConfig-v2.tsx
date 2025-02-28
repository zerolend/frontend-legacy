import { Link } from '@mui/material';
import { ReactElement } from 'react';

export interface IncentivesButtonProps {
  text: string | ReactElement;
  // color: string;
  tooltip?: string | ReactElement;
  link?: string;
  pointsIcon?: string;
}

const zeroSupplyPoints = (min: number, max: number) => ({
  text: `${min}x-${max}x Gravity Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x-{max}x points/USD/day. Visit{' '}
      <Link href={'/gravity'} target={'_blank'}>
        Gravity Page
      </Link>{' '}
      for more info
    </span>
  ),
  pointsIcon: '/tokens/zero.svg',
});

const zircuitPoints = (min: number) => ({
  text: `${min}x Zircuit Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Zircuit points/USD/day. Visit the{' '}
      <Link href={'https://app.zircuit.com/lending'} target={'_blank'}>
        Zircuit Lending Page
      </Link>{' '}
      for more info
    </span>
  ),
  pointsIcon: '/tokens/zrc.svg',
});

const zeroGravityBorrow: IncentivesButtonProps = {
  text: '4x-20x Gravity Points ',
  tooltip: (
    <span>
      Borrowing this collateral will give you 4x-20x points/USD/day. Visit{' '}
      <Link href={'/gravity'} target={'_blank'}>
        Gravity Page
      </Link>{' '}
      for more info
    </span>
  ),
  pointsIcon: '/tokens/zero.svg',
};

const lxpPoints = () => ({
  color: '#c2eeff',
  text: 'LXP-L Points',
  tooltip: (
    <span>
      Supplying this asset will give you will get you LXP-L points from linea. Visit the{' '}
      <Link href={'https://referrals.linea.build/?refCode=vhN04mGePq'} target={'_blank'}>
        LXP-L Campaign page
      </Link>{' '}
      for more info
    </span>
  ),
  pointsIcon: '/tokens/lxp-l.svg',
});

const lxpReferralPoints: IncentivesButtonProps = {
  text: 'ZL LXP-L Referral Points',
  tooltip: 'Referral points earned by ZeroLend, distributed back to borrowers',
  link: '/rewards',
  pointsIcon: '/tokens/lxp-l.svg',
};

const turtlePoints: IncentivesButtonProps = {
  text: 'Turtle Points',
  tooltip: (
    <span>
      Users get boosted points if they are part of{' '}
      <Link href={'https://turtle.club/dashboard/?ref=ZEROLEND'} target={'_blank'}>
        turtle.club
      </Link>{' '}
    </span>
  ),
  pointsIcon: '/tokens/turtle.svg',
};

const redStonePoints: IncentivesButtonProps = {
  text: `100M RSG Points`,
  tooltip: (
    <span>
      Supplying this collateral will offer you an opportunity to earn from 100M Redstone RSG points
      under the Redstone Expedition campaign until Jan 26, 2025.
    </span>
  ),
  pointsIcon: '/tokens/rsg.svg',
};

const blastPoints: IncentivesButtonProps = {
  text: '1x Blast Points',
  pointsIcon: '/tokens/blast.svg',
  // ToDo: add tooltip content here for blast points
};

const defaultLPXLLPStakePoints: IncentivesButtonProps = {
  text: 'LXP-L Points',
  tooltip: '',
  link: 'https://referrals.linea.build/?refCode=vhN04mGePq',
};

const defaultGravityLPStakePoints: IncentivesButtonProps = {
  text: 'Gravity Points',
};

const mellowPoints = (min: number, max: number) => ({
  color: '#fa849c',
  text: `${min}-${max}x Mellow Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Mellow Points on Mellow Protocol. You can get
      more points (upto {max}x) by leveraging on your deposit. <br />
      <br />
      (Points are added retroactively by the points issuer).
    </span>
  ),
  pointsIcon: '/tokens/pzeth.svg',
});

const etherFiPoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x Loyalty Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Loyalty points from ether.fi. You can get more
      points (upto {max}x) by leveraging on your deposit. <br />
      <br />
      (Points are added retroactively by the points issuer).
    </span>
  ),
  pointsIcon: '/tokens/weeth.svg',
});

const ethenaSats = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x Ethena Sats`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Sats from Ethena. You can get more points (upto{' '}
      {max}x) by leveraging on your deposit. <br />
      <br />
      (Points are added retroactively by the points issuer).
    </span>
  ),
  pointsIcon: '/tokens/usde.svg',
});

const vedaPoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x Veda Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Veda points from Veda. You can get more points
      (upto {max}x) by leveraging on your deposit. <br />
      <br />
      (Points are added retroactively by the points issuer).
    </span>
  ),
  pointsIcon: '/tokens/veda.svg',
});

const babylonPoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x Babylon Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Babylon points from Babylon. You can get more
      points (upto {max}x) by leveraging on your deposit. <br />
      <br />
      (Points are added retroactively by the points issuer).
    </span>
  ),
  pointsIcon: '/tokens/babylon.svg',
});

const pumpBtcPoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x pumpBTC Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x pumpBTC points from pumpBTC. You can get more
      points (upto {max}x) by leveraging on your deposit. <br />
      <br />
      (Points are added retroactively by the points issuer).
    </span>
  ),
  pointsIcon: '/tokens/pumpbtc.svg',
});

const renzoPoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x ezPoints`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x ezPoints on Renzo. You can get more points
      (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/ezeth.svg',
});

const stonePoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x ezPoints`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x StakeStone Points on StakeStone. You can get
      more points (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/stone-points.svg',
});

const lombardPoints = (min: number, max: number, description?: string) => ({
  color: '#ACE731',
  text: `${min}x-${max}x Lombard Points`,
  tooltip: (
    <span>
      {description || (
        <>
          Supplying this collateral will give you {min}x Lombard Points on Lombard. You can get more
          points (upto {max}x) by leveraging on your deposit.
        </>
      )}
    </span>
  ),
  pointsIcon: '/tokens/lombard.svg',
});

const symbioticPoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x Symbiotic Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Symbiotic Points on Symbiotic. You can get more
      points (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/symbiotic.svg',
});

const eigenPoints = (min: number | string, max: number | string) => ({
  color: '#ACE731',
  text: `${min}-${max}x EIGEN Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x EIGEN Points on EignerLayer. You can get more
      points (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/eigenlayer.svg',
});

const karakPoints = (min: number | string, max: number | string) => ({
  color: '#ACE731',
  text: `${min}-${max}x Karak Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Karak Points on Karak. You can get more points
      (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/karak.svg',
});

const kelpPoints = (min: number | string, max: number | string) => ({
  color: '#D8F0F0',
  text: `${min}-${max}x Kelp Miles`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Kelp Miles on KelpDao. You can get more points
      (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/rseth.svg',
});

const pufferPoints = (min: number | string, max: number | string) => ({
  color: '#ACE731',
  text: `${min}-${max}x Puffer Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Puffer Points on Puffer. You can get more
      points (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/pufeth.svg',
});

const bedrockPoints = (min: number | string, max: number | string) => ({
  color: '#ACE731',
  text: `${min}-${max}x Bedrock Diamonds`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Bedrock Daimonds from Bedrock. You can get more
      points (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/unieth.svg',
});

const inceptionPoints = (min: number | string, max: number | string) => ({
  text: `${min}-${max}x Inception Totem`,
  color: '#ACE731',
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x InceptionLRT Totems from InceptionLRT. You can
      get more points (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/unieth.svg',
});

const usualPills = (min: number | string, max: number | string) => ({
  text: `${min}-${max}x Usual Pills`,
  color: '#ACE731',
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Pills from Usual Money. You can get more points
      (upto {max}x) by leveraging on your deposit.
    </span>
  ),
  pointsIcon: '/tokens/pills.svg',
});

const anzenPoints = (min: number | string, max: number | string, emode = false) => ({
  text: `${min}-${max}x Z-Points`,
  color: '#ACE731',
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x Z-Points from Anzen Finance. You can get more
      points (upto {max}x) by leveraging on your deposit.{' '}
      {emode &&
        'You can also earn extra leverage by enabling E-Mode and borrowing upto 97% of your collateral.'}
    </span>
  ),
  pointsIcon: '/tokens/usdz.svg',
});

const solvBBNPoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x RP Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x RP points from SolvBTC. You can get more points
      (upto {max}x) by leveraging on your deposit. <br />
      <br />
      (Points are added retroactively by the points issuer).
    </span>
  ),
  pointsIcon: '/tokens/solvbtc.bbn.svg',
});

const solvMPoints = (min: number, max: number) => ({
  color: '#ACE731',
  text: `${min}-${max}x RP Points`,
  tooltip: (
    <span>
      Supplying this collateral will give you {min}x RP points from SolvBTC. You can get more points
      (upto {max}x) by leveraging on your deposit. <br />
      <br />
      (Points are added retroactively by the points issuer).
    </span>
  ),
  pointsIcon: '/tokens/solvbtc.m.svg',
});

export const defaultLPStakePoints = [defaultLPXLLPStakePoints, defaultGravityLPStakePoints];

export const supplyPointsConfig: { [key: string]: { [key: string]: IncentivesButtonProps[] } } = {
  //Ethereum
  proto_mainnet_lrt_v3: {
    eth: [zeroSupplyPoints(2, 10), turtlePoints],
    weth: [zeroSupplyPoints(2, 10), turtlePoints],
    ezeth: [zeroSupplyPoints(2, 10), turtlePoints, renzoPoints(2, 6), eigenPoints(1, 3)],
    pzeth: [
      zeroSupplyPoints(2, 10),
      turtlePoints,
      mellowPoints(2, 6),
      renzoPoints(2, 6),
      symbioticPoints(1, 3),
    ],
    'pt-rseth-26sep2024': [zeroSupplyPoints(1, 5), turtlePoints],
    pufeth: [zeroSupplyPoints(2, 10), turtlePoints, pufferPoints(2, 6)],
    rseth: [zeroSupplyPoints(2, 10), turtlePoints, kelpPoints(3, 9), eigenPoints(1, 3)],
    weeth: [zeroSupplyPoints(1, 5), turtlePoints, etherFiPoints(2, 6), eigenPoints(1, 3)],
  },
  //Linea
  proto_linea_v3: {
    eth: [zeroSupplyPoints(2, 10), lxpPoints(), turtlePoints],
    weth: [zeroSupplyPoints(2, 10), lxpPoints(), turtlePoints],
    usdc: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    dai: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    ['m-btc']: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    ['solvbtc.m']: [zeroSupplyPoints(1, 1), lxpPoints(), turtlePoints, solvMPoints(3, 3)],
    usdt: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    ezeth: [
      renzoPoints(2, 6),
      zeroSupplyPoints(2, 10),
      lxpPoints(),
      turtlePoints,
      eigenPoints(1, 3),
    ],
    grai: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    wbtc: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    weeth: [
      zeroSupplyPoints(1, 5),
      lxpPoints(),
      turtlePoints,
      etherFiPoints(2, 6),
      eigenPoints(1, 3),
    ],
    wrseth: [
      zeroSupplyPoints(3, 15),
      lxpPoints(),
      turtlePoints,
      kelpPoints(3, 9),
      eigenPoints(1, 3),
    ],
    unieth: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints, bedrockPoints(3, 6)],
    stone: [zeroSupplyPoints(1, 5), lxpPoints(), stonePoints(2, 6), turtlePoints],
    wsteth: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    frxeth: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    ineth: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints, inceptionPoints(15, 30)],
    susde: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
    usde: [zeroSupplyPoints(1, 5), lxpPoints(), turtlePoints],
  },
  // Linea croak
  proto_linea_foxy_v3: {
    eth: [zeroSupplyPoints(1, 5), lxpPoints()],
    usdc: [zeroSupplyPoints(1, 5), lxpPoints()],
    foxy: [zeroSupplyPoints(1, 5), lxpPoints()],
  },
  //Blast
  proto_blast_v3: {
    eth: [zeroSupplyPoints(2, 10), blastPoints, turtlePoints],
    weth: [zeroSupplyPoints(2, 10), blastPoints, turtlePoints],
    ezeth: [zeroSupplyPoints(1, 5), turtlePoints, renzoPoints(2, 6), eigenPoints(1, 3)],
    usdb: [zeroSupplyPoints(1, 5), blastPoints, turtlePoints],
    weeth: [zeroSupplyPoints(1, 5), turtlePoints, etherFiPoints(2, 6), eigenPoints(1, 3)],
  },
  //zksync
  proto_zksync_era_v3: {
    eth: [zeroSupplyPoints(2, 10)],
    weth: [zeroSupplyPoints(2, 10)],
    dai: [zeroSupplyPoints(1, 5)],
    lusd: [zeroSupplyPoints(1, 5)],
    usdt: [zeroSupplyPoints(1, 5)],
    'usdc.e': [zeroSupplyPoints(1, 5)],
    wbtc: [zeroSupplyPoints(1, 5)],
  },
  proto_mainnet_btc_v3: {
    ebtc: [
      babylonPoints(1, 10),
      lombardPoints(2, 20),
      symbioticPoints(1, 10),
      etherFiPoints(3, 30),
      vedaPoints(3, 30),
      turtlePoints,
      zeroSupplyPoints(3, 30),
      eigenPoints('TBD', '?'),
      karakPoints('TBD', '?'),
    ],
    lbtc: [babylonPoints(1, 10), lombardPoints(3, 15), turtlePoints, zeroSupplyPoints(1, 5)],
    wbtc: [zeroSupplyPoints(2, 10), turtlePoints],
    cbbtc: [zeroSupplyPoints(1, 5), turtlePoints],
    'm-btc': [zeroSupplyPoints(1, 5), turtlePoints],
    'solvbtc.bbn': [zeroSupplyPoints(1, 1), turtlePoints, solvBBNPoints(3, 3)],
    'pt-ebtc-26dec2024': [zeroSupplyPoints(1, 5), turtlePoints],
    'pt-cornlbtc-26dec2024': [zeroSupplyPoints(1, 5), turtlePoints],
    pumpbtc: [zeroSupplyPoints(1, 5), pumpBtcPoints(2, 10), turtlePoints],
  },
  //XLayer
  proto_layerx_v3: {
    eth: [zeroSupplyPoints(2, 10)],
    weth: [zeroSupplyPoints(2, 10)],
    usdc: [zeroSupplyPoints(1, 5)],
    usdz: [zeroSupplyPoints(1, 5)],
    usdt: [zeroSupplyPoints(1, 5)],
    wbtc: [zeroSupplyPoints(1, 5)],
    dai: [zeroSupplyPoints(1, 5)],
    okb: [zeroSupplyPoints(1, 5)],
  },
  proto_mainnet_rwa_v3: {
    usdc: [zeroSupplyPoints(1, 5), turtlePoints],
    usdz: [zeroSupplyPoints(1, 5), turtlePoints],
    usds: [zeroSupplyPoints(1, 5), turtlePoints],
    eusd: [ethenaSats(20, 200), vedaPoints(3, 30), zeroSupplyPoints(1, 5), turtlePoints],
    // 'pt-usd0++-31oct2024': [zeroSupplyPoints(1, 5), turtlePoints],
    'pt-usd0++-27mar2025': [zeroSupplyPoints(1, 5), turtlePoints],
    usdt: [zeroSupplyPoints(1, 5), turtlePoints],
    stusd: [zeroSupplyPoints(1, 5), turtlePoints],
    usd0: [usualPills(1, 10), zeroSupplyPoints(1, 5), turtlePoints],
    'usd0++': [usualPills(3, 30), zeroSupplyPoints(1, 5), turtlePoints],
  },
  proto_zircuit_v3: {
    'usdc.e': [zircuitPoints(2), zeroSupplyPoints(1, 5), turtlePoints],
    usdt: [zircuitPoints(2), zeroSupplyPoints(1, 5), turtlePoints],
    eth: [zircuitPoints(2), zeroSupplyPoints(1, 5), turtlePoints],
    weth: [zircuitPoints(2), zeroSupplyPoints(1, 5), turtlePoints],
    zrc: [zircuitPoints(3), zeroSupplyPoints(1, 5), turtlePoints],
    'wbtc.e': [zircuitPoints(2), zeroSupplyPoints(1, 5), turtlePoints],
  },
  proto_base_v3: {
    usdc: [zeroSupplyPoints(1, 5), turtlePoints],
    xusdz: [zeroSupplyPoints(1, 5), turtlePoints],
    aero: [zeroSupplyPoints(1, 5), turtlePoints],
    cbbtc: [zeroSupplyPoints(2, 10), turtlePoints],
    lbtc: [zeroSupplyPoints(5, 15), lombardPoints(3, 15), turtlePoints, redStonePoints],
    cbeth: [zeroSupplyPoints(1, 5), turtlePoints],
    'vamm-usdc/aero': [zeroSupplyPoints(1, 5), turtlePoints],
    susdzusdc: [zeroSupplyPoints(1, 5), turtlePoints],
    eth: [zeroSupplyPoints(1, 5), turtlePoints],
    weth: [zeroSupplyPoints(1, 5), turtlePoints],
    usdz: [anzenPoints(10, 200, true), zeroSupplyPoints(2, 40), turtlePoints],
    susdz: [anzenPoints(5, 25), zeroSupplyPoints(2, 5), turtlePoints],
    superoethb: [zeroSupplyPoints(1, 5), turtlePoints],
    wsuperoethb: [zeroSupplyPoints(1, 5), turtlePoints],
  },
};

export const borrowPointsConfig: { [key: string]: { [key: string]: IncentivesButtonProps[] } } = {
  //Ethereum
  proto_mainnet_lrt_v3: {
    eth: [zeroGravityBorrow],
    weth: [zeroGravityBorrow],
    pzeth: [zeroGravityBorrow],
    ezeth: [zeroGravityBorrow],
    rseth: [zeroGravityBorrow],
    weeth: [zeroGravityBorrow],
  },
  //Linea
  proto_linea_v3: {
    eth: [zeroGravityBorrow, lxpReferralPoints],
    usdc: [zeroGravityBorrow, lxpReferralPoints],
    dai: [zeroGravityBorrow, lxpReferralPoints],
    usdt: [zeroGravityBorrow, lxpReferralPoints],
    wbtc: [zeroGravityBorrow, lxpReferralPoints],
    wrseth: [zeroGravityBorrow, lxpReferralPoints],
    ezeth: [zeroGravityBorrow, lxpReferralPoints],
    usde: [zeroGravityBorrow, lxpReferralPoints],
    weeth: [zeroGravityBorrow, lxpReferralPoints],
    wsteth: [zeroGravityBorrow, lxpReferralPoints],
  },
  //Blast
  proto_blast_v3: {
    eth: [zeroGravityBorrow],
    usdb: [zeroGravityBorrow],
  },
  //zksync
  proto_zksync_era_v3: {
    eth: [zeroGravityBorrow],
    dai: [zeroGravityBorrow],
    lusd: [zeroGravityBorrow],
    usdt: [zeroGravityBorrow],
    'usdc.e': [zeroGravityBorrow],
    wbtc: [zeroGravityBorrow],
  },
  proto_mainnet_btc_v3: {
    ebtc: [zeroGravityBorrow],
    wbtc: [zeroGravityBorrow],
    cbbtc: [zeroGravityBorrow],
    pumpbtc: [zeroGravityBorrow],
    'm-btc': [zeroGravityBorrow],
    'solvbtc.bbn': [zeroGravityBorrow],
    lbtc: [
      zeroGravityBorrow,
      lombardPoints(
        1,
        0,
        'Borrowing this collateral will give you 3x Lombard Lux Points if you borrow LBTC against the PT-cornLBTC-26DEC2024 token as collateral'
      ),
    ],
  },
  proto_mainnet_rwa_v3: {
    usdc: [zeroGravityBorrow],
    usdt: [zeroGravityBorrow],
    eusd: [zeroGravityBorrow],
    usds: [zeroGravityBorrow],
    usdz: [zeroGravityBorrow],
    usd0: [zeroGravityBorrow],
    'usd0++': [zeroGravityBorrow],
    'pt-usd0++-31oct2024': [zeroGravityBorrow],
  },
  proto_layerx_v3: {
    eth: [zeroGravityBorrow],
    weth: [zeroGravityBorrow],
    usdc: [zeroGravityBorrow],
    usdt: [zeroGravityBorrow],
    wbtc: [zeroGravityBorrow],
    dai: [zeroGravityBorrow],
    okb: [zeroGravityBorrow],
    usdz: [zeroGravityBorrow],
  },
  proto_base_v3: {
    usdc: [zeroGravityBorrow],
    xusdz: [zeroGravityBorrow],
    usdz: [zeroGravityBorrow],
    susdz: [zeroGravityBorrow],
    superoethb: [zeroGravityBorrow],
    wsuperoethb: [zeroGravityBorrow],
    aero: [zeroGravityBorrow],
    cbbtc: [zeroGravityBorrow],
    cbeth: [zeroGravityBorrow],
    eth: [zeroGravityBorrow],
    weth: [zeroGravityBorrow],
  },
};
