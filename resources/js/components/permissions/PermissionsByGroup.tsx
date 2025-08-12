import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Permission } from '@/types';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

interface PermissionGroup {
    group_name: string;
    permissions: Permission[];
}

interface PermissionsByGroupProps {
    permissionsByGroup: PermissionGroup[];
    compact?: boolean;
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

const getMethodColor = (method: string): string => {
    switch (method.toUpperCase()) {
        case 'GET':
            return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
        case 'POST':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
        case 'PUT':
        case 'PATCH':
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
        case 'DELETE':
            return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
};

export function PermissionsByGroup({ permissionsByGroup, compact = false }: PermissionsByGroupProps) {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (groupName: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    if (compact) {
        return (
            <div className="space-y-2">
                {permissionsByGroup.map((group, index) => (
                    <div key={index} className="text-sm">
                        <span className="font-medium text-muted-foreground">{group.group_name}:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {group.permissions.map((permission) => (
                                <Badge
                                    key={permission.id}
                                    variant="outline"
                                    className={`text-xs ${getActionColor(permission.action)}`}
                                >
                                    {permission.action || permission.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {permissionsByGroup.map((group, index) => (
                <Card key={index}>
                    <Collapsible
                        open={openGroups[group.group_name]}
                        onOpenChange={() => toggleGroup(group.group_name)}
                    >
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                <CardTitle className="flex items-center justify-between text-lg">
                                    <span>{group.group_name}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {group.permissions.length} permisos
                                        </Badge>
                                        {openGroups[group.group_name] ? (
                                            <ChevronDownIcon className="h-4 w-4" />
                                        ) : (
                                            <ChevronRightIcon className="h-4 w-4" />
                                        )}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="pt-0">
                                <div className="grid gap-3">
                                    {group.permissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge className={getActionColor(permission.action)}>
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
                                            </div>
                                            <div className="flex flex-wrap gap-1 ml-2">
                                                {permission.allowed_methods?.map((method) => (
                                                    <Badge
                                                        key={method}
                                                        variant="outline"
                                                        className={`text-xs ${getMethodColor(method)}`}
                                                    >
                                                        {method}
                                                    </Badge>
                                                )) || (
                                                    permission.method && (
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${getMethodColor(permission.method)}`}
                                                        >
                                                            {permission.method}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            ))}
        </div>
    );
}
