<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\EndpointGroup;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Asegurar que los grupos de endpoints existan
        $this->call(EndpointGroupsSeeder::class);

        $permissions = [
            // API de Clientes
            'clients_api' => [
                [
                    'name' => 'api_clients_view_all',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver listado de clientes vía API'
                ],
                [
                    'name' => 'api_clients_view_one',
                    'action' => 'view',
                    'sub_path' => '/{cuit}',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver cliente específico por CUIT vía API'
                ],
                [
                    'name' => 'api_clients_create',
                    'action' => 'create',
                    'sub_path' => '',
                    'allowed_methods' => ['POST'],
                    'description' => 'Crear cliente vía API'
                ],
                [
                    'name' => 'api_clients_update',
                    'action' => 'update',
                    'sub_path' => '/{cuit}',
                    'allowed_methods' => ['PUT', 'PATCH'],
                    'description' => 'Actualizar cliente vía API'
                ],
                [
                    'name' => 'api_clients_delete',
                    'action' => 'delete',
                    'sub_path' => '/{cuit}',
                    'allowed_methods' => ['DELETE'],
                    'description' => 'Eliminar cliente vía API'
                ]
            ],

            // Clientes Web
            'clients_web' => [
                [
                    'name' => 'clients_index',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver listado de clientes'
                ],
                [
                    'name' => 'clients_show',
                    'action' => 'view',
                    'sub_path' => '/{client}',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver cliente específico'
                ],
                [
                    'name' => 'clients_create_form',
                    'action' => 'create',
                    'sub_path' => '/create',
                    'allowed_methods' => ['GET'],
                    'description' => 'Mostrar formulario de creación'
                ],
                [
                    'name' => 'clients_store',
                    'action' => 'create',
                    'sub_path' => '',
                    'allowed_methods' => ['POST'],
                    'description' => 'Guardar nuevo cliente'
                ],
                [
                    'name' => 'clients_edit_form',
                    'action' => 'update',
                    'sub_path' => '/{client}/edit',
                    'allowed_methods' => ['GET'],
                    'description' => 'Mostrar formulario de edición'
                ],
                [
                    'name' => 'clients_update',
                    'action' => 'update',
                    'sub_path' => '/{client}',
                    'allowed_methods' => ['PUT', 'PATCH'],
                    'description' => 'Actualizar cliente'
                ],
                [
                    'name' => 'clients_delete',
                    'action' => 'delete',
                    'sub_path' => '/{client}',
                    'allowed_methods' => ['DELETE'],
                    'description' => 'Eliminar cliente'
                ],
                [
                    'name' => 'clients_pdf',
                    'action' => 'pdf',
                    'sub_path' => '/pdf',
                    'allowed_methods' => ['GET'],
                    'description' => 'Generar PDF de clientes'
                ],
                [
                    'name' => 'clients_pdf_optimized',
                    'action' => 'pdf',
                    'sub_path' => '/pdf/optimized',
                    'allowed_methods' => ['GET'],
                    'description' => 'Generar PDF optimizado de clientes'
                ],
                [
                    'name' => 'clients_pdf_paginated',
                    'action' => 'pdf',
                    'sub_path' => '/pdf/paginated/{page?}',
                    'allowed_methods' => ['GET'],
                    'description' => 'Generar PDF paginado de clientes'
                ],
                [
                    'name' => 'clients_pdf_range',
                    'action' => 'pdf',
                    'sub_path' => '/pdf/range/{letter?}',
                    'allowed_methods' => ['GET'],
                    'description' => 'Generar PDF de clientes por rango'
                ]
            ],

            // Usuarios
            'users' => [
                [
                    'name' => 'users_index',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver listado de usuarios'
                ],
                [
                    'name' => 'users_create_form',
                    'action' => 'create',
                    'sub_path' => '/create',
                    'allowed_methods' => ['GET'],
                    'description' => 'Mostrar formulario de creación de usuario'
                ],
                [
                    'name' => 'users_store',
                    'action' => 'create',
                    'sub_path' => '',
                    'allowed_methods' => ['POST'],
                    'description' => 'Crear nuevo usuario'
                ],
                [
                    'name' => 'users_edit_form',
                    'action' => 'update',
                    'sub_path' => '/{user}/edit',
                    'allowed_methods' => ['GET'],
                    'description' => 'Mostrar formulario de edición de usuario'
                ],
                [
                    'name' => 'users_update',
                    'action' => 'update',
                    'sub_path' => '/{user}',
                    'allowed_methods' => ['PUT', 'PATCH'],
                    'description' => 'Actualizar usuario'
                ],
                [
                    'name' => 'users_delete',
                    'action' => 'delete',
                    'sub_path' => '/{user}',
                    'allowed_methods' => ['DELETE'],
                    'description' => 'Eliminar usuario'
                ],
                [
                    'name' => 'users_pdf',
                    'action' => 'pdf',
                    'sub_path' => '-pdf',
                    'allowed_methods' => ['GET'],
                    'description' => 'Generar PDF de usuarios'
                ]
            ],

            // Roles
            'roles' => [
                [
                    'name' => 'roles_index',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver listado de roles'
                ],
                [
                    'name' => 'roles_create_form',
                    'action' => 'create',
                    'sub_path' => '/create',
                    'allowed_methods' => ['GET'],
                    'description' => 'Mostrar formulario de creación de rol'
                ],
                [
                    'name' => 'roles_store',
                    'action' => 'create',
                    'sub_path' => '',
                    'allowed_methods' => ['POST'],
                    'description' => 'Crear nuevo rol'
                ],
                [
                    'name' => 'roles_edit_form',
                    'action' => 'update',
                    'sub_path' => '/{role}/edit',
                    'allowed_methods' => ['GET'],
                    'description' => 'Mostrar formulario de edición de rol'
                ],
                [
                    'name' => 'roles_update',
                    'action' => 'update',
                    'sub_path' => '/{role}',
                    'allowed_methods' => ['PUT', 'PATCH'],
                    'description' => 'Actualizar rol'
                ],
                [
                    'name' => 'roles_delete',
                    'action' => 'delete',
                    'sub_path' => '/{role}',
                    'allowed_methods' => ['DELETE'],
                    'description' => 'Eliminar rol'
                ]
            ],

            // Noticias
            'news' => [
                [
                    'name' => 'news_index',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver noticias'
                ],
                [
                    'name' => 'news_rural',
                    'action' => 'view',
                    'sub_path' => '/rural',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver noticias rurales'
                ],
                [
                    'name' => 'news_category',
                    'action' => 'view',
                    'sub_path' => '/category/{category}',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver noticias por categoría'
                ]
            ],

            // API de Noticias
            'news_api' => [
                [
                    'name' => 'api_news_all',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'API: Ver todas las noticias'
                ],
                [
                    'name' => 'api_news_rural',
                    'action' => 'view',
                    'sub_path' => '/rural',
                    'allowed_methods' => ['GET'],
                    'description' => 'API: Ver noticias rurales'
                ],
                [
                    'name' => 'api_news_category',
                    'action' => 'view',
                    'sub_path' => '/category/{category}',
                    'allowed_methods' => ['GET'],
                    'description' => 'API: Ver noticias por categoría'
                ]
            ],

            // Dashboard
            'dashboard' => [
                [
                    'name' => 'dashboard_index',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'Acceder al dashboard'
                ]
            ],

            // Configuración
            'settings' => [
                [
                    'name' => 'settings_index',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver configuración'
                ],
                [
                    'name' => 'settings_profile_view',
                    'action' => 'view',
                    'sub_path' => '/profile',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver configuración de perfil'
                ],
                [
                    'name' => 'settings_profile_update',
                    'action' => 'update',
                    'sub_path' => '/profile',
                    'allowed_methods' => ['PATCH', 'PUT'],
                    'description' => 'Actualizar perfil'
                ],
                [
                    'name' => 'settings_profile_delete',
                    'action' => 'delete',
                    'sub_path' => '/profile',
                    'allowed_methods' => ['DELETE'],
                    'description' => 'Eliminar perfil'
                ],
                [
                    'name' => 'settings_password_view',
                    'action' => 'view',
                    'sub_path' => '/password',
                    'allowed_methods' => ['GET'],
                    'description' => 'Ver cambio de contraseña'
                ],
                [
                    'name' => 'settings_password_update',
                    'action' => 'update',
                    'sub_path' => '/password',
                    'allowed_methods' => ['PUT'],
                    'description' => 'Actualizar contraseña'
                ]
            ],

            // API Misceláneas
            'api_misc' => [
                [
                    'name' => 'api_test',
                    'action' => 'view',
                    'sub_path' => '/test',
                    'allowed_methods' => ['GET'],
                    'description' => 'Endpoint de prueba de la API'
                ],
                [
                    'name' => 'api_clients_dev_all',
                    'action' => 'view',
                    'sub_path' => '/clients-dev',
                    'allowed_methods' => ['GET'],
                    'description' => 'Endpoint de desarrollo para clientes'
                ],
                [
                    'name' => 'api_clients_dev_one',
                    'action' => 'view',
                    'sub_path' => '/clients-dev/{cuit}',
                    'allowed_methods' => ['GET'],
                    'description' => 'Endpoint de desarrollo para cliente específico'
                ],
                [
                    'name' => 'api_roles_create',
                    'action' => 'create',
                    'sub_path' => '/roles',
                    'allowed_methods' => ['POST'],
                    'description' => 'Crear rol vía API'
                ],
                [
                    'name' => 'api_roles_update',
                    'action' => 'update',
                    'sub_path' => '/roles/{role}',
                    'allowed_methods' => ['PUT', 'PATCH'],
                    'description' => 'Actualizar rol vía API'
                ],
                [
                    'name' => 'api_roles_delete',
                    'action' => 'delete',
                    'sub_path' => '/roles/{role}',
                    'allowed_methods' => ['DELETE'],
                    'description' => 'Eliminar rol vía API'
                ],
                [
                    'name' => 'api_permissions_create',
                    'action' => 'create',
                    'sub_path' => '/permissions',
                    'allowed_methods' => ['POST'],
                    'description' => 'Crear permiso vía API'
                ],
                [
                    'name' => 'api_permissions_update',
                    'action' => 'update',
                    'sub_path' => '/permissions/{permission}',
                    'allowed_methods' => ['PUT', 'PATCH'],
                    'description' => 'Actualizar permiso vía API'
                ],
                [
                    'name' => 'api_permissions_delete',
                    'action' => 'delete',
                    'sub_path' => '/permissions/{permission}',
                    'allowed_methods' => ['DELETE'],
                    'description' => 'Eliminar permiso vía API'
                ],
                [
                    'name' => 'api_roles_permissions_update',
                    'action' => 'update',
                    'sub_path' => '/roles-permissions/{role}',
                    'allowed_methods' => ['PUT'],
                    'description' => 'Actualizar permisos de rol vía API'
                ]
            ],

            // Página Principal
            'home' => [
                [
                    'name' => 'home_index',
                    'action' => 'view',
                    'sub_path' => '',
                    'allowed_methods' => ['GET'],
                    'description' => 'Acceder a la página principal'
                ]
            ]
        ];

        foreach ($permissions as $groupName => $groupPermissions) {
            $endpointGroup = EndpointGroup::where('name', $groupName)->first();
            
            if (!$endpointGroup) {
                continue;
            }

            foreach ($groupPermissions as $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission['name']],
                    [
                        'endpoint_group_id' => $endpointGroup->id,
                        'action' => $permission['action'],
                        'sub_path' => $permission['sub_path'],
                        'allowed_methods' => $permission['allowed_methods'],
                        'description' => $permission['description']
                    ]
                );
            }
        }
    }
}
