// CCTP Domain IDs
export const CCTP_DOMAINS = {
  arbitrum: 3,
  base: 6,
} as const;

// CCTP Contract Addresses
export const CCTP_CONTRACTS = {
  [CCTP_DOMAINS.arbitrum]: {
    tokenMessenger: "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d",
    messageTransmitter: "0x19330d10d9cc8751218eaf51e8885d058642e08a",
    usdc: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  },
  [CCTP_DOMAINS.base]: {
    tokenMessenger: "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d",
    messageTransmitter: "0x1682ae6375c4e4a97e4b583bc394c861a46d8962",
    usdc: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  },
} as const;

// CCTP Token Messenger ABI
export const TOKEN_MESSENGER_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "destinationDomain",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "mintRecipient",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "burnToken",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "destinationCaller",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "maxFee",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "minFinalityThreshold",
        type: "uint32",
      },
    ],
    name: "depositForBurn",
    outputs: [
      {
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// CCTP Message Transmitter ABI
export const MESSAGE_TRANSMITTER_ABI = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
    ],
    name: "receiveMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Helper function to get domain ID for a chain
export function getDomainId(chainId: number): number {
  switch (chainId) {
    case 42161: // Arbitrum One
      return CCTP_DOMAINS.arbitrum;
    case 8453: // Base
      return CCTP_DOMAINS.base;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

// Constants for transfer
export const MAX_FEE = 500n; // 0.0005 USDC
export const MIN_FINALITY_THRESHOLD = 1000; // For Fast Transfer
export const DESTINATION_CALLER =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
