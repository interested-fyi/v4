import { User } from "@privy-io/react-auth";

export const fetchFollowStatus = async (user: User | null) => {
  if (!user || !process.env.NEXT_PUBLIC_INTERESTED_FYI_FID)
    throw new Error("Missing required parameters");
  return await fetch(
    `/api/farcaster/follow?fid=${user?.farcaster?.fid ?? ""}&viewer_fid=${
      process.env.NEXT_PUBLIC_INTERESTED_FYI_FID
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());
};
