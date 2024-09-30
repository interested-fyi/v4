import { createPublicClient, http } from "viem";
import { optimism, optimismSepolia } from "viem/chains";

export const publicClient = createPublicClient({
    chain: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? optimismSepolia : optimism,
    transport: http()
  })