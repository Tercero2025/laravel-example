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
        razonsocial: '',
        cuit: '',
        domicilio: '',
        localidad: '',
        telefono: '',
        mail: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('clients.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Cliente" />

            <section className='w-full flex justify-center'>
                <div className="flex flex-col gap-4 rounded-xl p-4 max-w-2xl w-full text-sidebar-foreground">
                    <div className="flex items-center justify-center border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-4">
                        <h1 className="text-xl font-semibold">Nuevo Cliente</h1>
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cuit">CUIT</Label>
                                    <Input
                                        id="cuit"
                                        value={data.cuit}
                                        onChange={e => {
                                            const regex = /^[0-9]*$/; // Solo números
                                            if (regex.test(e.target.value)) {
                                                setData('cuit', e.target.value);
                                            }
                                        }}
                                        maxLength={11}
                                        placeholder='Ingrese CUIT sin guiones ni espacios'
                                        className='max-w-[8em] mt-2'
                                    />
                                    <InputError message={errors.cuit} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="razonsocial">Razón Social</Label>
                                    <Input
                                        id="razonsocial"
                                        value={data.razonsocial}
                                        onChange={e => setData('razonsocial', e.target.value)}
                                        className='uppercase max-w-xl mt-2'
                                        maxLength={50}
                                    />
                                    <InputError message={errors.razonsocial} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="domicilio">Domicilio</Label>
                                    <Input
                                        id="domicilio"
                                        value={data.domicilio}
                                        onChange={e => setData('domicilio', e.target.value)}
                                        className='uppercase max-w-xl mt-2'
                                        maxLength={50}
                                    />
                                    <InputError message={errors.domicilio} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="localidad">Localidad</Label>
                                    <Input
                                        id="localidad"
                                        value={data.localidad}
                                        onChange={e => setData('localidad', e.target.value)}
                                        className='uppercase max-w-xl mt-2'
                                        maxLength={45}
                                    />
                                    <InputError message={errors.localidad} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        value={data.telefono}
                                        onChange={e => {
                                            const regex = /^[0-9+]*$/; // Solo números y +
                                            if (regex.test(e.target.value)) {
                                                setData('telefono', e.target.value);
                                            }
                                        }}
                                        className='max-w-[12em] mt-2'
                                        maxLength={15}
                                    />
                                    <InputError message={errors.telefono} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail">E-Mail</Label>
                                    <Input
                                        id="mail"
                                        value={data.mail}
                                        onChange={e => setData('mail', e.target.value)}
                                        className='uppercase max-w-xl mt-2'
                                        type="email"
                                        maxLength={45}
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
                                    Aceptar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
