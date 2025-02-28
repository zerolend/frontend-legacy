import axios, { AxiosError } from 'axios';
import { PROD_ENV } from './marketsAndNetworksConfig';

const basePath = PROD_ENV
  ? 'https://airdrop-api-aws.zerolend.xyz'
  : 'https://staging-api.zerolend.xyz';

interface IHttpError {
  success: false;
  errorName: 'Error';
  error: string;
}

export class HttpError extends Error {
  status = 500;

  constructor(message?: string, status?: number) {
    super(message);
    if (status) this.status = status;
  }
}

async function apiCaller<T>(
  endpoint: string,
  method = 'get',
  body?: any,
  queryParams?: string,
  jwt?: string,
  baseUrl?: string
): Promise<T> {
  let url = `${baseUrl || basePath}/${endpoint}`;

  if (method === 'get' && queryParams) {
    url = `${url}?${queryParams}`;
  }

  const headers: any = {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (jwt) headers['x-jwt'] = jwt;

  try {
    const ret = await axios({
      url,
      headers,
      method,
      data: body,
    });
    const err = ret.data as IHttpError;
    if (ret.status !== 200) throw new HttpError(err.error, ret.status);
    return ret.data as T;
  } catch (e: any) {
    const err = e as AxiosError<any>;
    // throw new HttpError(err.response?.data.message || err.message, err.response?.status || 500);
    console.log('error', err.response?.data.message || err.message, err.response?.status || 500);
    return err.response?.data as T;
  }
}

export default apiCaller;
