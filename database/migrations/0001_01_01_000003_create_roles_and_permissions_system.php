<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Crear tabla de roles
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Crear tabla de endpoint_groups (grupos de endpoints)
        Schema::create('endpoint_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // ej: 'clients', 'users', 'roles'
            $table->string('base_path'); // ej: '/clients', '/api/clients'
            $table->string('display_name'); // ej: 'Gestión de Clientes'
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Crear tabla de permisos
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->foreignId('endpoint_group_id')->constrained('endpoint_groups')->onDelete('cascade');
            $table->string('action'); // 'view', 'create', 'update', 'delete', 'pdf'
            $table->string('sub_path')->nullable(); // '/create', '/edit', '/pdf', etc.
            $table->json('allowed_methods')->nullable(); // ['GET', 'POST'] como JSON
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Crear tabla pivote role_permission
        Schema::create('role_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Evitar duplicados
            $table->unique(['role_id', 'permission_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('endpoint_groups');
        Schema::dropIfExists('roles');
    }
};
