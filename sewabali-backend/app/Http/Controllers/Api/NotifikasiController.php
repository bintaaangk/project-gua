<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotifikasiController extends Controller
{
    // Mengambil semua notifikasi milik user yang sedang login
    public function index()
    {
        $notif = Notifikasi::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                // Kita asumsikan format pesan: "Judul: Deskripsi"
                // Jika tidak ada ":", maka judulnya default
                $parts = explode(': ', $item->pesan, 2);
                $title = isset($parts[1]) ? $parts[0] : 'Notifikasi Baru';
                $desc = isset($parts[1]) ? $parts[1] : $item->pesan;

                return [
                    'id' => $item->id,
                    'type' => $this->mapType($item->tipe),
                    'title' => $title,
                    'desc' => $desc,
                    'time' => $item->created_at->diffForHumans(),
                    'isRead' => (bool)$item->is_read,
                ];
            });

        return response()->json($notif);
    }

    // Tandai satu notifikasi sebagai dibaca
    public function markAsRead($id)
    {
        $notif = Notifikasi::where('user_id', Auth::id())->findOrFail($id);
        $notif->update(['is_read' => true]);
        return response()->json(['message' => 'Notifikasi dibaca']);
    }

    // Tandai semua sebagai dibaca
    public function markAllRead()
    {
        Notifikasi::where('user_id', Auth::id())->update(['is_read' => true]);
        return response()->json(['message' => 'Semua notifikasi telah dibaca']);
    }

    // Helper untuk menyesuaikan tipe notif dengan Icon di React kamu
    private function mapType($tipe) {
        if (str_contains($tipe, 'verified') || $tipe === 'success') return 'success';
        if (str_contains($tipe, 'rejected') || $tipe === 'alert') return 'alert';
        if (str_contains($tipe, 'pesanan') || $tipe === 'order') return 'order';
        return 'system';
    }
}