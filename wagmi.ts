export const VIBE_NFT_ADDRESS =
  "0x786943cC2bbC0149A71B63fA1782298E1AA82091" as const;

export const VIBE_NFT_ABI = [
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_vibeText", type: "string" },
      { name: "_emoji", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
