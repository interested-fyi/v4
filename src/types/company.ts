export default interface Company {
    id?: number,
    created_at?: Date,
    company_name: string,
    careers_page_url: string,
    creator_fid: number,
    creator_email: string,
    creator_privy_did: string,
    approved?: boolean,
}