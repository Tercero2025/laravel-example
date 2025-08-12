export interface ClientsPageProps {
    clients: Paginated<import('./clients').Client> & {
        links: PaginationLink[];
    };
}

export interface TpDocumentoPageProps {
    tpDocumentos: Paginated<import('./tpdocumento').TpDocumento> & {
        links: PaginationLink[];
    };
    filters?: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
    };
}

export interface TpGranoPageProps {
    tpGranos: Paginated<import('./tpgrano').TpGrano> & {
        links: PaginationLink[];
    };
    filters?: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
    };
}

export interface TmonedaPageProps {
    tmonedas: Paginated<import('./tmoneda').Tmoneda> & {
        links: PaginationLink[];
    };
    filters?: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
    };
}

export interface TactoPageProps {
    tactos: Paginated<import('./tacto').Tacto> & {
        links: PaginationLink[];
    };
    filters?: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
    };
}

export interface TsubactoPageProps {
    tsubactos: Paginated<import('./tsubacto').Tsubacto> & {
        links: PaginationLink[];
    };
    filters?: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
    };
}

// Puedes agregar más interfaces comunes aquí que sean utilizadas en varios componentes
// Por ejemplo:
// export interface ApiResponse<T> {
//     data: T;
//     message?: string;
//     status: number;
// }

import { PaginationLink, Paginated } from './pagination';
