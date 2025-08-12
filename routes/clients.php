<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientPdfController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('clients/create', [ClientController::class, 'create'])->name('clients.create');
    Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
    Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
    Route::get('clients/{client}/edit', [ClientController::class, 'edit'])->name('clients.edit');
    Route::put('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');
    
    // Rutas para PDFs
    Route::get('clients/pdf', [ClientPdfController::class, 'generate'])->name('clients.pdf');
    Route::get('clients/pdf/optimized', [ClientPdfController::class, 'generateOptimized'])->name('clients.pdf.optimized');
    Route::get('clients/pdf/paginated/{page?}', [ClientPdfController::class, 'generatePaginated'])->name('clients.pdf.paginated');
    Route::get('clients/pdf/range/{letter?}', [ClientPdfController::class, 'generateByRange'])->name('clients.pdf.range');
});
