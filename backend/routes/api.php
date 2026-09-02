<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TechStackController;
use App\Http\Controllers\Api\TranslationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Endpoints
Route::post('/login', [AuthController::class, 'login']);
Route::get('/about', [AboutController::class, 'show']);
Route::get('/tech-stacks', [TechStackController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/messages', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);
Route::get('/translations', [TranslationController::class, 'index']);

// Protected Admin Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::put('/about', [AboutController::class, 'update']);

    Route::post('/tech-stacks/reorder', [TechStackController::class, 'reorder']);
    Route::post('/tech-stacks', [TechStackController::class, 'store']);
    Route::put('/tech-stacks/{id}', [TechStackController::class, 'update']);
    Route::delete('/tech-stacks/{id}', [TechStackController::class, 'destroy']);

    Route::post('/projects/reorder', [ProjectController::class, 'reorder']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    Route::get('/translations/sources', [TranslationController::class, 'syncSources']);
    Route::post('/translations', [TranslationController::class, 'store']);
    Route::put('/translations/{id}', [TranslationController::class, 'update']);
    Route::delete('/translations/{id}', [TranslationController::class, 'destroy']);
});
