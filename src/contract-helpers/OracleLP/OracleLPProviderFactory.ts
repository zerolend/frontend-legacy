import { Contract, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class OracleLPProviderFactory extends Contract {
  static connect(address: string, signerOrProvider: Signer | Provider): Contract {
    return new Contract(address, _abi, signerOrProvider);
  }

  connect(signer: Signer): OracleLPProviderFactory {
    return super.connect(signer) as OracleLPProviderFactory;
  }
}

const _abi = [
  {
    inputs: [
      { internalType: 'address', name: '_nileAMM', type: 'address' },
      { internalType: 'address', name: '_zeroPriceFeed', type: 'address' },
      { internalType: 'address', name: '_ethPriceFeed', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ethPriceFeed',
    outputs: [{ internalType: 'contract IPythAggregatorV3', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPrice',
    outputs: [{ internalType: 'uint256', name: 'price', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nileAMM',
    outputs: [{ internalType: 'contract INileAMM', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'x', type: 'uint256' }],
    name: 'sqrt',
    outputs: [{ internalType: 'uint256', name: 'y', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'zeroPriceFeed',
    outputs: [{ internalType: 'contract IPythAggregatorV3', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
