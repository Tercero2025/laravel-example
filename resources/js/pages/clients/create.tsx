import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients',
    },
    {
        title: 'Create Client',
        href: '/clients/create',
    },
];

export default function CreateClient() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        fullname: '',
        cuit: '',
        address: '',
        city: '',
        state: '',
        country: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('clients.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Create Client</h1>
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
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    id="fullname"
                                    value={data.fullname}
                                    onChange={e => setData('fullname', e.target.value)}
                                />
                                <InputError message={errors.fullname} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cuit">CUIT</Label>
                                <Input
                                    id="cuit"
                                    value={data.cuit}
                                    onChange={e => setData('cuit', e.target.value)}
                                />
                                <InputError message={errors.cuit} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={data.city}
                                    onChange={e => setData('city', e.target.value)}
                                />
                                <InputError message={errors.city} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href={route('clients.index')}>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                Create Client
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
