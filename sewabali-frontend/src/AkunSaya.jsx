import React from 'react';
import { Link } from 'react-router-dom';
import './Profil.css'; // Kita gunakan CSS Profil agar senada

function AkunSaya() {
  // Data Simulasi User
  const user = {
    nama: "Fikri Aditia",
    email: "fikriaditia@gmail.com",
    telepon: "081234567890",
    alamat: "Jl. Raya Canggu No. 10, Bali",
    avatar: "https://placehold.co/100x100/ffffff/007bff?text=FA"
  };

  return (
    <div className="profil-container">
      {/* Header */}
      <header className="profil-header-simple">
        <Link to="/profil" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/></svg>
          Kembali
        </Link>
        <h2>Akun Saya</h2>
      </header>

      <div className="profil-content">
        {/* Foto Profil Besar */}
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <img 
                src={user.avatar} 
                alt="Profile" 
                style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}
            />
        </div>

        {/* Form Read-only */}
        <div className="profil-menu-card" style={{padding: '1.5rem'}}>
            <div className="info-group" style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '0.3rem'}}>Nama Lengkap</label>
                <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#333'}}>{user.nama}</div>
            </div>
            <hr style={{border: '0', borderTop: '1px solid #eee', margin: '1rem 0'}}/>
            
            <div className="info-group" style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '0.3rem'}}>Email</label>
                <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#333'}}>{user.email}</div>
            </div>
             <hr style={{border: '0', borderTop: '1px solid #eee', margin: '1rem 0'}}/>

            <div className="info-group" style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '0.3rem'}}>Nomor Telepon</label>
                <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#333'}}>{user.telepon}</div>
            </div>
             <hr style={{border: '0', borderTop: '1px solid #eee', margin: '1rem 0'}}/>

            <div className="info-group">
                <label style={{display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '0.3rem'}}>Alamat</label>
                <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#333'}}>{user.alamat}</div>
            </div>
        </div>

        <button style={{
            width: '100%', padding: '1rem', marginTop: '2rem', 
            backgroundColor: '#007bff', color: 'white', border: 'none', 
            borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
        }}>
            Edit Profil
        </button>
      </div>
    </div>
  );
}

export default AkunSaya;