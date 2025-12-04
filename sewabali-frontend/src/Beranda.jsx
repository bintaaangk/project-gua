import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Beranda.css'; // File CSS untuk Beranda

// Komponen Kartu Kendaraan
function VehicleCard({ item }) {
  const formattedPrice = `Rp ${item.harga_per_hari.toLocaleString('id-ID')}/hari`;
  return (
    <div className="vehicle-card">
      <img src={item.gambar_url} alt={item.nama} onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/e0e0e0/777?text=Gambar+Rusak"; }} />
      <h3>{item.nama}</h3>
      <p>{formattedPrice}</p>
      
      {/* Mengarahkan ke halaman detail */}
      <Link to={`/kendaraan/${item.id}`} className="detail-btn">
        Detail
      </Link>
    </div>
  );
}

// Komponen Ikon untuk Bottom Nav
const NavIcon = ({ d, label, active, to }) => ( // Menerima prop 'to'
  <Link to={to} className={`bottom-nav-item ${active ? 'active' : ''}`}>
    {/* Ukuran SVG disetel besar di sini agar CSS bisa menargetkannya */}
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{label}</span>
  </Link>
);

// Komponen Utama Halaman Beranda
function Beranda() {
  const [mobil, setMobil] = useState([]);
  const [motor, setMotor] = useState([]);
  const [loading, setLoading] = useState(true);

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



  return (
    <div className="beranda-container">
      {/* 1. Header Atas yang Simpel */}
      <header className="beranda-header">
        SewaBali.id
      </header>

      {/* 2. Konten Halaman (Scrollable) */}
      <main className="beranda-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Sewa kendaraan untuk berwisata di Bali dengan mudah!</h1>
            <button className="sewa-sekarang-btn">Sewa Sekarang</button>
          </div>
          <div className="hero-right-empty"></div>
        </section>

        {/* Bagian Mobil */}
        <section className="vehicle-category-section">
          <h2>Mobil</h2>
          <div className="vehicle-grid">
            {mobil.map(item => (
              <VehicleCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Bagian Motor */}
        <section className="vehicle-category-section">
          <h2>Motor</h2>
          <div className="vehicle-grid">
            {motor.map(item => (
              <VehicleCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>

      {/* 3. Navbar Bawah (Fixed) */}
      <nav className="bottom-nav">
        {/* BERANDA (Aktif) */}
        <NavIcon
          label="Beranda"
          active={true}
          to="/beranda" 
          d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        />
        {/* PENCARIAN */}
        <NavIcon
          label="Pencarian"
          active={false}
          to="/pencarian" 
          d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65"
        />
        {/* RIWAYAT */}
        <NavIcon
          label="Riwayat"
          active={false}
          to="/riwayat"
          d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
        />
        {/* PROFIL */}
        <NavIcon
          label="Profil"
          active={false}
          to="/profil"
          d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        />
      </nav>
    </div>
  );
}

export default Beranda;
