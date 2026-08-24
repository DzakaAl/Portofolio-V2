<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::orderBy('id', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $messages
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'avatar' => 'nullable|string',
            'text' => 'required|string',
            'time' => 'nullable|string',
        ]);

        // Jika avatar diisi, perbarui avatar pesan-pesan lama dengan email yang sama
        if ($request->filled('avatar')) {
            Message::where('email', $request->email)->update([
                'avatar' => $request->avatar,
                'user' => $request->user,
            ]);
        }

        $msg = Message::create([
            'user' => $request->user,
            'email' => $request->email,
            'avatar' => $request->avatar,
            'text' => $request->text,
            'time' => $request->input('time', now()->format('H:i')),
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $msg
        ]);
    }
}
