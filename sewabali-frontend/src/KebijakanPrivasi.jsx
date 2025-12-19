import React from 'react';
import { Link } from 'react-router-dom';
import './HalamanInfo.css';

function KebijakanPrivasi() {
  return (
    <div className="mobile-page-container">
      <header className="page-header">
        <Link to="/about" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Kebijakan Privasi</span>
        <div style={{width: 40}}></div>
      </header>

      <div className="text-content">
        <p>Terakhir diperbarui: 10 Desember 2025</p>
        
        <h3>1. Pengumpulan Informasi</h3>
        <p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda membuat akun, melakukan pemesanan, atau menghubungi layanan pelanggan.</p>

        <h3>2. Penggunaan Informasi</h3>
        <p>Informasi yang kami kumpulkan digunakan untuk:</p>
        <ul>
            <li>Memproses transaksi penyewaan kendaraan.</li>
            <li>Memverifikasi identitas dan dokumen (KTP/SIM).</li>
            <li>Mengirimkan notifikasi terkait pesanan.</li>
        </ul>

        <h3>3. Keamanan Data</h3>
        <p>Kami memprioritaskan keamanan data Anda. Kami menggunakan enkripsi standar industri untuk melindungi informasi pribadi Anda dari akses yang tidak sah.</p>

        <h3>4. Berbagi Informasi</h3>
        <p>Kami tidak menjual data pribadi Anda kepada pihak ketiga. Data hanya dibagikan kepada mitra penyewa (pemilik kendaraan) untuk keperluan operasional sewa-menyewa.</p>
      </div>
    </div>
  );
}

export default KebijakanPrivasi;