import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";

const core = new Core({
  projectId: "7251b5ae0504d591ac915d0f25c7341d",
});

const metadata = {
  name: "interested-fyi",
  description: "A Web3 job board and much more",
  url: "https://www.interested.fyi/", // origin must match your domain & subdomain
  icons: ["https://www.interested.fyi/favicon.ico"],
};

export const walletKit = await WalletKit.init({
  core, // <- pass the shared 'core' instance
  metadata,
});
