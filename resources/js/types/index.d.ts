import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { Page } from '@inertiajs/core';

// Importar para uso interno
export type { Auth } from './auth.d';
export type { Permission } from './permission.d';
export type { Role } from './role.d';
export type { User } from './user.d';
export type { EndpointGroup } from './endpoint-group.d';

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    subItems?: {
        title: string;
        href: string;
    }[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}




export interface InertiaPageProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export type PageProps = InertiaPageProps;