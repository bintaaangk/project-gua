import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Semua impor menggunakan ekstensi .jsx agar file ditemukan oleh Vite/ESBuild
import LandingPage from './LandingPage.jsx'; 
import Register from './Register.jsx';     
import Login from './Login.jsx';         
import Beranda from './Beranda.jsx'; 
import DetailKendaraan from './DetailKendaraan.jsx';
import Pencarian from './Pencarian.jsx';
import Pemesanan from './Pemesanan.jsx'; // Halaman Konfirmasi Pemesanan
import Pembayaran from './Pembayaran.jsx'; // Halaman Upload Bukti Transfer
import FinalisasiPemesanan from './FinalisasiPemesanan.jsx'; 
import UnggahDokumen from './UnggahDokumen.jsx'; // <--- IMPORT BARU
import Riwayat from './Riwayat.jsx';
import DetailRiwayat from './DetailRiwayat.jsx';
import Profil from './Profil.jsx';
import AkunSaya from './AkunSaya.jsx';
import AboutApp from './AboutApp.jsx';
import KebijakanPrivasi from './KebijakanPrivasi';
import SyaratKetentuan from './SyaratKetentuan';
import HubungiKami from './HubungiKami';
import Notifikasi from './Notifikasi'; 
import DashboardPerental from './DashboardPerental'; 
import VerifikasiDokumen from './VerifikasiDokumen'; 
import VerifikasiBayar from './VerifikasiBayar'; 
import PesananMasuk from './Pesananmasuk';
import ProfilPerental from './ProfilPerental';
import NotifikasiPerental from './NotifikasiPerental';
import AdminDashboard from './AdminDashboard';
import UploadPembayaran from './UploadPembayaran';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/beranda" element={<Beranda />} /> 
        
        {/* Rute dinamis untuk detail, pemesanan, dan pembayaran */}
        <Route path="/kendaraan/:id" element={<DetailKendaraan />} />
        <Route path="/pemesanan/:id" element={<Pemesanan />} /> 

        {/* Rute Verifikasi Dokumen Lama (Opsional) */}
        <Route path="/finalisasi-pemesanan" element={<FinalisasiPemesanan />} />
        
        {/* --- PERBAIKAN DISINI --- */}
        {/* Tambahkan /:id agar bisa menerima ID Pemesanan dari URL */}
       <Route path="/unggah-dokumen/:id_pemesanan" element={<UnggahDokumen />} />
        {/* Rute Pembayaran (setelah Pemesanan/Verifikasi) */}
        <Route path="/pembayaran/:id" element={<Pembayaran />} />

        <Route path="/pencarian" element={<Pencarian />} />
        
        {/* Rute Riwayat dan Profil */}
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/riwayat/:id" element={<DetailRiwayat />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/akun-saya" element={<AkunSaya />} />
        <Route path="/about" element={<AboutApp />} />
        <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
        <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
        <Route path="/hubungi-kami" element={<HubungiKami />} />
        <Route path="/notifikasi" element={<Notifikasi />} />
        
        {/* Rute Perental */}
        <Route path="/perental/dashboard" element={<DashboardPerental />} />
        <Route path="/perental/verifikasi-dokumen" element={<VerifikasiDokumen />} />
        <Route path="/perental/verifikasi-bayar" element={<VerifikasiBayar />} />
        <Route path="/pesanan-masuk" element={<PesananMasuk />} />
        <Route path="/perental/profil" element={<ProfilPerental />} />
        <Route path="/perental/notifikasi" element={<NotifikasiPerental />} />
        <Route path="/upload-pembayaran/:id" element={<UploadPembayaran />} />
        
        {/* Rute Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;