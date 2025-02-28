import { Contract, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class ZAPDlpProviderFactory extends Contract {
  connect(signer: Signer): ZAPDlpProviderFactory {
    return super.connect(signer) as ZAPDlpProviderFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Contract {
    return new Contract(address, _abi, signerOrProvider);
  }
}

const _abi = [
  {
    inputs: [
      { internalType: 'address', name: '_odos', type: 'address' },
      { internalType: 'address', name: '_locker', type: 'address' },
      { internalType: 'address', name: '_zero', type: 'address' },
      { internalType: 'address', name: '_weth', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'EthSendFailed', type: 'error' },
  { inputs: [], name: 'OdosSwapFailed', type: 'error' },
  { inputs: [], name: 'ZeroTransferFailed', type: 'error' },
  {
    inputs: [],
    name: 'locker',
    outputs: [{ internalType: 'contract ILocker', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lp',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'odos',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'sweep', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'weth',
    outputs: [{ internalType: 'contract IWETH', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
      { internalType: 'uint256', name: 'zeroAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'wethAmount', type: 'uint256' },
      { internalType: 'bytes', name: 'odosSwapData', type: 'bytes' },
    ],
    name: 'zapAndStake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'zero',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
