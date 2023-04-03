<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubfolderController;
use App\Http\Controllers\VideoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('dashboard')->group(function () {
        Route::get('/{name}', [FolderController::class, 'index'])->name('folder');
        Route::get('/{folderName}/{subfolderName}', [SubfolderController::class, 'index'])->name('subfolder');
        Route::get('/{folderName}/{subfolderName}/{id}', [VideoController::class, 'index'])->name('subfolder');
    });

    Route::get('/upload', function () {
        return Inertia::render('Upload');
    })->name('upload');

    Route::post('/upload', [VideoController::class, 'store'])->name('upload.store');

    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});
Route::get('/video/{id}', [VideoController::class, 'serve'])->name('storage.serve');



require __DIR__.'/auth.php';
