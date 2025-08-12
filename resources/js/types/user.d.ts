import { Role } from './role.d';

export interface User {
    id: number;
    name: string;
    email: string;
    is_superadmin: boolean;
    role?: Role;
    avatar?: string;
}
