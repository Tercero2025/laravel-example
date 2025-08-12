import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/usePermission';
import { PermissionsByGroup } from '@/components/permissions/PermissionsByGroup';
import { type BreadcrumbItem, type Permission, type Role } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShieldIcon, UsersIcon, KeyIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles Permissions',
        href: '/roles-permissions',
    },
];

interface ExtendedRole extends Role {
    permissions_by_group: Array<{
        group_name: string;
        permissions: Permission[];
    }>;
}

export default function RolesPermissions({ roles = [] }: { roles?: ExtendedRole[] }) {
    const { hasPermission } = usePermission();
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Permissions" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestión de Roles y Permisos</h1>
                        <p className="text-muted-foreground">
                            Administra los permisos asignados a cada rol del sistema
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <UsersIcon className="h-3 w-3" />
                            {roles?.length || 0} roles
                        </Badge>
                    </div>
                </div>

                {/* Grid de roles */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {roles?.map((role) => (
                        <Card key={role.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <ShieldIcon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{role.name}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {role.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <KeyIcon className="h-3 w-3" />
                                            {role.permissions?.length || 0} permisos
                                        </Badge>
                                        {hasPermission('edit_role_permissions') && (
                                            <Link href={`/roles-permissions/${role.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <ShieldIcon className="h-4 w-4 mr-1" />
                                                    Editar Permisos
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {role.permissions_by_group && role.permissions_by_group.length > 0 ? (
                                    <PermissionsByGroup 
                                        permissionsByGroup={role.permissions_by_group} 
                                        compact={true}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                                        <div className="text-center">
                                            <KeyIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No hay permisos asignados</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Fallback si no hay roles */}
                {(!roles || roles.length === 0) && (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <UsersIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">No hay roles configurados</h3>
                                <p className="text-muted-foreground mb-4">
                                    Comienza creando roles para organizar los permisos del sistema
                                </p>
                                <Link href="/roles/create">
                                    <Button>
                                        <UsersIcon className="h-4 w-4 mr-2" />
                                        Crear Primer Rol
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
