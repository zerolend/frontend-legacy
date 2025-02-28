import { useCallback, useEffect, useState } from 'react';
import { useAppDataContext } from '../app-data-provider/useAppDataProvider';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { normalize } from '@aave/math-utils';
import useGetProtocolPoints from './useGetProtocolPoints';

export type TypePoints =
  | 'blast'
  | 'blastGold'
  | 'renzo-1'
  | 'kelp-1'
  | 'etherfi-1'
  | 'el-renzo-1'
  | 'el-kelp-1'
  | 'el-1';
export type SymbolPoints = 'BLAST' | 'GOLD' | 'ezPointsS' | 'kelpMilesShares' | 'eLoyaltyShares';

export interface IUserPoints {
  points: number;
  share: number;
}

type IValue = Record<TypePoints | string, never | IUserPoints>;

type PointsDetails = {
  sharePerSecond: number;
  startDate: number;
};

export const PointsDetails: Record<SymbolPoints, PointsDetails> = {
  BLAST: {
    sharePerSecond: 40,
    startDate: new Date('29 Feb 2024').getTime(),
  },
  GOLD: {
    sharePerSecond: 40,
    startDate: new Date('29 Feb 2024').getTime(),
  },
  ezPointsS: {
    sharePerSecond: 1,
    startDate: new Date('18 March 2024').getTime(),
  },
  kelpMilesShares: {
    sharePerSecond: 1,
    startDate: new Date('18 March 2024').getTime(),
  },
  eLoyaltyShares: {
    sharePerSecond: 1,
    startDate: new Date('18 March 2024').getTime(),
  },
};

export interface IUserProtocolPoints {
  isLoading: boolean;
  value: IValue;
}

const initialUserProtocolPoints = { isLoading: true, value: {} };

const useGetUsersPoints = () => {
  const [data, setData] = useState<IUserProtocolPoints>(initialUserProtocolPoints);
  const { user } = useAppDataContext();
  const { currentAccount: walletAddress } = useWeb3Context();
  const users_incentives = user.calculatedUserIncentives;
  const protocolPoints = useGetProtocolPoints();

  function getObj(
    tokenSymbol: SymbolPoints,
    objKey: TypePoints,
    makingObj: IValue,
    totalProtocolPoints: number
  ): IValue {
    const retObj: IValue = makingObj;
    const incentive = Object.values(users_incentives).filter(
      (data) => data.rewardTokenSymbol === tokenSymbol
    )[0];
    const pointsDetails = PointsDetails[tokenSymbol];
    if (incentive && pointsDetails) {
      const share = Number(normalize(incentive.claimableRewards, incentive.rewardTokenDecimals)); // users share from contract
      const noOfDays = Math.floor(
        Math.abs(pointsDetails.startDate - Date.now()) / (1000 * 60 * 60 * 24)
      ); // no of days from incentives started
      const totalShare = 86400 * noOfDays * pointsDetails.sharePerSecond; //total share (no of days * share per sec)
      const points = (share / totalShare) * totalProtocolPoints;
      retObj[objKey] = {
        points: Number(points) || 0,
        share: share,
      };
    }
    return makingObj;
  }

  const calcPoints = useCallback(async () => {
    if (protocolPoints.isLoading) return setData(initialUserProtocolPoints);
    if (walletAddress !== '') {
      let dataValue: IValue = {};
      //Blast
      dataValue = getObj('BLAST', 'blast', dataValue, protocolPoints.value['totalBlastPoints']);
      dataValue = getObj(
        'GOLD',
        'blastGold',
        dataValue,
        protocolPoints.value['totalBlastGoldPoints']
      );

      //Ethereum
      dataValue = getObj(
        'ezPointsS',
        'renzo-1',
        dataValue,
        protocolPoints.value['totalRenzoPoints_1']
      );
      dataValue = getObj(
        'kelpMilesShares',
        'kelp-1',
        dataValue,
        protocolPoints.value['totalKelpMilesPoints_1']
      );
      dataValue = getObj(
        'eLoyaltyShares',
        'etherfi-1',
        dataValue,
        protocolPoints.value['totalKelpMilesPoints_1']
      );
      //ToDO: puffer
      //Ethereum Eigen Layer Points
      dataValue = getObj(
        'ezPointsS',
        'el-renzo-1',
        dataValue,
        protocolPoints.value['eigenRenzoPoints_1']
      ); // renzo eigen layer points
      dataValue = getObj(
        'kelpMilesShares',
        'el-kelp-1',
        dataValue,
        protocolPoints.value['eigenKelpMilesPoints_1']
      ); // renzo eigen layer points
      dataValue = {
        ...dataValue,
        'el-1': {
          points: dataValue['el-renzo-1']?.points || 0 + dataValue['el-kelp-1']?.points || 0,
          share: 0,
        },
      };
      setData({ isLoading: false, value: { ...dataValue } });
    }
  }, [users_incentives, protocolPoints.value, protocolPoints.isLoading]);

  useEffect(() => {
    if (walletAddress !== '') {
      calcPoints().catch((err) => {
        setData(initialUserProtocolPoints);
        console.error(`Failed to calc user incentives: ${err.stack}`);
      });
    } else {
      setData({ isLoading: false, value: {} });
    }
  }, [calcPoints, walletAddress]);

  return data;
};

export default useGetUsersPoints;
