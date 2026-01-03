import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ModalPengingat from './ModalPengingat'; // Pastikan import ini ada
import './Beranda.css'; 

// Fungsi bantuan untuk simulasi jarak
const ensureDistance = (item) => {
  if (item.jarak) return parseFloat(item.jarak);
  return (Math.random() * 14 + 1).toFixed(1); 
};

function VehicleCard({ item }) {
  const formattedPrice = `Rp ${parseInt(item.harga_per_hari).toLocaleString('id-ID')}`;
  const navigate = useNavigate();
  
  // 1. Cek ketersediaan
  const isAvailable = item.status === 'Tersedia';

  // 2. Tentukan warna badge
  const badgeColor = isAvailable ? '#d1fae5' : '#fee2e2'; 
  const textColor = isAvailable ? '#065f46' : '#b91c1c'; 
  const statusText = isAvailable ? 'Tersedia' : 'Dalam Sewa';

  // 3. Logic: Jika diklik saat 'Dalam Sewa', jangan lakukan apa-apa
  const handleCardClick = () => {
    if (!isAvailable) return; // Stop eksekusi
    navigate(`/kendaraan/${item.id}`);
  };

  // 4. Logic Tombol Sewa
  const handleSewaClick = (e) => {
    e.stopPropagation(); // Biar tidak memicu klik pada kartu
    if (isAvailable) {
      navigate(`/pemesanan/${item.id}`);
    } else {
      alert("Maaf, kendaraan ini sedang tidak tersedia.");
    }
  };

  return (
    <div 
      className="mobile-vehicle-card" 
      onClick={handleCardClick}
      // --- BAGIAN INI YANG MENGATUR KURSOR ---
      style={{ 
          // Jika tersedia = jari telunjuk (pointer)
          // Jika TIDAK tersedia = tanda dilarang (not-allowed) 🚫
          cursor: isAvailable ? 'pointer' : 'not-allowed', 
          
          // Opsi tambahan: bikin agak transparan biar kelihatan non-aktif
          opacity: isAvailable ? 1 : 0.7 
      }}
    >
      <div className="card-img-container" style={{ position: 'relative' }}>
        
        {/* Badge Status */}
        <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: badgeColor,
            color: textColor,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '700',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            {statusText}
        </div>

        <img 
          src={item.gambar_url} 
          alt={item.nama}
          // Gambar jadi hitam putih jika tidak tersedia
          style={{ filter: isAvailable ? 'none' : 'grayscale(100%)' }} 
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/e0e0e0/777?text=Gambar+Rusak"; }} 
        />
        <div className="card-type-badge">{item.tipe}</div>
      </div>
      
      <div className="card-details">
        <h3 className="vehicle-title">{item.nama}</h3>
        <div className="location-info">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>{item.jarak || ensureDistance(item)} km • {item.lokasi}</span>
        </div>
        <div className="price-row">
            <span className="price-text">{formattedPrice}<small>/hari</small></span>
            
            <button 
                className="btn-sewa-sm" 
                onClick={handleSewaClick}
                disabled={!isAvailable}
                // Styling tombol juga mengikuti status
                style={{ 
                    opacity: isAvailable ? 1 : 0.5, 
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    backgroundColor: isAvailable ? '' : '#9ca3af'
                }}
            >
                {isAvailable ? 'Sewa' : 'Habis'}
            </button>
        </div>
      </div>
    </div>
  );


}
function ScrollableSection({ title, items }) {
  return (
    <section className="section-block">
        <div className="section-head">
            <h2>{title}</h2>
            <Link to="/pencarian" className="link-all">Lihat Semua</Link>
        </div>
        <div className="relative-list-wrapper">
            <div className="horizontal-list">
                {items.map(item => <VehicleCard key={item.id} item={item} />)}
            </div>
        </div>
    </section>
  );
}

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

  // --- STATE UNTUK PENGINGAT MODAL ---
  const [showReminder, setShowReminder] = useState(false);
  const [reminderData, setReminderData] = useState(null);

  const navigate = useNavigate();

  // --- 1. FETCH DATA KENDARAAN ---
  useEffect(() => {
    async function fetchKendaraan() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/kendaraan');
        const dataMobil = response.data.mobil || [];
        const dataMotor = response.data.motor || [];
        
        const combinedData = [...dataMobil, ...dataMotor].map(item => ({
            ...item,
            jarak: item.jarak ? parseFloat(item.jarak) : parseFloat((Math.random() * 10 + 1).toFixed(1))
        }));

        setAllVehicles(combinedData);
        setMobil(dataMobil);
        setMotor(dataMotor);
        
      } catch (error) {
        console.error("Gagal konek ke backend:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchKendaraan();
  }, []);

  // --- 2. CEK PENGINGAT TENGGAT (API CALL) ---
  useEffect(() => {
    const checkDeadline = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://127.0.0.1:8000/api/pengingat-tenggat', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json' 
                }
            });

            if (response.data.ada_tenggat) {
                setReminderData(response.data);
                setShowReminder(true);
            }
        } catch (err) {
            console.error("Gagal mengecek pengingat di beranda", err);
        }
    };

    checkDeadline();
  }, []);

  // --- 3. LOGIKA FILTER & SORTING ---
  useEffect(() => {
    if (allVehicles.length === 0) return;

    let processedData = [...allVehicles];

    if (sortBy === 'terdekat') {
        processedData.sort((a, b) => a.jarak - b.jarak);
    }

    if (activeCategory === 'Semua') {
        setMobil(processedData.filter(v => v.tipe === 'Mobil'));
        setMotor(processedData.filter(v => v.tipe === 'Motor'));
    } else if (activeCategory === 'Mobil') {
        setMobil(processedData.filter(v => v.tipe === 'Mobil'));
        setMotor([]); 
    } else if (activeCategory === 'Motor') {
        setMobil([]); 
        setMotor(processedData.filter(v => v.tipe === 'Motor'));
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
      
      <header className="home-header">
        <div className="brand-logo">Sewabali.id</div>
        <div className="header-icons">
             <Link to="/notifikasi" className="icon-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
             </Link>
        </div>
      </header>

      <div className="home-scroll-content">
        <div className="hero-banner">
            <div className="hero-text">
                <h1>Jelajahi Bali<br/>dengan Bebas!</h1>
                <p>Sewa kendaraan mudah & cepat.</p>
            </div>
        </div>

        <div className="filter-row">
            <div className="chips-scroll">
                <button className={`chip ${activeCategory === 'Semua' ? 'active' : ''}`} onClick={() => setActiveCategory('Semua')}>Semua</button>
                <button className={`chip ${activeCategory === 'Mobil' ? 'active' : ''}`} onClick={() => setActiveCategory('Mobil')}>🚗 Mobil</button>
                <button className={`chip ${activeCategory === 'Motor' ? 'active' : ''}`} onClick={() => setActiveCategory('Motor')}>🛵 Motor</button>
                <div className="sep"></div>
                <button className={`chip ${sortBy === 'terdekat' ? 'active-blue' : ''}`} onClick={() => setSortBy(sortBy === 'terdekat' ? 'default' : 'terdekat')}>
                    {sortBy === 'terdekat' ? '📍 Terdekat (Aktif)' : '📍 Terdekat'}
                </button>
            </div>
        </div>

        {mobil.length > 0 && <ScrollableSection title="Mobil Populer" items={mobil} />}
        {motor.length > 0 && <ScrollableSection title="Motor Hemat" items={motor} />}

        {mobil.length === 0 && motor.length === 0 && (
            <div className="empty-home">
                <p>Tidak ada kendaraan ditemukan.</p>
                <button className="btn-reset" onClick={() => {setActiveCategory('Semua'); setSortBy('default');}}>Reset Filter</button>
            </div>
        )}
        
        <div style={{height: '80px'}}></div>
      </div>

      {/* --- MODAL PENGINGAT (DITARUH DI LUAR SCROLL CONTENT AGAR CENTER) --- */}
      <ModalPengingat 
          show={showReminder} 
          onClose={() => setShowReminder(false)} 
          data={reminderData} 
      />

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