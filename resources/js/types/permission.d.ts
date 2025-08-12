import { EndpointGroup } from './endpoint-group.d';

export interface Permission {
    id: number;
    name: string;
    // Campos de la nueva estructura
    endpoint_group_id?: number;
    action?: string;
    sub_path?: string;
    allowed_methods?: string[];
    full_endpoint?: string;
    endpoint_group?: EndpointGroup;
    
    // Campos legacy para compatibilidad
    endpoint?: string;
    method?: string;
    description?: string;
}
