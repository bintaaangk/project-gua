import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './Profil.css'; 

// --- Komponen Navigasi Bawah (Tidak Diubah) ---
const NavIcon = ({ d, label, active, to }) => ( 
  <Link to={to} className={`bottom-nav-item ${active ? 'active' : ''}`}>
    <div className="nav-icon-wrapper">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={d} />
        </svg>
    </div>
    <span>{label}</span>
 </Link>
);

function Profil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // --- State User (Tidak Diubah) ---
  const [user, setUser] = useState({
    nama: "",
    username: "",
    email: "", 
    avatar: "https://placehold.co/120x120/e2e8f0/cbd5e1?text=..." 
  });

  // --- Fetch Data User (Tidak Diubah) ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            navigate('/login');
            return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const userData = response.data;

        setUser({
            nama: userData.name || userData.nama, 
            username: userData.email, 
            avatar: userData.avatar_url || "https://placehold.co/120x120/ffffff/007bff?text=" + (userData.name ? userData.name.charAt(0).toUpperCase() : 'U')
        });

      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // --- Fungsi Logout (Tidak Diubah) ---
  const handleLogout = async () => {
    if(window.confirm("Apakah Anda yakin ingin keluar dari aplikasi?")) {
        try {
            localStorage.clear(); 
            sessionStorage.clear();
            navigate('/login'); 
        } catch (error) {
            console.error("Logout error", error);
        }
    }
  };

  // --- Navigasi Edit Profil ---
  const handleEditProfile = () => {
      navigate('/akun-saya');
  };

  // --- Ganti Foto ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const newAvatarUrl = URL.createObjectURL(file);
        setUser(prev => ({ ...prev, avatar: newAvatarUrl }));
    }
  };

  // --- Loading Screen (Tidak Diubah) ---
  if (loading) {
      return (
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            height: '100vh', width: '100%', backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                width: '40px', height: '40px', border: '4px solid #e2e8f0',
                borderTop: '4px solid #3b82f6', borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: '15px', color: '#64748B', fontWeight: 500 }}>Memuat Profil...</p>
        </div>
      );
  }

  // --- TAMPILAN UTAMA ---
 return (
    <div className="mobile-page-container">
      
      {/* 1. Header Background */}
      <div className="profile-header-bg"></div>

      <div className="profil-content-wrapper">
        
        {/* 2. Kartu Identitas */}
        <div className="identity-section">
            <div className="avatar-container">
                <div className="avatar-frame">
                    <img src={user.avatar} alt="Profile" className="avatar-img" />
                </div>
                <input 
                    type="file" 
                    id="file-input-profile" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }} 
                />
                <label htmlFor="file-input-profile" className="btn-camera">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </label>
            </div>
            
            <h2 className="user-name">{user.nama}</h2>
            <p className="user-username">{user.username}</p>

            <button className="btn-edit-profile-pill" onClick={handleEditProfile}>
                Edit Profil
            </button>
        </div>

        {/* =========================================== */}
        {/* BAGIAN MENU DENGAN CLASS BARU (RESET STYLE) */}
        {/* =========================================== */}

        {/* GROUP 1: PENGATURAN AKUN */}
        <h3 className="section-title">PENGATURAN AKUN</h3>
        
        {/* WADAH UTAMA (PEMBUNGKUS) */}
        <div className="list-container-box">
            
            {/* ITEM 1 */}
            <Link to="/akun-saya" className="list-item-row">
                <div className="icon-box blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="menu-text">
                    <h4>Informasi Pribadi</h4>
                    <p>Ubah nama, email, dan alamat</p>
                </div>
                <div className="chevron">›</div>
            </Link>

            {/* CONTOH ITEM KEDUA (Hanya untuk tes tampilan, bisa dihapus nanti) */}
            {/* Supaya kamu bisa lihat efek list menyambung */}
            {/* <Link to="/notifikasi" className="list-item-row">
                <div className="icon-box blue">
                   <svg ... />
                </div>
                <div className="menu-text">
                    <h4>Notifikasi</h4>
                    <p>Atur notifikasi aplikasi</p>
                </div>
                <div className="chevron">›</div>
            </Link> 
            */}

        </div> 
        {/* Tutup Wadah Group 1 */}


        {/* GROUP 2: LAINNYA */}
        <h3 className="section-title">LAINNYA</h3>
        
        {/* WADAH UTAMA KEDUA */}
        <div className="list-container-box">
            
            {/* ITEM 1: TENTANG */}
            <Link to="/about" className="list-item-row">
                <div className="icon-box purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <div className="menu-text">
                    <h4>Tentang Aplikasi</h4>
                    <p>Versi 1.0.0</p>
                </div>
                <div className="chevron">›</div>
            </Link>

            {/* ITEM 2: KELUAR */}
            <div className="list-item-row" onClick={handleLogout}>
                <div className="icon-box red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </div>
                <div className="menu-text">
                    <h4 style={{ color: '#ef4444' }}>Keluar</h4>
                    <p>Keluar dari akun anda</p>
                </div>
                <div className="chevron">›</div>
            </div>

        </div> 
        {/* Tutup Wadah Group 2 */}

        <div style={{height: 100}}></div>
      </div>

      <nav className="bottom-nav">
        <NavIcon label="Beranda" active={false} to="/beranda" d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
        <NavIcon label="Pencarian" active={false} to="/pencarian" d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65" />
        <NavIcon label="Riwayat" active={false} to="/riwayat" d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" />
        <NavIcon label="Profil" active={true} to="/profil" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" />
      </nav>
    </div>
  );
}

export default Profil;