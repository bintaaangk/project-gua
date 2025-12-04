import React from 'react';
import { Link } from 'react-router-dom';
import './Profil.css'; // Gunakan CSS yang sama

function AboutApp() {
  return (
    <div className="profil-container">
      {/* Header */}
      <header className="profil-header-simple">
        <Link to="/profil" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/></svg>
          Kembali
        </Link>
        <h2>Tentang Aplikasi</h2>
      </header>

      <div className="profil-content" style={{textAlign: 'center', paddingTop: '2rem'}}>
        <h1 style={{color: '#007bff', marginBottom: '0.5rem'}}>SewaBali.id</h1>
        <p style={{color: '#888', marginBottom: '2rem'}}>Versi 1.0.0</p>

        <div className="profil-menu-card" style={{padding: '2rem', textAlign: 'left'}}>
            <p style={{lineHeight: '1.6', color: '#555', marginBottom: '1rem'}}>
                <strong>SewaBali.id</strong> adalah platform penyewaan kendaraan terpercaya di Bali. 
                Kami menyediakan berbagai jenis mobil dan motor dengan kualitas terbaik untuk menemani liburan Anda.
            </p>
            <p style={{lineHeight: '1.6', color: '#555'}}>
                Dikembangkan untuk memudahkan wisatawan dalam mencari transportasi yang aman, nyaman, dan terjangkau.
            </p>
        </div>

        <div style={{marginTop: '3rem', color: '#aaa', fontSize: '0.8rem'}}>
            &copy; 2025 SewaBali.id. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default AboutApp;