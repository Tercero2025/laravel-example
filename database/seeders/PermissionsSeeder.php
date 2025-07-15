<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Permisos para admin
            ['name' => 'create_client', 'endpoint' => '/api/clients', 'method' => 'POST'],
            ['name' => 'update_client', 'endpoint' => '/api/clients/{id}', 'method' => 'PUT'],
            ['name' => 'delete_client', 'endpoint' => '/api/clients/{id}', 'method' => 'DELETE'],
            ['name' => 'view_all_clients', 'endpoint' => '/api/clients', 'method' => 'GET'],

            // Permisos para cliente
            ['name' => 'view_own_profile', 'endpoint' => '/api/clients/{id}', 'method' => 'GET'],
            ['name' => 'update_own_profile', 'endpoint' => '/api/clients/{id}', 'method' => 'PUT'],

            // Permisos para invitado
            ['name' => 'view_public_info', 'endpoint' => '/api/public/*', 'method' => 'GET'],

            // Permisos para administración de roles
            ['name' => 'view_roles', 'endpoint' => '/roles', 'method' => 'GET'],
            ['name' => 'create_role', 'endpoint' => '/roles/create', 'method' => 'GET'],
            ['name' => 'store_role', 'endpoint' => '/api/roles', 'method' => 'POST'],
            ['name' => 'edit_role', 'endpoint' => '/roles/{role}/edit', 'method' => 'GET'],
            ['name' => 'update_role', 'endpoint' => '/api/roles/{role}', 'method' => 'PUT'],
            ['name' => 'delete_role', 'endpoint' => '/api/roles/{role}', 'method' => 'DELETE'],

            // Permisos para administración de permisos
            ['name' => 'view_permissions', 'endpoint' => '/permissions', 'method' => 'GET'],
            ['name' => 'create_permission', 'endpoint' => '/permissions/create', 'method' => 'GET'],
            ['name' => 'store_permission', 'endpoint' => '/api/permissions', 'method' => 'POST'],
            ['name' => 'edit_permission', 'endpoint' => '/permissions/{permission}/edit', 'method' => 'GET'],
            ['name' => 'update_permission', 'endpoint' => '/api/permissions/{permission}', 'method' => 'PUT'],
            ['name' => 'delete_permission', 'endpoint' => '/api/permissions/{permission}', 'method' => 'DELETE'],

            // Permisos para administración de roles-permisos
            ['name' => 'view_roles_permissions', 'endpoint' => '/roles-permissions', 'method' => 'GET'],
            ['name' => 'edit_role_permissions', 'endpoint' => '/roles-permissions/{role}/edit', 'method' => 'GET'],
            ['name' => 'update_role_permissions', 'endpoint' => '/api/roles-permissions/{role}', 'method' => 'PUT'],
            
            // Permisos para administración de usuarios
            ['name' => 'view_users', 'endpoint' => '/users', 'method' => 'GET'],
            ['name' => 'create_user', 'endpoint' => '/users/create', 'method' => 'GET'],
            ['name' => 'store_user', 'endpoint' => '/api/users', 'method' => 'POST'],
            ['name' => 'edit_user', 'endpoint' => '/users/{user}/edit', 'method' => 'GET'],
            ['name' => 'update_user', 'endpoint' => '/api/users/{user}', 'method' => 'PUT'],
            ['name' => 'delete_user', 'endpoint' => '/api/users/{user}', 'method' => 'DELETE'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                [
                    'endpoint' => $permission['endpoint'],
                    'method' => $permission['method'],
                    'description' => $permission['description'] ?? null
                ]
            );
        }
    }
}
