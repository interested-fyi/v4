export async function updateGithubUser(
  privy_did: string,
  email: string | null | undefined,
  name: string | null | undefined,
  username: string | null | undefined,
  subject: string | null | undefined,
  accessToken: string
) {
  const res = await fetch(`/api/users/linking/github`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      privy_did: privy_did,
      email: email,
      name: name,
      username: username,
      subject: subject,
    }),
  });
}

export async function updateFarcasterUser(
  privy_did: string,
  fid: number | null | undefined,
  username: string | null | undefined,
  displayName: string | null | undefined,
  pfp: string | null | undefined,
  url: string | null | undefined,
  ownerAddress: string | null | undefined,
  bio: string | null | undefined,
  accessToken: string
) {
  const res = await fetch(`/api/users/linking/farcaster`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      privy_did: privy_did,
      fid: fid,
      username: username,
      display_name: displayName,
      pfp: pfp,
      url: url,
      owner_address: ownerAddress,
      bio: bio,
    }),
  });
}

export async function updateLinkedInUser(
  privy_did: string,
  email: string | null | undefined,
  name: string | null | undefined,
  vanityName: string | null | undefined,
  subject: string | null | undefined,
  accessToken: string
) {
  const res = await fetch(`/api/users/linking/linkedin`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      privy_did: privy_did,
      email: email,
      name: name,
      vanity_name: vanityName,
      subject: subject,
    }),
  });
}

export async function updateTelegramUser(
  privy_did: string,
  telegram_user_id: string | null | undefined,
  username: string | null | undefined,
  photo_url: string | null | undefined,
  first_name: string | null | undefined,
  last_name: string | null | undefined,
  accessToken: string
) {
  const res = await fetch(`/api/users/linking/telegram`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      privy_did: privy_did,
      telegram_user_id: telegram_user_id,
      username: username,
      photo_url: photo_url,
      first_name: first_name,
      last_name: last_name,
    }),
  });
}

export async function updateTwitterUser(
  privy_did: string,
  name: string | null | undefined,
  username: string | null | undefined,
  profile_picture_url: string | null | undefined,
  subject: string | null | undefined,
  accessToken: string
) {
  const res = await fetch(`/api/users/linking/x`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      privy_did: privy_did,
      name: name,
      username: username,
      profile_picture_url: profile_picture_url,
      subject: subject,
    }),
  });
}

export async function updateWalletUser(
  privy_did: string,
  wallet_address: string | null | undefined,
  accessToken: string
) {
  const res = await fetch(`/api/users/linking/wallet`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      privy_did: privy_did,
      wallet_address: [wallet_address],
    }),
  });
}
