<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::transaction(fn () => $this->call([NguoiDungSeeder::class, DuLieuTraCuuSeeder::class]));
    }
}
