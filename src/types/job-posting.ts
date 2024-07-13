export default interface JobPosting {
    id?: number;
    created_at?: Date;
    company_id?: number;
    department: string;
    sub_department?: string;
    type?: string;
    role_title?: string;
    location: string;
    posting_url: string;
    active?: boolean;
}