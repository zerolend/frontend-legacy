import { IApi } from './interface';

export const IApi_NON_LOADING: IApi = {
  success: false,
  error: undefined,
  isLoading: false,
};

export const IApi_LOADING: IApi = {
  success: false,
  error: undefined,
  isLoading: true,
};
