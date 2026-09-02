<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // The About section title is now static UI text (translated via the
        // language dictionary) — it no longer lives in the database.
        Schema::table('abouts', function (Blueprint $table) {
            $table->dropColumn('title');
        });

        // Clean up the now-obsolete dictionary entry
        DB::table('translations')->where('source_text', 'ABOUT ME')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('abouts', function (Blueprint $table) {
            $table->string('title')->default('ABOUT ME');
        });
    }
};
