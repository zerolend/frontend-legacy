export interface TypeFarmConfig {
  id: string;
  name: string;
  platform: string;
  rewardTokens: string[];
  api: string;
  farmLink: string;
  farmIcon: string;
  apiSearchKey: string;
}
export const FarmConfig: TypeFarmConfig[] = [
  {
    id: '1',
    name: 'sAMM-USDC/ONEZ',
    api: 'https://api.vesync.finance/pairs',
    apiSearchKey: '0xeb73fc57b6cd73bc2e36fa7d9265cb9d4eccbdd6',
    farmLink: 'https://app.vesync.finance/liquidity/0xeb73fc57b6cd73bc2e36fa7d9265cb9d4eccbdd6',
    farmIcon: 'VS_USDC_ONEZ',
    platform: 'VeSync',
    rewardTokens: ['VS'],
  },
  {
    id: '2',
    name: 'USDC/ONEZ',
    api: '',
    apiSearchKey: '0xdae9641baE97243207dE3051B3aC35b2472185Ab',
    farmLink: 'https://zksync.velocore.xyz/liquidity/0xdae9641baE97243207dE3051B3aC35b2472185Ab',
    farmIcon: 'VC_USDC_ONEZ',
    platform: 'Velocore',
    rewardTokens: ['VC'],
  },
  {
    id: '3',
    name: 'USDC/ONEZ',
    api: '',
    apiSearchKey: '0xdae9641baE97243207dE3051B3aC35b2472185Ab',
    farmLink: 'https://app.spacefi.io/#/farm',
    farmIcon: 'SPACE_USDC_ONEZ',
    platform: 'SpaceFi',
    rewardTokens: ['earlyZERO'],
  },
  {
    id: '4',
    name: 'USDC/ONEZ',
    api: '',
    apiSearchKey: '0xdae9641baE97243207dE3051B3aC35b2472185Ab',
    farmLink: 'https://dapp.ezkalibur.com/farms',
    farmIcon: 'SWORD_USDC_ONEZ',
    platform: 'Sword',
    rewardTokens: ['SWORD', 'xSWORD'],
  },
];
