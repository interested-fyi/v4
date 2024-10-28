export interface UserCombinedProfile {
  privy_did: string | null;
  name: string | null;
  photo_source: string | null;
  preferred_profile: string | null;
  available: boolean | null;
  position: string[] | null;
  employment_type: string[] | null;
  bio: string | null;
  booking_description: string | null;
  smart_wallet_address: string | null;
  unlock_calendar_fee: string | null;
  calendly_link: string | null;
  email: string | null;
  github_username: string | null;
  farcaster_fid: number | null;
  farcaster_username: string | null;
  farcaster_name: string | null;
  farcaster_bio: string | null;
  farcaster_photo: string | null;
  farcaster_address: string | null;
  linkedin_name: string | null;
  telegram_user_id: string | null;
  telegram_username: string | null;
  telegram_photo: string | null;
  x_username: string | null;
  x_photo: string | null;
}

interface Embed {
  url: string;
}

interface CastAddBody {
  embedsDeprecated: any[]; // Use a more specific type if you know what the deprecated embeds look like
  mentions: number[];
  parentUrl: string;
  text: string;
  mentionsPositions: number[];
  embeds: Embed[];
  type: string; // Consider making this a literal type if "CAST" is the only possible value
}

interface MessageData {
  type: string; // e.g., "MESSAGE_TYPE_CAST_ADD"
  fid: number;
  timestamp: number;
  network: string; // e.g., "FARCASTER_NETWORK_MAINNET"
  castAddBody: CastAddBody;
}

export interface WarpcastResponseObject {
  data: MessageData;
  hash: string;
  hashScheme: string; // e.g., "HASH_SCHEME_BLAKE3"
  signature: string;
  signatureScheme: string; // e.g., "SIGNATURE_SCHEME_ED25519"
  signer: string;
}
