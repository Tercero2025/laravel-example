<?php

use App\Http\Controllers\ClientPdfController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'author' => env('APP_AUTHOR', 'Desconocido'),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('clients/pdf', [ClientPdfController::class, 'generate'])
        ->name('clients.pdf');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/clients.php';
require __DIR__.'/roles.php';
require __DIR__.'/permissions.php';
require __DIR__.'/roles-permissions.php';
require __DIR__.'/users.php';
require __DIR__.'/news.php';
