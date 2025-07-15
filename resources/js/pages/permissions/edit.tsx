import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
    {
        title: 'Edit Permission',
        href: '/permissions/edit',
    },
];

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

// Ya se importa desde @/types

export default function EditPermission({ permission }: { permission: Permission }) {
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
        endpoint: permission.endpoint,
        method: permission.method,
        description: permission.description
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/permissions/${permission.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Permission" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Permission</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endpoint">Endpoint</Label>
                                <Input
                                    id="endpoint"
                                    value={data.endpoint}
                                    onChange={e => setData('endpoint', e.target.value)}
                                    placeholder="/api/resource"
                                />
                                <InputError message={errors.endpoint} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="method">HTTP Method</Label>
                                <Select 
                                    defaultValue={data.method}
                                    onValueChange={(value) => setData('method', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select HTTP method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HTTP_METHODS.map(method => (
                                            <SelectItem key={method} value={method}>
                                                {method}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.method} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/permissions">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                Update Permission
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
