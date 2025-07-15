<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use Illuminate\Support\Facades\Route;

// Rutas solo para superadmin
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('roles', [RoleController::class, 'store'])
        ->middleware('can:create,App\Models\Role');
        
    Route::post('permissions', [PermissionController::class, 'store'])
        ->middleware('can:create,App\Models\Role');
});

// Rutas para admin y superadmin
Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('roles/{role}', [RoleController::class, 'update'])
        ->middleware('can:assignRoles,App\Models\Role');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])
        ->middleware('can:assignRoles,App\Models\Role');
    
    Route::put('permissions/{permission}', [PermissionController::class, 'update'])
        ->middleware('can:assignRoles,App\Models\Role');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])
        ->middleware('can:assignRoles,App\Models\Role');
    
    // Ruta para actualizar permisos de un rol
    Route::put('roles-permissions/{role}', [RolePermissionController::class, 'update'])
        ->middleware('can:assignRoles,App\Models\Role');
});