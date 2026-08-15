<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TechStack;
use Illuminate\Http\Request;

class TechStackController extends Controller
{
    public function index()
    {
        $stacks = TechStack::orderBy('order', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $stacks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'alt' => 'required|string|max:255',
            'src' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        $stack = TechStack::create([
            'title' => $request->title,
            'alt' => $request->alt,
            'src' => $request->src,
            'order' => $request->input('order', 0),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tech stack created successfully',
            'data' => $stack
        ]);
    }

    public function update(Request $request, $id)
    {
        $stack = TechStack::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'alt' => 'sometimes|required|string|max:255',
            'src' => 'sometimes|required|string',
            'order' => 'nullable|integer',
        ]);

        $stack->update($request->only(['title', 'alt', 'src', 'order']));

        return response()->json([
            'status' => 'success',
            'message' => 'Tech stack updated successfully',
            'data' => $stack
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:tech_stacks,id',
            'orders.*.order' => 'required|integer',
        ]);

        foreach ($request->orders as $item) {
            TechStack::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tech stacks reordered successfully'
        ]);
    }

    public function destroy($id)
    {
        $stack = TechStack::findOrFail($id);
        $stack->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tech stack deleted successfully'
        ]);
    }
}
