import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission, type Role, type EndpointGroup } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronDownIcon, ChevronRightIcon, ShieldIcon, CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles Permissions',
        href: '/roles-permissions',
    },
    {
        title: 'Edit Permissions',
        href: '/roles-permissions/edit',
    },
];

interface EditRolePermissionsProps {
    role: Role;
    endpointGroups: EndpointGroup[];
    allPermissions: Permission[];
}

const getActionColor = (action?: string): string => {
    switch (action) {
        case 'view':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'create':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'update':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case 'delete':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'pdf':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
};

export default function EditRolePermissions({ role, endpointGroups, allPermissions }: EditRolePermissionsProps) {
    const { data, setData, put, processing, errors } = useForm({
        permissions: role.permissions.map(p => p.id)
    });

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (groupName: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    const toggleGroupPermissions = (groupPermissions: Permission[], checked: boolean) => {
        const groupPermissionIds = groupPermissions.map(p => p.id);
        
        if (checked) {
            // Agregar todos los permisos del grupo
            const newPermissions = [...new Set([...data.permissions, ...groupPermissionIds])];
            setData('permissions', newPermissions);
        } else {
            // Remover todos los permisos del grupo
            const newPermissions = data.permissions.filter(id => !groupPermissionIds.includes(id));
            setData('permissions', newPermissions);
        }
    };

    const isGroupFullySelected = (groupPermissions: Permission[]): boolean => {
        return groupPermissions.every(p => data.permissions.includes(p.id));
    };

    const isGroupPartiallySelected = (groupPermissions: Permission[]): boolean => {
        return groupPermissions.some(p => data.permissions.includes(p.id)) && 
               !groupPermissions.every(p => data.permissions.includes(p.id));
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/roles-permissions/${role.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Permissions - ${role.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Editar Permisos</h1>
                        <p className="text-muted-foreground">
                            Configura los permisos para el rol: <strong>{role.name}</strong>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <ShieldIcon className="h-3 w-3" />
                            {data.permissions.length} permisos seleccionados
                        </Badge>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Permisos agrupados */}
                    <div className="space-y-4">
                        {endpointGroups.map((group) => {
                            const groupPermissions = group.permissions || [];
                            const isFullySelected = isGroupFullySelected(groupPermissions);
                            const isPartiallySelected = isGroupPartiallySelected(groupPermissions);
                            
                            return (
                                <Card key={group.id}>
                                    <Collapsible
                                        open={openGroups[group.name]}
                                        onOpenChange={() => toggleGroup(group.name)}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={isFullySelected || isPartiallySelected}
                                                            onCheckedChange={(checked) => 
                                                                toggleGroupPermissions(groupPermissions, checked as boolean)
                                                            }
                                                            className="scale-110"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <div>
                                                            <CardTitle className="text-lg flex items-center gap-2">
                                                                {group.display_name}
                                                                {isFullySelected && (
                                                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                                                )}
                                                                {isPartiallySelected && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Parcial
                                                                    </Badge>
                                                                )}
                                                            </CardTitle>
                                                            <CardDescription className="flex items-center gap-2">
                                                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                                                    {group.base_path}
                                                                </code>
                                                                <span>{group.description}</span>
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {groupPermissions.length} permisos
                                                        </Badge>
                                                        {openGroups[group.name] ? (
                                                            <ChevronDownIcon className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRightIcon className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0">
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {groupPermissions.map((permission) => (
                                                        <div
                                                            key={permission.id}
                                                            className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20"
                                                        >
                                                            <Checkbox
                                                                id={`permission-${permission.id}`}
                                                                checked={data.permissions.includes(permission.id)}
                                                                onCheckedChange={(checked) => {
                                                                    setData('permissions', checked
                                                                        ? [...data.permissions, permission.id]
                                                                        : data.permissions.filter(id => id !== permission.id)
                                                                    );
                                                                }}
                                                                className="mt-1"
                                                            />
                                                            <Label 
                                                                htmlFor={`permission-${permission.id}`} 
                                                                className="flex-1 cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Badge className={`text-xs ${getActionColor(permission.action)}`}>
                                                                        {permission.action || 'legacy'}
                                                                    </Badge>
                                                                    <span className="font-medium text-sm">
                                                                        {permission.name}
                                                                    </span>
                                                                </div>
                                                                {permission.description && (
                                                                    <p className="text-xs text-muted-foreground mb-1">
                                                                        {permission.description}
                                                                    </p>
                                                                )}
                                                                {permission.full_endpoint && (
                                                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                                                        {permission.full_endpoint}
                                                                    </code>
                                                                )}
                                                                {permission.allowed_methods && (
                                                                    <div className="flex gap-1 mt-1">
                                                                        {permission.allowed_methods.map((method) => (
                                                                            <Badge
                                                                                key={method}
                                                                                variant="outline"
                                                                                className="text-xs"
                                                                            >
                                                                                {method}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>
                            );
                        })}
                    </div>

                    <InputError message={errors.permissions} />

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href="/roles-permissions">
                            <Button variant="outline" type="button">
                                <XIcon className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Actualizar Permisos
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
