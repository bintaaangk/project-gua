import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profil.css'; 

const NavIcon = ({ d, label, active, to }) => ( 
  <Link to={to} className={`bottom-nav-item ${active ? 'active' : ''}`}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{label}</span>
  </Link>
);

function Profil() {
  const navigate = useNavigate();

  const user = {
    nama: "Fikri Aditia",
    username: "@fikriaditia",
    avatar: "https://placehold.co/100x100/ffffff/007bff?text=FA" 
  };

  const handleLogout = () => {
    // Konfirmasi logout
    if(window.confirm("Apakah Anda yakin ingin keluar?")) {
        sessionStorage.clear(); // Hapus data sesi
        navigate('/'); // Kembali ke halaman awal (Login/Landing)
    }
  };

  return (
    <div className="profil-container">
      
      <div className="profil-header-card">
        <div className="profil-avatar">
          <img src={user.avatar} alt="Profile" />
        </div>
        <div className="profil-info">
          <h2>{user.nama}</h2>
          <p>{user.username}</p>
        </div>
      </div>

      <div className="profil-menu-card">
        
        {/* Link ke Akun Saya */}
        <Link to="/akun-saya" className="menu-item">
          <div className="menu-icon icon-user">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="menu-text">
            <h3>Akun Saya</h3>
            <p>Make Changes to your account</p>
          </div>
          <div className="menu-arrow">&gt;</div>
        </Link>

        {/* Tombol Logout (Bukan Link, tapi Div dengan onClick) */}
        <div className="menu-item" onClick={handleLogout} style={{cursor: 'pointer'}}>
          <div className="menu-icon icon-logout">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <div className="menu-text">
            <h3>Log out</h3>
            <p>Further secure your account for safety</p>
          </div>
          <div className="menu-arrow">&gt;</div>
        </div>

        {/* Link ke About App */}
        <Link to="/about" className="menu-item">
          <div className="menu-icon icon-about">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div className="menu-text">
            <h3>About App</h3>
            <p>Version 1.0.0</p>
          </div>
          <div className="menu-arrow">&gt;</div>
        </Link>

      </div>

      <nav className="bottom-nav">
        <NavIcon
          label="Beranda"
          active={false}
          to="/beranda" 
          d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        />
        <NavIcon
          label="Pencarian"
          active={false}
          to="/pencarian" 
          d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65"
        />
        <NavIcon
          label="Riwayat"
          active={false}
          to="/riwayat"
          d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
        />
        <NavIcon
          label="Profil"
          active={true}
          to="/profil"
          d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        />
      </nav>
    </div>
  );
}

export default Profil;