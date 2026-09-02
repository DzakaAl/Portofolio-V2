<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\Project;
use App\Models\Translation;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    /**
     * Public: full EN -> ID dictionary (only entries that already have a translation).
     */
    public function index()
    {
        $map = Translation::query()
            ->where('locale', 'id')
            ->whereNotNull('translated_text')
            ->pluck('translated_text', 'source_text');

        return response()->json([
            'status' => 'success',
            'data' => $map,
        ]);
    }

    /**
     * Admin: collect every unique content text (Abouts & Projects) into the
     * translations table so the admin can fill in the Indonesian translations.
     */
    public function syncSources()
    {
        $sources = collect();

        About::query()->get()->each(function (About $about) use ($sources) {
            if (trim((string) $about->description) !== '') {
                $sources->push($about->description);
            }
        });

        Project::query()->get()->each(function (Project $project) use ($sources) {
            if (trim((string) $project->title) !== '') {
                $sources->push($project->title);
            }
            if (trim((string) $project->description) !== '') {
                $sources->push($project->description);
            }
        });

        $created = 0;
        $sources->unique()->each(function (string $text) use (&$created) {
            $hash = md5($text);
            if (! Translation::where('source_hash', $hash)->exists()) {
                Translation::create([
                    'source_text' => $text,
                    'source_hash' => $hash,
                    'translated_text' => null,
                    'locale' => 'id',
                ]);
                $created++;
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => "{$created} source text(s) collected",
            'data' => $this->orderedTranslations(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'source_text' => 'required|string',
            'translated_text' => 'nullable|string',
            'locale' => 'nullable|string|max:5',
        ]);

        $translation = Translation::updateOrCreate(
            ['source_hash' => md5($request->input('source_text'))],
            [
                'source_text' => $request->input('source_text'),
                'translated_text' => $request->input('translated_text'),
                'locale' => $request->input('locale', 'id'),
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Translation saved successfully',
            'data' => $translation,
        ]);
    }

    public function update(Request $request, $id)
    {
        $translation = Translation::findOrFail($id);

        $request->validate([
            'translated_text' => 'nullable|string',
        ]);

        $translation->update([
            'translated_text' => $request->input('translated_text'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Translation updated successfully',
            'data' => $translation,
        ]);
    }

    public function destroy($id)
    {
        $translation = Translation::findOrFail($id);
        $translation->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Translation deleted successfully',
            'data' => null,
        ]);
    }

    /**
     * Untranslated entries first, then oldest first.
     */
    private function orderedTranslations()
    {
        return Translation::query()
            ->orderByRaw('translated_text IS NULL DESC, id ASC')
            ->get();
    }
}
