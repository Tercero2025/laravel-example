<?php

use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Ruta general para obtener noticias
    Route::get('/news', [NewsController::class, 'getNews'])->name('news.index');
    
    // Ruta específica para noticias rurales
    Route::get('/news/rural', [NewsController::class, 'getRuralNews'])->name('news.rural');
    
    // Ruta para obtener noticias por categoría
    Route::get('/news/category/{category}', [NewsController::class, 'getNewsByCategory'])->name('news.category');
});
