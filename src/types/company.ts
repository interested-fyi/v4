export default interface Company {
  id?: number;
  created_at?: Date;
  company_name: string;
  careers_page_url: string;
  creator_email: string;
  creator_privy_did: string;
  recruiting_help?: boolean;
  host_bounty?: boolean;
  telegram_handle?: string;
  approved?: boolean;
}
