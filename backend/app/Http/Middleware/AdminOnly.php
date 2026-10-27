<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->vai_tro === 'quan_tri', 403, 'Bạn không có quyền quản trị.');

        return $next($request);
    }
}
