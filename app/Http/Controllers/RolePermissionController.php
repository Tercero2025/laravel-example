<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        return Inertia::render('roles-permissions/index', [
            'roles' => $roles
        ]);
    }

    public function edit(Role $role)
    {
        return Inertia::render('roles-permissions/edit', [
            'role' => $role->load('permissions'),
            'allPermissions' => Permission::all()
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'required|array'
        ]);

        $role->permissions()->sync($validated['permissions']);
        
        return redirect()->route('roles-permissions.index');
    }
}
