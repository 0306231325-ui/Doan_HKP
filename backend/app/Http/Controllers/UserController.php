<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            ['id' => 1, 'name' => 'Nguyễn Văn A', 'email' => 'nva@example.com'],
            ['id' => 2, 'name' => 'Trần Thị B', 'email' => 'ttb@example.com'],
            ['id' => 3, 'name' => 'Lê Văn C', 'email' => 'lvc@example.com'],
        ]);
    }
}
