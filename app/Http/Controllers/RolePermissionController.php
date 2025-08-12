<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\EndpointGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::with(['permissions.endpointGroup'])->get()->map(function ($role) {
            // Agrupar permisos por endpoint group
            $permissionsByGroup = $role->permissions->groupBy(function ($permission) {
                return $permission->endpointGroup ? $permission->endpointGroup->display_name : 'Sin Grupo';
            });

            return [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->permissions,
                'permissions_by_group' => $permissionsByGroup->map(function ($permissions, $groupName) {
                    return [
                        'group_name' => $groupName,
                        'permissions' => $permissions->map(function ($permission) {
                            return [
                                'id' => $permission->id,
                                'name' => $permission->name,
                                'action' => $permission->action,
                                'sub_path' => $permission->sub_path,
                                'allowed_methods' => $permission->allowed_methods,
                                'description' => $permission->description,
                                'full_endpoint' => $permission->full_endpoint
                            ];
                        })->values()
                    ];
                })->values()
            ];
        });

        return Inertia::render('roles-permissions/index', [
            'roles' => $roles
        ]);
    }

    public function edit(Role $role)
    {
        // Obtener todos los grupos de endpoints con sus permisos
        $endpointGroups = EndpointGroup::with('permissions')
            ->active()
            ->orderBy('display_name')
            ->get()
            ->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'display_name' => $group->display_name,
                    'base_path' => $group->base_path,
                    'description' => $group->description,
                    'permissions' => $group->permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'action' => $permission->action,
                            'sub_path' => $permission->sub_path,
                            'allowed_methods' => $permission->allowed_methods,
                            'description' => $permission->description,
                            'full_endpoint' => $permission->full_endpoint
                        ];
                    })
                ];
            });

        return Inertia::render('roles-permissions/edit', [
            'role' => $role->load(['permissions.endpointGroup']),
            'endpointGroups' => $endpointGroups,
            'allPermissions' => Permission::with('endpointGroup')->get()
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'required|array'
        ]);

        $role->permissions()->sync($validated['permissions']);
        
        return redirect()->route('roles-permissions.index')
            ->with('success', 'Permisos del rol actualizados exitosamente.');
    }
}
