import { Contract, ContractFactory, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class StakingProviderFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  connect(signer: Signer): StakingProviderFactory {
    return super.connect(signer) as StakingProviderFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Contract {
    return new Contract(address, _abi, signerOrProvider);
  }
}

const _abi = [
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'earlyZERO',
    outputs: [
      {
        internalType: 'contract IERC20Burnable',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'enableVesting',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_earlyZERO',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_vesting',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_stakingBonus',
        type: 'address',
      },
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'spent',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakingBonus',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'stake',
        type: 'bool',
      },
    ],
    name: 'startVesting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'toggleVesting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vesting',
    outputs: [
      {
        internalType: 'contract IVestedZeroNFT',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const _bytecode =
  '0x608060405234801561001057600080fd5b50610c21806100206000396000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c8063715018a6116100815780638da5cb5b1161005b5780638da5cb5b146101a4578063f2fde38b146101e1578063fdb1dc1b146101f457600080fd5b8063715018a6146101725780637ab71b7a1461017a57806389b25ccf1461019157600080fd5b80632ca079da116100b25780632ca079da1461012d57806344c63eec146101355780635b904cb71461015557600080fd5b80630aede156146100ce578063184b955914610118575b600080fd5b6002546100ee9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b61012b61012636600461096f565b610214565b005b61012b610420565b6001546100ee9073ffffffffffffffffffffffffffffffffffffffff1681565b6004546101629060ff1681565b604051901515815260200161010f565b61012b61045a565b61018360035481565b60405190815260200161010f565b61012b61019f3660046109b2565b61046e565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005473ffffffffffffffffffffffffffffffffffffffff166100ee565b61012b6101ef3660046109e7565b61073e565b6000546100ee9073ffffffffffffffffffffffffffffffffffffffff1681565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff1660008115801561025f5750825b905060008267ffffffffffffffff16600114801561027c5750303b155b90508115801561028a575080155b156102c1576040517ff92ee8a900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b84547fffffffffffffffffffffffffffffffffffffffffffffffff000000000000000016600117855583156103225784547fffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffffffff16680100000000000000001785555b61032b336107a2565b6000805473ffffffffffffffffffffffffffffffffffffffff808b167fffffffffffffffffffffffff000000000000000000000000000000000000000092831617909255600180548a84169083161790556002805492891692909116919091179055600480547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905583156104165784547fffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffffffff168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b5050505050505050565b6104286107b3565b600480547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00811660ff90911615179055565b6104626107b3565b61046c6000610841565b565b60045460ff168061047c5750805b61050d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f76657374696e67206e6f7420656e61626c65643b207374616b696e67206f6e6c60448201527f790000000000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6000546040517f79cc67900000000000000000000000000000000000000000000000000000000081523360048201526024810184905273ffffffffffffffffffffffffffffffffffffffff909116906379cc679090604401600060405180830381600087803b15801561057f57600080fd5b505af1158015610593573d6000803e3d6000fd5b50506001546000925073ffffffffffffffffffffffffffffffffffffffff16905063d9e2f2d4836105c457336105c6565b305b60646105d387604b610a38565b6105dd9190610a55565b60646105ea886019610a38565b6105f49190610a55565b6276a70062278d0042600060016040518963ffffffff1660e01b8152600401610624989796959493929190610a90565b6020604051808303816000875af1158015610643573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106679190610b22565b905081156107225760018054600254604080516020810194909452338482015280518085038201815260608501918290527fb88d4fde0000000000000000000000000000000000000000000000000000000090915273ffffffffffffffffffffffffffffffffffffffff9283169363b88d4fde936106ef933093911691879190606401610b3b565b600060405180830381600087803b15801561070957600080fd5b505af115801561071d573d6000803e3d6000fd5b505050505b82600360008282546107349190610bd8565b9091555050505050565b6107466107b3565b73ffffffffffffffffffffffffffffffffffffffff8116610796576040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260006004820152602401610504565b61079f81610841565b50565b6107aa6108d7565b61079f8161093e565b336107f27f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005473ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff161461046c576040517f118cdaa7000000000000000000000000000000000000000000000000000000008152336004820152602401610504565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080547fffffffffffffffffffffffff0000000000000000000000000000000000000000811673ffffffffffffffffffffffffffffffffffffffff848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff1661046c576040517fd7e6bcf800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6107466108d7565b803573ffffffffffffffffffffffffffffffffffffffff8116811461096a57600080fd5b919050565b60008060006060848603121561098457600080fd5b61098d84610946565b925061099b60208501610946565b91506109a960408501610946565b90509250925092565b600080604083850312156109c557600080fd5b82359150602083013580151581146109dc57600080fd5b809150509250929050565b6000602082840312156109f957600080fd5b610a0282610946565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8082028115828204841417610a4f57610a4f610a09565b92915050565b600082610a8b577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b60006101008201905073ffffffffffffffffffffffffffffffffffffffff8a1682528860208301528760408301528660608301528560808301528460a083015283151560c083015260048310610b0f577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8260e08301529998505050505050505050565b600060208284031215610b3457600080fd5b5051919050565b600073ffffffffffffffffffffffffffffffffffffffff8087168352602081871681850152856040850152608060608501528451915081608085015260005b82811015610b965785810182015185820160a001528101610b7a565b5050600060a0828501015260a07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011684010191505095945050505050565b80820180821115610a4f57610a4f610a0956fea264697066735822122096f1b3f02385179085b2a48261266714b96c811a16d5eb3efc4bd1c178420f8f64736f6c63430008140033';
