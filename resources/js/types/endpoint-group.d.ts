import { Permission } from './permission.d';

export interface EndpointGroup {
    id: number;
    name: string;
    base_path: string;
    display_name: string;
    description?: string;
    is_active: boolean;
    full_path: string;
    permissions?: Permission[];
    permissions_count?: number;
    permissions_by_action?: Record<string, Permission[]>;
}
