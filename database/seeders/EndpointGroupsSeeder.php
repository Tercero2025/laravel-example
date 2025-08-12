<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EndpointGroup;

class EndpointGroupsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $endpointGroups = [
            [
                'name' => 'clients_api',
                'base_path' => '/api/clients',
                'display_name' => 'API de Clientes',
                'description' => 'Endpoints de la API para gestión de clientes'
            ],
            [
                'name' => 'clients_web',
                'base_path' => '/clients',
                'display_name' => 'Gestión de Clientes (Web)',
                'description' => 'Vistas web para gestión de clientes'
            ],
            [
                'name' => 'users',
                'base_path' => '/users',
                'display_name' => 'Gestión de Usuarios',
                'description' => 'Administración de usuarios del sistema'
            ],
            [
                'name' => 'roles',
                'base_path' => '/roles',
                'display_name' => 'Gestión de Roles',
                'description' => 'Administración de roles y permisos'
            ],
            [
                'name' => 'permissions',
                'base_path' => '/permissions',
                'display_name' => 'Gestión de Permisos',
                'description' => 'Administración de permisos del sistema'
            ],
            [
                'name' => 'roles_permissions',
                'base_path' => '/roles-permissions',
                'display_name' => 'Asignación Roles-Permisos',
                'description' => 'Gestión de asignación de permisos a roles'
            ],
            [
                'name' => 'news',
                'base_path' => '/news',
                'display_name' => 'Noticias',
                'description' => 'Gestión de noticias y contenidos'
            ],
            [
                'name' => 'news_api',
                'base_path' => '/api/news',
                'display_name' => 'API de Noticias',
                'description' => 'API para consulta de noticias'
            ],
            [
                'name' => 'dashboard',
                'base_path' => '/dashboard',
                'display_name' => 'Panel de Control',
                'description' => 'Dashboard principal del sistema'
            ],
            [
                'name' => 'settings',
                'base_path' => '/settings',
                'display_name' => 'Configuración',
                'description' => 'Configuración de perfil y sistema'
            ],
            [
                'name' => 'home',
                'base_path' => '/',
                'display_name' => 'Página Principal',
                'description' => 'Página de inicio del sistema'
            ],
            [
                'name' => 'api_misc',
                'base_path' => '/api',
                'display_name' => 'API Misceláneas',
                'description' => 'Endpoints varios de la API'
            ]
        ];

        foreach ($endpointGroups as $group) {
            EndpointGroup::firstOrCreate(
                ['name' => $group['name']],
                $group
            );
        }
    }
}
