<?php

namespace App\Http\Controllers;

use App\Models\EndpointGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EndpointGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
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
                    'permissions_count' => $group->permissions->count(),
                    'permissions_by_action' => $group->getPermissionsByAction()
                ];
            });

        return Inertia::render('EndpointGroups/Index', [
            'endpointGroups' => $endpointGroups
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('EndpointGroups/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:endpoint_groups',
            'base_path' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean'
        ]);

        $endpointGroup = EndpointGroup::create($validated);

        return redirect()->route('endpoint-groups.index')
            ->with('success', 'Grupo de endpoints creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(EndpointGroup $endpointGroup): Response
    {
        $endpointGroup->load('permissions');
        
        $groupData = [
            'id' => $endpointGroup->id,
            'name' => $endpointGroup->name,
            'display_name' => $endpointGroup->display_name,
            'base_path' => $endpointGroup->base_path,
            'description' => $endpointGroup->description,
            'is_active' => $endpointGroup->is_active,
            'full_path' => $endpointGroup->full_path,
            'permissions' => $endpointGroup->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'action' => $permission->action,
                    'sub_path' => $permission->sub_path,
                    'allowed_methods' => $permission->allowed_methods,
                    'description' => $permission->description,
                    'full_endpoint' => $permission->full_endpoint
                ];
            }),
            'permissions_by_action' => $endpointGroup->getPermissionsByAction()
        ];

        return Inertia::render('EndpointGroups/Show', [
            'endpointGroup' => $groupData
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EndpointGroup $endpointGroup): Response
    {
        return Inertia::render('EndpointGroups/Edit', [
            'endpointGroup' => $endpointGroup
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EndpointGroup $endpointGroup)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:endpoint_groups,name,' . $endpointGroup->id,
            'base_path' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean'
        ]);

        $endpointGroup->update($validated);

        return redirect()->route('endpoint-groups.index')
            ->with('success', 'Grupo de endpoints actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EndpointGroup $endpointGroup)
    {
        // Verificar si tiene permisos asociados
        if ($endpointGroup->permissions()->count() > 0) {
            return redirect()->route('endpoint-groups.index')
                ->with('error', 'No se puede eliminar el grupo porque tiene permisos asociados.');
        }

        $endpointGroup->delete();

        return redirect()->route('endpoint-groups.index')
            ->with('success', 'Grupo de endpoints eliminado exitosamente.');
    }

    /**
     * Get all endpoint groups for API
     */
    public function api()
    {
        return response()->json([
            'endpoint_groups' => EndpointGroup::active()
                ->with('permissions')
                ->orderBy('display_name')
                ->get()
        ]);
    }
}
