export default interface Candidate {
  id?: number;
  created_at?: Date;
  privy_did: string;
  joined_telegram: boolean;
  currently_seeking: boolean;
}
