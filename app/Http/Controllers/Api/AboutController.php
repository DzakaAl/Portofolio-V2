<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function show()
    {
        $about = About::first();
        return response()->json([
            'status' => 'success',
            'data' => $about
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'image_url' => 'nullable|string',
        ]);

        $about = About::firstOrCreate(
            ['id' => 1],
            [
                'title' => 'ABOUT ME',
                'description' => $request->input('description', ''),
                'image_url' => $request->input('image_url', null),
            ]
        );
        $about->update([
            'description' => $request->input('description'),
            'image_url' => $request->input('image_url', $about->image_url),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'About Me updated successfully',
            'data' => $about
        ]);
    }
}
