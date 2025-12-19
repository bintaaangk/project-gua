import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import './LandingPage.css'; 

// --- Komponen Kartu (Mobile Style) ---
function MobileVehicleCard({ item, onClick }) { 
  const formattedPrice = `Rp ${item.harga_per_hari.toLocaleString('id-ID')}`;

  return (
    <div className="lp-card" onClick={onClick}>
      <div className="lp-img-wrapper">
        <img 
            src={item.gambar_url} 
            alt={item.nama} 
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x100/e0e0e0/777?text=N/A"; }} 
        />
        <span className="lp-badge">{item.tipe}</span>
      </div>
      <div className="lp-info">
        <h4 className="lp-title">{item.nama}</h4>
        <p className="lp-price">{formattedPrice}<small>/hari</small></p>
        <button className="lp-btn-action">Lihat</button>
      </div>
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const [mobil, setMobil] = useState([]);
  const [motor, setMotor] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State notifikasi toast
  const [notification, setNotification] = useState('');

  // Fungsi saat klik tanpa login
  const handleProtectedClick = () => {
    setNotification('Silakan Login Terlebih Dahulu');
    
    // Auto hide setelah 2 detik
    setTimeout(() => {
      setNotification('');
      navigate('/login'); // Opsional: langsung arahkan ke login
    }, 2000); 
  };

  useEffect(() => {
    async function fetchKendaraan() {
      try {
        const response = await axios.get('http://localhost:8000/api/kendaraan');
        setMobil(response.data.mobil);
        setMotor(response.data.motor);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchKendaraan();
  }, []); 

  if (loading) {
    return <div className="loading-screen">
        <div className="spinner"></div>
        <p>Memuat...</p>
    </div>; 
  }

  return (
    <div className="mobile-page-container"> 
      
      {/* Header Transparan */}
      <header className="lp-header">
        <div className="lp-logo">SewaBali.id</div>
        <div className="lp-auth-buttons">
          <Link to="/login" className="btn-auth ghost">Masuk</Link>
          <Link to="/register" className="btn-auth primary">Daftar</Link>
        </div>
      </header>

      <div className="scroll-content">
        
        {/* Hero Section */}
        <div className="lp-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1>Liburan di Bali<br/>Makin Mudah!</h1>
                <p>Sewa mobil & motor lepas kunci dengan harga terbaik.</p>
                <button className="btn-hero-cta" onClick={handleProtectedClick}>
                    Mulai Sewa Sekarang
                </button>
            </div>
        </div>

        {/* Kategori Mobil */}
        <div className="lp-section">
            <div className="section-header">
                <h3>Mobil Populer</h3>
                <span onClick={handleProtectedClick} className="link-see-all">Lihat Semua</span>
            </div>
            
            <div className="horizontal-scroll-list">
                {mobil.length > 0 ? (
                    mobil.map(item => (
                        <MobileVehicleCard key={item.id} item={item} onClick={handleProtectedClick} />
                    ))
                ) : (
                    <div className="empty-msg">Data tidak tersedia</div>
                )}
            </div>
        </div>

        {/* Kategori Motor */}
        <div className="lp-section">
            <div className="section-header">
                <h3>Motor Hemat</h3>
                <span onClick={handleProtectedClick} className="link-see-all">Lihat Semua</span>
            </div>
            
            <div className="horizontal-scroll-list">
                {motor.length > 0 ? (
                    motor.map(item => (
                        <MobileVehicleCard key={item.id} item={item} onClick={handleProtectedClick} />
                    ))
                ) : (
                    <div className="empty-msg">Data tidak tersedia</div>
                )}
            </div>
        </div>

        {/* Promo Banner Kecil */}
        <div className="promo-banner" onClick={handleProtectedClick}>
            <div className="promo-text">
                <h4>Promo Pengguna Baru!</h4>
                <p>Diskon 20% untuk sewa pertama.</p>
            </div>
            <div className="promo-icon">🎁</div>
        </div>

        {/* Footer Sederhana */}
        <footer className="lp-footer">
            <p>&copy; 2025 SewaBali.id</p>
            <p>Solusi transportasi liburan Anda.</p>
        </footer>

        <div style={{height: 20}}></div>
      </div>

      {/* TOAST NOTIFICATION (Muncul dari bawah) */}
      <div className={`toast-message ${notification ? 'show' : ''}`}>
        {notification}
      </div>

    </div>
  );
}

export default LandingPage;