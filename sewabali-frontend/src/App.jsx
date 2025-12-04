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
import VerifikasiDokumen from './UnggahDokumen.jsx'; // Halaman Unggah Dokumen
import Riwayat from './Riwayat.jsx';
import DetailRiwayat from './DetailRiwayat.jsx';
import Profil from './Profil.jsx'; // <-- IMPORT BARU
import AkunSaya from './AkunSaya.jsx';
import AboutApp from './AboutApp.jsx';

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

        {/* Rute Verifikasi Dokumen (Setelah Pemesanan) */}
        <Route path="/unggah-dokumen" element={<VerifikasiDokumen />} />
        
        {/* Rute Pembayaran (setelah Pemesanan/Verifikasi) */}
        <Route path="/pembayaran/:id" element={<Pembayaran />} />

        <Route path="/pencarian" element={<Pencarian />} />
        
        {/* Rute Riwayat dan Profil (element-nya perlu dibuat nanti) */}
       <Route path="/riwayat" element={<Riwayat />} />
       <Route path="/riwayat/:id" element={<DetailRiwayat />} />
        <Route path="/profil" element={<Profil />} /> {/* <-- RUTE BARU */}
        <Route path="/akun-saya" element={<AkunSaya />} />
        <Route path="/about" element={<AboutApp />} />

      </Routes>
    </Router>
  );
}

export default App;
