import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Beranda.css'; 

// --- DAFTAR LOKASI TIRUAN ---
const MOCK_LOCATIONS = ['Denpasar', 'Kuta', 'Ubud', 'Seminyak', 'Canggu', 'Jimbaran', 'Nusa Dua'];

// Komponen Kartu Kendaraan
function VehicleCard({ item }) {
  const formattedPrice = `Rp ${item.harga_per_hari.toLocaleString('id-ID')}`;
  
  return (
    <Link to={`/kendaraan/${item.id}`} className="mobile-vehicle-card">
      <div className="card-img-container">
        <img 
          src={item.gambar_url} 
          alt={item.nama} 
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/e0e0e0/777?text=Gambar+Rusak"; }} 
        />
        <div className="card-type-badge">{item.tipe}</div>
      </div>
      
      <div className="card-details">
        <h3 className="vehicle-title">{item.nama}</h3>
        <div className="location-info">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>{item.jarak} km • {item.lokasi}</span>
        </div>
        <div className="price-row">
            <span className="price-text">{formattedPrice}<small>/hari</small></span>
            <button className="btn-sewa-sm">Sewa</button>
        </div>
      </div>
    </Link>
  );
}

// Komponen Section Tanpa Panah Kanan
function ScrollableSection({ title, items }) {
  return (
    <section className="section-block">
        <div className="section-head">
            <h2>{title}</h2>
            <Link to="/pencarian" className="link-all">Lihat Semua</Link>
        </div>
        
        {/* Hanya wrapper horizontal list biasa */}
        <div className="relative-list-wrapper">
            <div className="horizontal-list">
                {items.map(item => <VehicleCard key={item.id} item={item} />)}
            </div>
        </div>
    </section>
  );
}

// Komponen Ikon Navbar
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

function Beranda() {
  const [allVehicles, setAllVehicles] = useState([]);
  const [mobil, setMobil] = useState([]);
  const [motor, setMotor] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('Semua'); 
  const [sortBy, setSortBy] = useState('default'); 

  useEffect(() => {
    async function fetchKendaraan() {
      try {
        // 1. Fetch ke API Laravel
        const response = await axios.get('http://127.0.0.1:8000/api/kendaraan');
        
        // 2. Set State sesuai struktur JSON kamu (image_d7871a.png)
        // Struktur JSON kamu: { mobil: [...], motor: [...] }
        setMobil(response.data.mobil || []); 
        setMotor(response.data.motor || []);
        
      } catch (error) {
        console.error("Gagal konek ke backend:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchKendaraan();
  }, []);

  // ... sisa kode render return tetap sama ...
  useEffect(() => {
    let processedData = [...allVehicles];

    if (sortBy === 'terdekat') {
        processedData.sort((a, b) => parseFloat(a.jarak) - parseFloat(b.jarak));
    }

    if (activeCategory === 'Semua') {
        setMobil(processedData.filter(v => v.tipe === 'Mobil'));
        setMotor(processedData.filter(v => v.tipe === 'Motor'));
    } else {
        setMobil(activeCategory === 'Mobil' ? processedData.filter(v => v.tipe === 'Mobil') : []);
        setMotor(activeCategory === 'Motor' ? processedData.filter(v => v.tipe === 'Motor') : []);
    }

  }, [activeCategory, sortBy, allVehicles]);


  if (loading) return (
    <div className="mobile-page-container loading-state">
        <div className="spinner"></div>
        <p>Memuat...</p>
    </div>
  );

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="home-header">
        <div className="brand-logo">Sewabali.id</div>
        <div className="header-icons">
             <Link to="/notifikasi" className="icon-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span style={{
                    position: 'absolute', top: '12px', right: '18px', 
                    width: '8px', height: '8px', 
                    backgroundColor: '#ef4444', borderRadius: '50%', 
                    border: '1px solid white'
                }}></span>
             </Link>
        </div>
      </header>

      <div className="home-scroll-content">
        
        {/* Hero Banner */}
        <div className="hero-banner">
            <div className="hero-text">
                <h1>Jelajahi Bali<br/>dengan Bebas!</h1>
                <p>Sewa kendaraan mudah & cepat.</p>
            </div>
        </div>

        {/* Filter Chips */}
        <div className="filter-row">
            <div className="chips-scroll">
                <button className={`chip ${activeCategory === 'Semua' ? 'active' : ''}`} onClick={() => setActiveCategory('Semua')}>Semua</button>
                <button className={`chip ${activeCategory === 'Mobil' ? 'active' : ''}`} onClick={() => setActiveCategory('Mobil')}>🚗 Mobil</button>
                <button className={`chip ${activeCategory === 'Motor' ? 'active' : ''}`} onClick={() => setActiveCategory('Motor')}>🛵 Motor</button>
                <div className="sep"></div>
                <button className={`chip ${sortBy === 'terdekat' ? 'active-blue' : ''}`} onClick={() => setSortBy(sortBy === 'terdekat' ? 'default' : 'terdekat')}>📍 Terdekat</button>
            </div>
        </div>

        {/* Section Mobil */}
        {mobil.length > 0 && (
            <ScrollableSection title="Mobil Populer" items={mobil} />
        )}

        {/* Section Motor */}
        {motor.length > 0 && (
            <ScrollableSection title="Motor Hemat" items={motor} />
        )}

        {/* Empty State */}
        {mobil.length === 0 && motor.length === 0 && (
            <div className="empty-home">
                <p>Tidak ada kendaraan ditemukan.</p>
            </div>
        )}
        
        <div style={{height: '20px'}}></div>
      </div>

      {/* Navbar Bawah */}
      <nav className="bottom-nav-fixed">
        <NavIcon label="Beranda" active={true} to="/beranda" d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
        <NavIcon label="Pencarian" active={false} to="/pencarian" d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65" />
        <NavIcon label="Riwayat" active={false} to="/riwayat" d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" />
        <NavIcon label="Profil" active={false} to="/profil" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" />
      </nav>
    </div>
  );
}

export default Beranda;