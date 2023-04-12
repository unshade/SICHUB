<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('url');
            $table->string('path');
            $table->string('thumbnail');
            $table->foreignId('id_folder')->nullable()->constrained('folders')->onDelete('cascade');
            $table->boolean('is_public')->default(false);
            $table->timestamps();

            $table->unique(['title', 'id_folder']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
