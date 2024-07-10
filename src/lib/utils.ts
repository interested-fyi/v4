import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { HubRestAPIClient } from "@standard-crypto/farcaster-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const privyClient = new HubRestAPIClient({
  hubUrl: "https://hub.farcaster.standardcrypto.vc:2281",
});
