import { encodeAbiParameters, encodeFunctionData } from 'viem';

/**
 * Encodes the creation parameters for an Asset variant.
 */
export function encodeAssetCreateParams(name: string, symbol: string, decimals: number): `0x${string}` {
  return encodeAbiParameters(
    [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'decimals', type: 'uint8' }
    ],
    [name, symbol, decimals]
  );
}

/**
 * Encodes the creation parameters for a Stablecoin variant.
 */
export function encodeStablecoinCreateParams(name: string, symbol: string, decimals: number): `0x${string}` {
  return encodeAbiParameters(
    [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'decimals', type: 'uint8' }
    ],
    [name, symbol, decimals]
  );
}

/**
 * Encodes a grantRole(bytes32,address) call.
 */
export function encodeGrantRole(role: `0x${string}`, account: `0x${string}`): `0x${string}` {
  return encodeFunctionData({
    abi: [
      {
        name: 'grantRole',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'role', type: 'bytes32' },
          { name: 'account', type: 'address' }
        ],
        outputs: []
      }
    ],
    functionName: 'grantRole',
    args: [role, account]
  });
}

/**
 * Encodes an updateSupplyCap(uint256) call.
 */
export function encodeUpdateSupplyCap(newCap: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: [
      {
        name: 'updateSupplyCap',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'newCap', type: 'uint256' }
        ],
        outputs: []
      }
    ],
    functionName: 'updateSupplyCap',
    args: [newCap]
  });
}

/**
 * Encodes a mint(address,uint256) call.
 */
export function encodeMint(to: `0x${string}`, amount: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: []
      }
    ],
    functionName: 'mint',
    args: [to, amount]
  });
}
