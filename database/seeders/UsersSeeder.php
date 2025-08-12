<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Str;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $clientRole = Role::where('name', 'cliente')->first();
        $guestRole = Role::where('name', 'invitado')->first();

        // Asignar permisos a roles (sync ya es idempotente, pero lo mantenemos claro para evitar duplicados)
        if ($adminRole) {
            $adminRole->permissions()->sync(Permission::all());
        }
        
        if ($clientRole) {
            $clientRole->permissions()->sync(
                Permission::whereIn('name', ['view_own_profile', 'update_own_profile'])->get()
            );
        }
        
        if ($guestRole) {
            $guestRole->permissions()->sync(
                Permission::where('name', 'view_public_info')->get()
            );
        }

        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'remember_token' => Str::random(10),
                'is_superadmin' => true,
                'role_id' => null
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'remember_token' => Str::random(10),
                'is_superadmin' => false,
                'role_id' => $adminRole->id
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'remember_token' => Str::random(10),
                'is_superadmin' => false,
                'role_id' => $clientRole->id
            ],
            [
                'name' => 'Alice Brown',
                'email' => 'alice@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'remember_token' => Str::random(10),
                'is_superadmin' => false,
                'role_id' => $clientRole->id
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'email_verified_at' => $userData['email_verified_at'],
                    'password' => $userData['password'],
                    'remember_token' => $userData['remember_token'],
                    'is_superadmin' => $userData['is_superadmin'],
                    'role_id' => $userData['role_id']
                ]
            );
        }
    }
}
