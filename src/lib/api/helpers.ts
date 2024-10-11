import { UserCombinedProfile } from "@/types/return_types";

// lib/api/fetchTalent.ts
export async function fetchTalent() {
  const response = await fetch("/api/talent/get-all-talent");
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
