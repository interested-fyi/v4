import { createPublicClient, http } from "viem";
import { optimism, optimismSepolia } from "viem/chains";

export const publicClient = createPublicClient({
    chain: process.env.NODE_ENV !== "production" ? optimismSepolia : optimism,
    transport: http()
  })