export default interface Candidate {
    id?: number,
    created_at?: Date,
    privy_did: string,
    accept_direct_messages: boolean,
    currently_seeking: boolean,
}