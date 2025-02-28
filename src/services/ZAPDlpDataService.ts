import { Provider } from '@ethersproject/providers';
import { Hashable } from 'src/utils/types';
import { ZAPDlpDataProvider } from 'src/contract-helpers/ZAPDlp/zap-dlp-services';

type setCreateZAPParams = {
  amount: string;
  duration: number;
  odosData: string;
};

export class ZAPDlpDataService implements Hashable {
  private readonly zapDataService: ZAPDlpDataProvider;

  constructor(
    provider: Provider,
    lockDataProviderAddress: string,
    public readonly chainId: number
  ) {
    this.zapDataService = new ZAPDlpDataProvider({
      uiStakeDataProvider: lockDataProviderAddress,
      provider,
    });
  }

  async setGeneralCreateDLP({ amount, duration, odosData }: setCreateZAPParams) {
    return this.zapDataService.setZapAndStake(amount, duration, odosData);
  }

  public toHash() {
    return this.chainId.toString();
  }
}
