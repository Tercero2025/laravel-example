export interface Client {
    id: number;
    name: string;
    fullname: string;
    cuit: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
}
