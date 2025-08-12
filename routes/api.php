<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\ApiTestController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;

// Rutas para probar API sin middleware
Route::get('test', [ApiTestController::class, 'test']);

// Rutas temporales para clientes sin autenticación (solo desarrollo)
Route::get('clients-dev', [ApiTestController::class, 'getClients']);
Route::get('clients-dev/{cuit}', [ApiTestController::class, 'getClientByCuit']);

// Rutas públicas para noticias (sin autenticación)
Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'getNews']);
    Route::get('/rural', [NewsController::class, 'getRuralNews']);
    Route::get('/category/{category}', [NewsController::class, 'getNewsByCategory']);
});

// Rutas solo para superadmin
Route::middleware(['auth:web'])->group(function () {
    Route::post('roles', [RoleController::class, 'store'])
        ->middleware('can:create,App\Models\Role');
        
    Route::post('permissions', [PermissionController::class, 'store'])
        ->middleware('can:create,App\Models\Role');
});

Route::middleware(['auth:web'])->group(function () {
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

// Rutas para Clientes
Route::middleware(['auth:web'])->group(function () {
    // GET - Obtener un cliente específico por CUIT
    Route::get('/clients/{cuit}', [ClientController::class, 'getClientByCuit'])
        ->name('clients.api.show');
});