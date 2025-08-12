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
        title: 'Edit Client',
        href: '/clients/edit',
    },
];

interface Client {
    razonsocial: string;
    cuit: string;
    domicilio?: string;
    localidad?: string;
    telefono?: string;
    mail?: string;
}

export default function EditClient({ client }: { client: Client }) {
    const { data, setData, put, processing, errors } = useForm({
        razonsocial: client.razonsocial,
        cuit: client.cuit,
        domicilio: client.domicilio || '',
        localidad: client.localidad || '',
        telefono: client.telefono || '',
        mail: client.mail || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('clients.update', client.cuit));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Cliente" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Editar Cliente</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="cuit">CUIT</Label>
                                <Input
                                    readOnly
                                    id="cuit"
                                    value={data.cuit}
                                    onChange={e => setData('cuit', e.target.value)}
                                    />
                                <InputError message={errors.cuit} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="razonsocial">Razón Social</Label>
                                <Input
                                    id="razonsocial"
                                    value={data.razonsocial}
                                    onChange={e => setData('razonsocial', e.target.value)}
                                    className='uppercase'
                                />
                                <InputError message={errors.razonsocial} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="domicilio">Domicilio</Label>
                                <Input
                                    id="domicilio"
                                    value={data.domicilio}
                                    onChange={e => setData('domicilio', e.target.value)}
                                />
                                <InputError message={errors.domicilio} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="localidad">Localidad</Label>
                                <Input
                                    id="localidad"
                                    value={data.localidad}
                                    onChange={e => setData('localidad', e.target.value)}
                                />
                                <InputError message={errors.localidad} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={e => setData('telefono', e.target.value)}
                                />
                                <InputError message={errors.telefono} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mail">Mail</Label>
                                <Input
                                    id="mail"
                                    value={data.mail}
                                    onChange={e => setData('mail', e.target.value)}
                                />
                                <InputError message={errors.mail} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href={route('clients.index')}>
                                <Button variant="outline" type="button">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                Actualizar Cliente
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
