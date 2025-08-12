import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/usePermission';
import { type BreadcrumbItem, type User } from '@/types';
import { type Role } from '@/types/role';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, PrinterIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import AppPaginate from '@/components/app-paginate';
import AppSearch from '@/components/app-search';
import { Paginated, PaginationLink } from '@/types/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface UsersPageProps {
    users: Paginated<User> & {
        links: PaginationLink[];
    };
}

export default function Users({ users }: UsersPageProps) {
    const { hasPermission } = usePermission();
    
    // Verificar si el usuario tiene alguno de los permisos para mostrar la columna de acciones
    const showActionsColumn = hasPermission('update_user') || hasPermission('delete_user');
    
    const handleDelete = (user: User) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el usuario "${user.name}"?`,
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
                router.delete(route('users.destroy', user.id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Eliminado!',
                            text: 'El usuario ha sido eliminado.',
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
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Usuarios</h1>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <AppSearch
                            routeName="users.index"
                            placeholder="Buscar por name or email"
                            className="w-1.5 sm:w-auto"
                        />
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <Button
                                variant="print"
                                onClick={() => window.open(route('users.pdf'), '_blank')}
                            >
                                <PrinterIcon className="md:mr-2 h-4 w-4" />
                                <span className="hidden md:block">
                                    Imprimir PDF
                                </span>
                            </Button>
                            {hasPermission('create_user') && (
                                <Link href={route('users.create')}>
                                    <Button>
                                        <PlusIcon className="md:mr-2 h-4 w-4" />
                                        <span className="hidden md:block">
                                            Nuevo Usuario
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
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Nombre Completo</TableHead>
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Email</TableHead>
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Role</TableHead>
                                    <TableHead className="font-bold dark:bg-white dark:text-black">Estado</TableHead>
                                    {showActionsColumn && (
                                        <TableHead className="font-bold w-[100px] dark:bg-white dark:text-black">Aciones</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user: User) => (
                                    <TableRow 
                                        key={user.id}
                                        className="border-sidebar-border/70 dark:border-gray-600 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        <TableCell className="font-medium dark:text-white">{user.name}</TableCell>
                                        <TableCell className="dark:text-white">{user.email}</TableCell>
                                        <TableCell className="dark:text-white">{user.role?.name || 'No Role'}</TableCell>
                                        <TableCell className="dark:text-white">
                                            {user.role?.name === 'admin' || user.is_superadmin ? (
                                                <Badge variant="destructive">Administrador</Badge>
                                            ) : (
                                                <Badge variant="outline">Usuario Simple</Badge>
                                            )}
                                        </TableCell>
                                        {showActionsColumn && (
                                            <TableCell className="p-2 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    {hasPermission('update_user') && (
                                                        <Link href={route('users.edit', user.id)}>
                                                            <Button
                                                                variant="constructive"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {hasPermission('delete_user') && !user.is_superadmin && (
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleDelete(user)}
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
                        <AppPaginate links={users.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
