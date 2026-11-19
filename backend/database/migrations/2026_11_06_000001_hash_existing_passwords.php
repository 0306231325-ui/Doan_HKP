<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('nguoi_dung')->select('id', 'mat_khau')->chunkById(100, function ($users) {
            foreach ($users as $user) {
                if (password_get_info($user->mat_khau)['algoName'] === 'unknown') {
                    DB::table('nguoi_dung')->where('id', $user->id)
                        ->where('mat_khau', $user->mat_khau)
                        ->update(['mat_khau' => Hash::make($user->mat_khau)]);
                }
            }
        });
    }

    public function down(): void
    {
        // Password hashes cannot be reversed into plaintext.
    }
};
