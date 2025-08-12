import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role, type User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit User',
        href: '/users/edit',
    },
];

interface ExtendedUser extends User {
    role?: Role;
}

export default function EditUser({ user, roles }: { user: ExtendedUser; roles: Role[] }) {
    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        email: string;
        password: string | null;
        role_id: string;
    }>({
        name: user.name,
        email: user.email,
        password: null,
        role_id: user.role?.id ? user.role.id.toString() : ''
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit User: {user.name}</h1>
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
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password (leave empty to keep current)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password || ''}
                                    onChange={e => setData('password', e.target.value || null)}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select 
                                    value={data.role_id} 
                                    onValueChange={value => setData('role_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role_id} />
                            </div>
                            
                            {/* Super Admin checkbox removed - cannot change super admin status */}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href={route('users.index')}>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                Update User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
