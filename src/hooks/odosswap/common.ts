import axios from 'axios';

interface IOdosTokenInput {
  tokenAddress: string;
  amount: string;
}

interface IOdosTokenOutput {
  tokenAddress: string;
  proportion: number;
}

export interface IOdosGenerateQuoteRequest {
  chainId: number; // Replace with desired chainId
  inputTokens: IOdosTokenInput[];
  outputTokens: IOdosTokenOutput[];
  userAddr: string; // checksummed user address
  slippageLimitPercent?: number; // set your slippage limit percentage (1 = 1%),
  referralCode?: number; // referral code (recommended)
  disableRFQs?: boolean;
  compact?: boolean;
}

interface IOdosToken {
  name: string;
  symbol: string;
  decimals: number;
  asset_id?: string;
  asset_type?: string;
  is_rebasing?: boolean;
  cgid?: string;
}

interface OdosLink {
  source: number;
  target: number;
  sourceExtend: boolean;
  targetExtend: boolean;
  label: string;
  value: number;
  nextValue: number;
  stepValue: number;
  in_value: number;
  out_value: number;
  edge_len: number;
  sourceToken: IOdosToken;
  targetToken: IOdosToken;
}

interface IOdosNodes {
  name: string;
  symbol: string;
  decimals: number;
  visible: boolean;
  width: number;
}

interface OdosPathViz {
  nodes: IOdosNodes[];
  links: OdosLink[];
}

export interface IOdosGenerateQuoteResponse {
  srcToken: any;
  srcAmount(srcAmount: any, srcDecimals: any): unknown;
  srcDecimals(srcAmount: any, srcDecimals: any): unknown;
  srcUSD: any;
  destToken: any;
  destAmount(destAmount: any, destDecimals: any): unknown;
  destDecimals(destAmount: any, destDecimals: any): unknown;
  destUSD: any;
  tokenTransferProxy: any;
  inTokens: string[];
  outTokens: string[];
  inAmounts: string[];
  outAmounts: string[];
  gasEstimate: number;
  dataGasEstimate: number;
  gweiPerGas: number;
  gasEstimateValue: number;
  inValues: number[];
  outValues: number[];
  netOutValue: number;
  priceImpact: number;
  percentDiff: number;
  partnerFeePercent: number;
  pathId: string;
  pathViz: OdosPathViz;
  blockNumber: number;
}

export const generateQuote = async (quoteRequestBody: IOdosGenerateQuoteRequest) => {
  const quoteUrl = 'https://api.odos.xyz/sor/quote/v2';

  const response = await axios.post<IOdosGenerateQuoteResponse>(quoteUrl, quoteRequestBody, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    const quote = await response.data;
    return quote;
    // handle quote response data
  } else if (response.status === 400) {
    console.log(response);
    // handle quote failure cases
  } else {
    console.error('Error in Quote:', response);
    // handle quote failure cases
  }
};

interface IOdosTransaction {
  gas: number;
  gasPrice: number;
  value: string;
  to: string;
  from: string;
  data: string;
  nonce: number;
  chainId: number;
}

interface IOdosSimulationError {
  type: string;
  errorMessage: string;
}

interface IOdosSimulation {
  isSuccess: boolean;
  amountsOut: number[];
  gasEstimate: number;
  simulationError: IOdosSimulationError;
}

export interface IOdosGenerateAssembleResponse {
  deprecated: string;
  blockNumber: number;
  gasEstimate: number;
  gasEstimateValue: number;
  inputTokens: IOdosTokenInput[];
  outputTokens: IOdosTokenInput[];
  netOutValue: number;
  outValues: string[];
  transaction: IOdosTransaction;
  simulation: IOdosSimulation;
}

export interface IOdosGenerateAssembleRequest {
  pathId: string;
  simulate: boolean;
  userAddr: string;
}
// Example of using the TransactionData interface with sample data

export const generateAssemble = async (quoteRequestBody: IOdosGenerateAssembleRequest) => {
  const quoteUrl = 'https://api.odos.xyz/sor/assemble';

  const response = await axios.post<IOdosGenerateAssembleResponse>(quoteUrl, quoteRequestBody, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    const quote = await response.data;
    return quote;
    // handle quote response data
  } else {
    console.error('Error in Quote:', response);
    // handle quote failure cases
  }
};
