<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('lich_su_cau_hoi')) {
            return;
        }

        Schema::create('lich_su_cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->unsignedInteger('phien_ban');
            $table->json('du_lieu');
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['cau_hoi_id', 'phien_ban']);
            $table->unique(['id', 'cau_hoi_id'], 'uq_lich_su_id_cau_hoi');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('loi_khai_tin_dang')) {
            Schema::dropIfExists('lich_su_cau_hoi');
        }
    }
};
