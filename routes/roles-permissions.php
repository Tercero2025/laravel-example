<?php

use App\Http\Controllers\RolePermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Asegurarnos que los nombres de las rutas coincidan exactamente
    Route::get('/roles-permissions', [RolePermissionController::class, 'index'])
        ->name('roles-permissions.index');
    
    Route::get('/roles-permissions/{role}/edit', [RolePermissionController::class, 'edit'])
        ->name('roles-permissions.edit');
    
    Route::put('/roles-permissions/{role}', [RolePermissionController::class, 'update'])
        ->name('roles-permissions.update');
});
