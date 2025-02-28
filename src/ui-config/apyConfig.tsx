import React from 'react';

export interface IApyConfig {
  content: string | React.ReactNode;
}
export const apyConfig: { [key: string]: IApyConfig } = {
  'USDB-81457': {
    content: 'This includes the +8% native yield',
  },
  'ETH-81457': {
    content: 'This includes the +3.4% native yield',
  },
};
