export default interface JobPosting {
  id?: number;
  created_at?: Date;
  company_id?: number;
  company_name?: string;
  department: string;
  sub_department?: string;
  type?: string;
  role_title?: string;
  location: string;
  posting_url: string;
  job_attestations?: {
    attestation_uid?: string;
    attestation_tx_hash?: string;
  }[];
  active?: boolean;
  data?: any;
}
