import React from 'react';
import { Link } from 'react-router-dom';
import './HalamanInfo.css';

function SyaratKetentuan() {
  return (
    <div className="mobile-page-container">
      <header className="page-header">
        <Link to="/about" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Syarat & Ketentuan</span>
        <div style={{width: 40}}></div>
      </header>

      <div className="text-content">
        <h3>1. Persyaratan Sewa</h3>
        <p>Penyewa wajib memiliki KTP asli dan SIM C (untuk motor) atau SIM A (untuk mobil) yang masih berlaku. Penyewa juga wajib memberikan dokumen jaminan selama masa sewa.</p>

        <h3>2. Pembayaran</h3>
        <p>Pembayaran dilakukan penuh di muka melalui transfer bank atau metode pembayaran lain yang tersedia di aplikasi SewaBali.id.</p>

        <h3>3. Pembatalan</h3>
        <ul>
            <li>Pembatalan H-3: Pengembalian dana 100%.</li>
            <li>Pembatalan H-1: Pengembalian dana 50%.</li>
            <li>Pembatalan di hari H: Dana tidak dapat dikembalikan.</li>
        </ul>

        <h3>4. Tanggung Jawab</h3>
        <p>Kerusakan atau kehilangan kendaraan selama masa sewa sepenuhnya menjadi tanggung jawab penyewa. Denda akan dikenakan sesuai tingkat kerusakan.</p>

        <h3>5. Larangan</h3>
        <p>Dilarang menggunakan kendaraan untuk kegiatan ilegal, balapan liar, atau dipindahtangankan kepada pihak ketiga tanpa izin pemilik.</p>
      </div>
    </div>
  );
}

export default SyaratKetentuan;