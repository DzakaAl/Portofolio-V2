<?php

use Illuminate\Support\Facades\Route;

// Backend ini murni REST API (frontend terpisah di folder frontend/).
// Semua endpoint berada di routes/api.php dengan prefix /api.
Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'DzakaAl Portfolio API',
        'docs' => 'GET /api/projects, /api/about, /api/tech-stacks, /api/messages',
    ]);
});
