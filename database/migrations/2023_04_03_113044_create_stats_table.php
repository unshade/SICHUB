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
        Schema::create('stats', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('video_id')->constrained('videos');
            $table->foreignId('user_id')->constrained('users');
            $table->boolean('watched')->default(false);
            $table->boolean('liked')->default(false);
            $table->boolean('disliked')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stats');
    }
};
