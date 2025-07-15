import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission, type Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Management',
        href: '/roles-management',
    },
    {
        title: 'Edit Permissions',
        href: '/roles-management/edit',
    },
];

// Ya se importan desde @/types

export default function EditRolePermissions({ role, allPermissions }: { role: Role; allPermissions: Permission[] }) {
    const { data, setData, put, processing, errors } = useForm({
        permissions: role.permissions.map((p: Permission) => p.id)
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/roles-permissions/${role.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Permissions - ${role.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Permissions for {role.name}</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                {allPermissions.map(permission => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={data.permissions.includes(permission.id)}
                                            onCheckedChange={(checked) => {
                                                setData('permissions', checked
                                                    ? [...data.permissions, permission.id]
                                                    : data.permissions.filter((id: number) => id !== permission.id)
                                                );
                                            }}
                                        />
                                        <Label htmlFor={`permission-${permission.id}`} className="flex flex-col">
                                            <span>{permission.name}</span>
                                            <span className="text-xs text-gray-500">{permission.description}</span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.permissions} />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/roles-permissions">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                Update Permissions
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
