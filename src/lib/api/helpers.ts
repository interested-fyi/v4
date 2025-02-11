import { SortOption } from "@/app/explore-talent/page";
import {
  UserCombinedProfile,
  WarpcastResponseObject,
} from "@/types/return_types";

// lib/api/fetchTalent.ts
export async function fetchTalent({
  filter,
  limit,
  page,
  sort,
}: {
  filter?: string;
  limit?: number;
  page?: number;
  sort?: SortOption;
}) {
  let query = "";
  if (filter) {
    query = `filter=${filter}`;
  }
  if (page) {
    query = `${query}&page=${page}`;
  }
  if (limit) {
    query = `${query}&limit=${limit}`;
  }
  if (sort) {
    query = `${query}&sortField=${sort.field}&sortDirection=${sort.direction}`;
  }

  const response = await fetch(`/api/talent/get-all-talent?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchUserProfile({
  userId,
  accessToken,
}: {
  userId: string | undefined;
  accessToken?: string | null;
}) {
  if (!userId) throw new Error("User ID is required");

  let headers;

  if (accessToken) {
    headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
  } else {
    headers = {
      "Content-type": "application/json",
    };
  }

  const cleanUserId = userId.replace("did:privy:", "");
  const res = await fetch(`/api/users/${cleanUserId}`, {
    method: "GET",
    cache: "no-store",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return (await res.json()) as {
    success: boolean;
    profile: UserCombinedProfile;
  };
}

export async function fetchUserFarcasterActivity({
  fid,
}: {
  fid: string | undefined;
}) {
  if (!fid) throw new Error("User ID is required");

  let headers;

  headers = {
    "Content-type": "application/json",
  };

  const res = await fetch(`/api/farcaster/get-cast-by-fid?fid=${fid}`, {
    method: "GET",
    cache: "no-store",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user warpcast activity");
  }

  return (await res.json()) as {
    messages: WarpcastResponseObject[];
    nextPageToken: string;
  };
}

export async function fetchGitHubActivity(username: string) {
  const response = await fetch(
    `/api/github/get-github-activity?username=${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch activity");
  return response.json();
}

export async function fetchEthAddresses(fids: number[]) {
  const response = await fetch(
    `/api/farcaster/get-connected-eth-wallets?fid=${fids.join(",")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch eth addresses");
  return response.json();
}

export async function fetchXTimeline(username: string) {
  const response = await fetch(
    `/api/twitter/get-user-timeline?username=${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch activity");
  return response.json();
}
