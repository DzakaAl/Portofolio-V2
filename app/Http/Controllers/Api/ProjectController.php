<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::orderBy('order', 'asc');

        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        $projects = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $projects
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'nullable',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120',
            'link' => 'nullable|string',
            'featured' => 'nullable',
            'order' => 'nullable|integer',
        ]);

        $imageUrl = $request->image;

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('projects', 'public');
            $imageUrl = Storage::url($path);
        }

        $tags = $request->tags;
        if (is_string($tags)) {
            $tags = json_decode($tags, true) ?? array_map('trim', explode(',', $tags));
        }

        $slug = Str::slug($request->title) . '-' . rand(100, 999);

        $project = Project::create([
            'slug' => $slug,
            'title' => $request->title,
            'description' => $request->description,
            'tags' => is_array($tags) ? $tags : [],
            'image' => $imageUrl ?: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
            'link' => $request->link,
            'featured' => filter_var($request->featured, FILTER_VALIDATE_BOOLEAN),
            'order' => $request->input('order', 0),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Project created successfully',
            'data' => $project
        ]);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'tags' => 'nullable',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120',
            'link' => 'nullable|string',
            'featured' => 'nullable',
            'order' => 'nullable|integer',
        ]);

        $data = $request->only(['title', 'description', 'link', 'order']);

        if ($request->has('featured')) {
            $data['featured'] = filter_var($request->featured, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->has('tags')) {
            $tags = $request->tags;
            if (is_string($tags)) {
                $tags = json_decode($tags, true) ?? array_map('trim', explode(',', $tags));
            }
            $data['tags'] = is_array($tags) ? $tags : [];
        }

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('projects', 'public');
            $data['image'] = Storage::url($path);
        } elseif ($request->filled('image')) {
            $data['image'] = $request->image;
        }

        $project->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:projects,id',
            'orders.*.order' => 'required|integer',
        ]);

        foreach ($request->orders as $item) {
            Project::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Projects reordered successfully'
        ]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Project deleted successfully'
        ]);
    }
}
