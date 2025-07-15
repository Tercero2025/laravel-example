<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();
        return Inertia::render('permissions/index', [
            'permissions' => $permissions
        ]);
    }

    public function create()
    {
        return Inertia::render('permissions/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:permissions',
            'description' => 'nullable',
            'endpoint' => 'required',
            'method' => 'required|in:GET,POST,PUT,DELETE,PATCH'
        ]);

        Permission::create($validated);
        return redirect()->route('permissions.index');
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('permissions/edit', [
            'permission' => $permission
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|unique:permissions,name,' . $permission->id,
            'description' => 'nullable',
            'endpoint' => 'required',
            'method' => 'required|in:GET,POST,PUT,DELETE,PATCH'
        ]);

        $permission->update($validated);
        return redirect()->route('permissions.index');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();
        return response()->noContent();
    }
}
