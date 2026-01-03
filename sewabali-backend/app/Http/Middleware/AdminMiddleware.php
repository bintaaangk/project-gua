<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
// === TAMBAHKAN DUA BARIS INI ===
use App\Models\User; 
use Illuminate\Support\Facades\Auth;
// ===============================

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan logic di sini menggunakan Auth::check() atau pengecekan user yang benar
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Akses ditolak. Bukan Admin.'], 403);
        }

        return $next($request);
    }
}