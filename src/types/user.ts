export default interface User {
    id?: number,
    created_at?: Date,
    privy_did: string,
    fid: number,
    email?: string,
    username?: string,
    is_admin: boolean,
}