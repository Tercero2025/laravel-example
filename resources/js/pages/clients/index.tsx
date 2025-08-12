import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, PrinterIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { usePermission } from '@/hooks/usePermission';
import AppPaginate from '@/components/app-paginate';
import AppSearch from '@/components/app-search';
import { Client } from '@/types/clients';
import { ClientsPageProps } from '@/types/common';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients',
    },
];

export default function Clients({ clients }: ClientsPageProps) {
    const { hasPermission } = usePermission();
    
    // Verificar si el usuario tiene alguno de los permisos para mostrar la columna de acciones
    const showActionsColumn = hasPermission('clients.edit') || hasPermission('clients.delete');

    const handleDelete = (client: Client) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el cliente "${client.razonsocial}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            backdrop: 'rgba(0,0,0,0.7)',
            customClass: {
                confirmButton: 'swal2-confirm-custom',
                popup: 'swal2-popup-custom',
                cancelButton: 'swal2-cancel-custom',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('clients.destroy', client.cuit), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Eliminado!',
                            text: 'El cliente ha sido eliminado.',
                            icon: 'success',
                            customClass: {
                                popup: 'swal2-popup-custom'
                            }
                        })
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Clientes</h1>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <AppSearch
                            routeName="clients.index"
                            placeholder="Buscar por razón social"
                            className="w-1.5 sm:w-auto"
                        />
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <Button
                                variant="print"
                                onClick={() => window.open(route('clients.pdf'), '_blank')}
                            >
                                <PrinterIcon className="md:mr-2 h-4 w-4" />
                                <span className="hidden md:block">
                                    Imprimir
                                </span>
                            </Button>
                            {hasPermission('clients.create') && (
                                <Link href={route('clients.create')}>
                                    <Button>
                                        <PlusIcon className="md:mr-2 h-4 w-4" />
                                        <span className="hidden md:block">
                                            Nuevo Cliente
                                        </span>
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    <div className="relative overflow-x-auto">
                        <Table className="data-table">
                            <TableHeader>
                                <TableRow className="border-sidebar-border/70 dark:border-white">
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Razón Social</TableHead>
                                    <TableHead className="font-bold dark:bg-white dark:text-black">CUIT</TableHead>
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Domicilio</TableHead>
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Localidad</TableHead>
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Teléfono</TableHead>
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Mail</TableHead>
                                    {showActionsColumn && (
                                        <TableHead className="font-bold w-[100px] dark:bg-white dark:text-black">Acciones</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.data.map((client: Client) => (
                                    <TableRow
                                        key={client.cuit}
                                        className="border-sidebar-border/70 dark:border-gray-600 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        <TableCell className="font-medium dark:text-white">{client.razonsocial}</TableCell>
                                        <TableCell className="dark:text-white">{client.cuit}</TableCell>
                                        <TableCell className="dark:text-white">{client.domicilio}</TableCell>
                                        <TableCell className="dark:text-white">{client.localidad}</TableCell>
                                        <TableCell className="dark:text-white">{client.telefono}</TableCell>
                                        <TableCell className="dark:text-white">{client.mail}</TableCell>
                                        {showActionsColumn && (
                                            <TableCell className='p-2 dark:text-white'>
                                                <div className="flex items-center gap-2">
                                                    {hasPermission('clients.edit') && (<Link href={route('clients.edit', client.cuit)}>
                                                        <Button
                                                            variant="constructive"
                                                            size="icon"
                                                            className="h-8 w-8">
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    )}
                                                    {hasPermission('clients.delete') && (
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleDelete(client)}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Paginación */}
                        <AppPaginate links={clients.links} adjacentPages={1} showFirstPages={2} showLastPages={2} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
