import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

import './LandingPage.css'; 

// Komponen kecil untuk Kartu Kendaraan
function VehicleCard({ item, onClick }) { 
  const formattedPrice = `Rp ${item.harga_per_hari.toLocaleString('id-ID')}/hari`;

  return (
    <div className="vehicle-card">
      <img src={item.gambar_url} alt={item.nama} onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/e0e0e0/777?text=Gambar+Rusak"; }} />
      <h3>{item.nama}</h3>
      <p>{formattedPrice}</p>
      <button className="detail-btn" onClick={onClick}>
        Detail
      </button>
    </div>
  );
}

// Komponen Halaman Utama
function LandingPage() {
  const [mobil, setMobil] = useState([]);
  const [motor, setMotor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Logika notifikasi saat klik tombol tanpa login
  const handleProtectedClick = () => {
    setNotification('Silakan login terlebih dahulu');
    setTimeout(() => {
      setNotification('');
    }, 2500); 
  };

  useEffect(() => {
    async function fetchKendaraan() {
      try {
        const response = await axios.get('http://localhost:8000/api/kendaraan');
        setMobil(response.data.mobil);
        setMotor(response.data.motor);
      } catch (error) {
        console.error("Gagal mengambil data kendaraan:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchKendaraan();
  }, []); 

  if (loading) {
    return <div className="loading-page">Memuat data kendaraan...</div>; 
  }

  return (
    <div className="landing-page-container"> 
      {/* Header Navbar */}
      <header className="navbar">
        <Link to="/" className="navbar-left">SewaBali.id</Link>
        <div className="navbar-right-auth">
          {/* Tombol Login dan Daftar yang dipisah */}
          <Link to="/login" className="nav-auth-btn login-btn">
            Login
          </Link>
          <Link to="/register" className="nav-auth-btn register-btn">
            Daftar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Sewa kendaraan untuk berwisata di Bali dengan mudah!</h1>
          <button className="sewa-sekarang-btn" onClick={handleProtectedClick}>
            Sewa Sekarang
          </button>
        </div>
        <div className="hero-right-empty"></div> 
      </section>

      {/* Bagian Mobil */}
      <section className="vehicle-category-section">
        <h2>Mobil</h2>
        <div className="vehicle-grid">
          {mobil.length > 0 ? (
            mobil.map(item => (
              <VehicleCard key={item.id} item={item} onClick={handleProtectedClick} />
            ))
          ) : (
            <p>Tidak ada data mobil.</p>
          )}
        </div>
      </section>

      {/* Bagian Motor */}
      <section className="vehicle-category-section">
        <h2>Motor</h2>
        <div className="vehicle-grid">
          {motor.length > 0 ? (
            motor.map(item => (
              <VehicleCard key={item.id} item={item} onClick={handleProtectedClick} />
            ))
          ) : (
            <p>Tidak ada data motor.</p>
          )}
        </div>
      </section>

      {/* NOTIFIKASI TOAST */}
      {notification && (
        <div className="toast-notification show">
          {notification}
        </div>
      )}
    </div>
  );
}

export default LandingPage;