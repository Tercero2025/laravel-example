import { usePage } from '@inertiajs/react';
import type { PageProps, Permission } from '@/types';

export function usePermission() {
    const { auth } = usePage<PageProps>().props;

    const hasPermission = (permission: string): boolean => {
        if (auth.user.is_superadmin) return true;
        
        return auth.user.role?.permissions.some(
            (p: Permission) => p.name === permission
        ) ?? false;
    };

    return { hasPermission };
}
