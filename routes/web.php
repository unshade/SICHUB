<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatsController;
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

    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/{path}', [FolderController::class, 'index'])->where('path', '.*')->name('folder.page');
    });

    Route::get('/file/{path}', [VideoController::class, 'index'])->where('path', '.*')->name('video.page');

    Route::prefix('folder')->group(function () {
 
        Route::post('/', [FolderController::class, 'store'])->name('folder.store');
        Route::post('/privacy', [FolderController::class, 'setPrivacy'])->name('folder.privacy');
        Route::delete('/{id}', [FolderController::class, 'destroy'])->name('folder.destroy');

    });
    

    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
    Route::prefix('stats')->group(function () {
        Route::get('/', [StatsController::class, 'index'])->name('stats');
    });
    Route::prefix('video')->group(function () {
        Route::post('/', [VideoController::class, 'store'])->name('video.store');
        Route::get('/{id}', [VideoController::class, 'serve'])->name('storage.serve');
        Route::post('/{id}/like', [VideoController::class, 'like'])->name('video.like');
        Route::post('/{id}/comment', [VideoController::class, 'commentStore'])->name('video.comment.store');
        Route::delete('/{id}', [VideoController::class, 'destroy'])->name('video.destroy');
        Route::post('/privacy', [VideoController::class, 'setPrivacy'])->name('video.privacy');
        Route::post('/move', [VideoController::class, 'move'])->name('video.move');
    });
});



require __DIR__.'/auth.php';
