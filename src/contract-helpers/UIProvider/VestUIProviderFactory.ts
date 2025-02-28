import { Contract, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class VestUIProviderFactory extends Contract {
  connect(signer: Signer): VestUIProviderFactory {
    return super.connect(signer) as VestUIProviderFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Contract {
    return new Contract(address, _abi, signerOrProvider);
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getLPLockDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'power',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'apr',
            type: 'uint256',
          },
        ],
        internalType: 'struct VestedZeroUiHelper.LockedBalanceWithApr[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getLockDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'power',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'apr',
            type: 'uint256',
          },
        ],
        internalType: 'struct VestedZeroUiHelper.LockedBalanceWithApr[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getVestedNFTData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'cliffDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unlockDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pendingClaimed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pending',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'upfrontClaimed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'upfront',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'linearDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'createdAt',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'hasPenalty',
            type: 'bool',
          },
          {
            internalType: 'enum IVestedZeroNFT.VestCategory',
            name: 'category',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'claimable',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unClaimed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'penalty',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isFrozen',
            type: 'bool',
          },
        ],
        internalType: 'struct VestedZeroUiHelper.VestDetails[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vestedZeroNFT',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_omnichainStakingToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_omnichainStakingLP',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
