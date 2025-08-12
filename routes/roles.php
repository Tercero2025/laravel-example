<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/roles', [RoleController::class, 'index'])
        ->middleware('can:assignRoles,App\Models\Role')
        ->name('roles.index');
    
    Route::get('/roles/create', [RoleController::class, 'create'])
        ->middleware('can:create,App\Models\Role')
        ->name('roles.create');
    
    Route::post('/roles', [RoleController::class, 'store'])
        ->middleware('can:create,App\Models\Role')
        ->name('roles.store');
    
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])
        ->middleware('can:assignRoles,App\Models\Role')
        ->name('roles.edit');
    
    Route::put('/roles/{role}', [RoleController::class, 'update'])
        ->middleware('can:assignRoles,App\Models\Role')
        ->name('roles.update');
    
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])
        ->middleware('can:delete,role')
        ->name('roles.destroy');
});
