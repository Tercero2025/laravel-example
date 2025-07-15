import { Permission } from './permission.d';

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
}
