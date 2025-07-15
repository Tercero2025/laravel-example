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
    
    Route::get('/permissions/{permission}/edit', [PermissionController::class, 'edit'])
        ->middleware('can:assignRoles,App\Models\Role')
        ->name('permissions.edit');
});
