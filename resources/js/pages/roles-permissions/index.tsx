import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/usePermission';
import { type BreadcrumbItem, type Permission, type Role } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShieldIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles Permissions',
        href: '/roles-permissions',
    },
];

// Ya se importan automáticamente desde @/types

export default function RolesPermissions({ roles = [] }: { roles?: Role[] }) {
    const { hasPermission } = usePermission();
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Roles Permissions Management</h1>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Current Permissions</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles?.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{role.name}</TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell>{role.permissions.map((p: Permission) => p.name).join(', ')}</TableCell>
                                    <TableCell>
                                        {hasPermission('edit_role_permissions') && (
                                            <Link href={`/roles-permissions/${role.id}/edit`}>
                                                <Button variant="ghost" size="icon">
                                                    <ShieldIcon className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
