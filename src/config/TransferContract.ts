export const TransferContract = "0x489A22D1ba1a4f34eb7262E41dd4BDF90Fb685fB";

export const TransferContractABI = [
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "DECIMALS",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "IDRX_TOKEN",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "totalAmount", type: "uint256" },
    ],
    name: "splitTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
