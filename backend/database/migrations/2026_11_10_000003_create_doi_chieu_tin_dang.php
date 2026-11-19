<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doi_chieu_tin_dang', function (Blueprint $table) {
            $table->foreignId('tin_nhat_id')->constrained('tin_dang')->cascadeOnDelete();
            $table->foreignId('tin_mat_id')->constrained('tin_dang')->cascadeOnDelete();
            $table->primary(['tin_nhat_id', 'tin_mat_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doi_chieu_tin_dang');
    }
};
