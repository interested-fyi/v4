import { createPublicClient, http } from "viem";
import { optimism, optimismSepolia } from "viem/chains";

export const publicClient = createPublicClient({
    chain: process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? optimismSepolia : optimism,
    transport: http()
  })