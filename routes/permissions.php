<?php

use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/permissions', [PermissionController::class, 'index'])
        ->middleware('can:assignRoles,App\Models\Role')
        ->name('permissions.index');
    
    Route::get('/permissions/create', [PermissionController::class, 'create'])
        ->middleware('can:create,App\Models\Role')
        ->name('permissions.create');
    
    Route::post('/permissions', [PermissionController::class, 'store'])
        ->middleware('can:create,App\Models\Role')
        ->name('permissions.store');
    
    Route::get('/permissions/{permission}/edit', [PermissionController::class, 'edit'])
        ->middleware('can:assignRoles,App\Models\Role')
        ->name('permissions.edit');
    
    Route::put('/permissions/{permission}', [PermissionController::class, 'update'])
        ->middleware('can:assignRoles,App\Models\Role')
        ->name('permissions.update');
    
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])
        ->middleware('can:delete,permission')
        ->name('permissions.destroy');
});
