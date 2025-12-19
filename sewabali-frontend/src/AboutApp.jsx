import React from 'react';
import { Link } from 'react-router-dom';
import './AboutApp.css'; // Pastikan file CSS ini sudah dibuat (lihat di bawah)

function AboutApp() {
  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <Link to="/profil" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Tentang Aplikasi</span>
        <div style={{width: 40}}></div>
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Logo & Versi */}
        <div className="about-hero">
            <div className="logo-box">
                <span className="logo-icon">🏝️</span>
            </div>
            <h1 className="app-name">SewaBali.id</h1>
            <p className="app-version">Versi 1.0.0</p>
        </div>

        {/* Deskripsi */}
        <div className="about-card">
            <p className="about-desc">
                Platform penyewaan kendaraan #1 di Bali. Kami menghubungkan Anda dengan penyedia rental terpercaya untuk pengalaman liburan yang tak terlupakan.
            </p>
        </div>

        {/* Fitur Unggulan */}
        <div className="features-grid">
            <div className="feature-item">
                <div className="feat-icon">🚀</div>
                <span>Cepat & Mudah</span>
            </div>
            <div className="feature-item">
                <div className="feat-icon">🛡️</div>
                <span>Aman & Terjamin</span>
            </div>
            <div className="feature-item">
                <div className="feat-icon">💰</div>
                <span>Harga Terbaik</span>
            </div>
        </div>

        {/* MENU NAVIGASI (LINK AKTIF) */}
        <div className="menu-list-about">
            <Link to="/kebijakan-privasi" className="menu-item-about">
                <span>Kebijakan Privasi</span>
                <span className="chevron">&rsaquo;</span>
            </Link>
            <Link to="/syarat-ketentuan" className="menu-item-about">
                <span>Syarat & Ketentuan</span>
                <span className="chevron">&rsaquo;</span>
            </Link>
            <Link to="/hubungi-kami" className="menu-item-about">
                <span>Hubungi Kami</span>
                <span className="chevron">&rsaquo;</span>
            </Link>
        </div>

        {/* Footer Copyright */}
        <div className="about-footer">
            <p>&copy; 2025 SewaBali.id</p>
            <p>Made with ❤️ in Bali</p>
        </div>

        <div style={{height: 50}}></div>
      </div>

    </div>
  );
}

export default AboutApp;