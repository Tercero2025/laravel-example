import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/usePermission';
import { type BreadcrumbItem, type Permission } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

// Ya se importa automáticamente desde @/types

export default function Permissions({ permissions = [] }: { permissions?: Permission[] }) {
    const { hasPermission } = usePermission();
    
    const handleDelete = (permission: Permission) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete the permission "${permission.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/permissions/${permission.id}`);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Permissions</h1>
                    {hasPermission('create_permission') && (
                        <Link href="/permissions/create">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                New Permission
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Endpoint</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {permissions?.map((permission) => (
                                <TableRow key={permission.id}>
                                    <TableCell>{permission.name}</TableCell>
                                    <TableCell>{permission.endpoint}</TableCell>
                                    <TableCell>{permission.method}</TableCell>
                                    <TableCell>{permission.description}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {hasPermission('edit_permission') && (
                                                <Link href={`/permissions/${permission.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                            {hasPermission('delete_permission') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(permission)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
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
