<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ActiveAccount
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->trang_thai === 'hoat_dong', 403, 'Tài khoản đã bị khóa.');

        return $next($request);
    }
}
