<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tin_dang', function (Blueprint $table) {
            $table->string('email_lien_he', 254)->nullable();
            $table->uuid('ma_gui')->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('tin_dang', function (Blueprint $table) {
            $table->dropUnique(['ma_gui']);
            $table->dropColumn(['email_lien_he', 'ma_gui']);
        });
    }
};
