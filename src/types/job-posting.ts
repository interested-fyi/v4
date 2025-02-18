export default interface JobPosting {
  id?: number;
  created_at?: string; // Changed from Date to string
  company_id?: number;
  companies?: { company_name: string }; // Matches the nested structure
  department: string;
  sub_department?: string;
  type?: string;
  role_title?: string;
  location: string;
  posting_url: string;
  job_attestations?: {
    attestation_uid?: string;
    attestation_tx_hash?: string;
    created_at?: string;
  }[];
  active?: boolean;
  data?: any;
}
