import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Pencarian.css'; // File CSS baru

// Komponen Card Hasil Pencarian
function SearchResultCard({ item }) {
  const formattedPrice = `Rp ${item.harga_per_hari.toLocaleString('id-ID')}/hari`;
  const warnaTiruan = item.tipe === 'Mobil' ? 'dark gray' : 'hitam'; 
  const lokasiTiruan = item.id % 3 === 0 ? 'Denpasar' : (item.id % 3 === 1 ? 'Buleleng' : 'Ubud');

  return (
    <Link to={`/kendaraan/${item.id}`} className="search-card-link">
      <div className="search-card">
        <div className="search-card-image">
          <img 
            src={item.gambar_url} 
            alt={item.nama} 
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x100/e0e0e0/777?text=Gambar"; }} 
          />
        </div>
        <div className="search-card-info">
          <h3 className="search-card-title">{item.nama}</h3>
          <p className="search-card-subtitle">Warna {warnaTiruan}</p>
          <p className="search-card-price">
            {formattedPrice}
          </p>
          <p className="search-card-location">{lokasiTiruan}</p>
        </div>
      </div>
    </Link>
  );
}

// Komponen Ikon untuk Bottom Nav
const NavIcon = ({ d, label, active, to }) => ( 
  <Link to={to} className={`bottom-nav-item ${active ? 'active' : ''}`}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{label}</span>
  </Link>
);


// Komponen Utama Halaman Pencarian
function Pencarian() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- TAMBAHAN BARU: State untuk Kategori ---
  const [activeCategory, setActiveCategory] = useState('semua'); // 'semua', 'Mobil', 'Motor'

  // Mengambil semua data saat halaman dimuat
  useEffect(() => {
    async function fetchAllData() {
      try {
        const response = await axios.get('http://localhost:8000/api/kendaraan');
        const allItems = [...response.data.mobil, ...response.data.motor]; 
        setResults(allItems);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // --- PERBAIKAN: Filter berdasarkan Query DAN Kategori ---
  const filteredResults = results.filter(item => {
    // 1. Filter berdasarkan Query (input teks)
    const matchesQuery = item.nama.toLowerCase().includes(query.toLowerCase());
    
    // 2. Filter berdasarkan Kategori (tombol)
    const matchesCategory = (activeCategory === 'semua') || (item.tipe === activeCategory);
    
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="pencarian-container">
      {/* Header Pencarian (Fixed di atas) */}
      <header className="pencarian-header">
        <Link to="/beranda" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/>
          </svg>
          Back
        </Link>

        <div className="search-input-wrapper">
          <input 
            className="search-input"
            type="text"
            placeholder="Cari kendaraan di Bali..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="clear-button" onClick={() => setQuery('')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        <button className="filter-button" aria-label="Filter">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M7 12H17M12 18H12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* --- TAMBAHAN BARU: Tombol Kategori --- */}
      <div className="category-selector">
        <button 
          className={`category-btn ${activeCategory === 'semua' ? 'active' : ''}`}
          onClick={() => setActiveCategory('semua')}
        >
          Semua
        </button>
        <button 
          className={`category-btn ${activeCategory === 'Mobil' ? 'active' : ''}`}
          onClick={() => setActiveCategory('Mobil')}
        >
          Mobil
        </button>
        <button 
          className={`category-btn ${activeCategory === 'Motor' ? 'active' : ''}`}
          onClick={() => setActiveCategory('Motor')}
        >
          Motor
        </button>
      </div>
      {/* --- AKHIR TAMBAHAN --- */}


      {/* Daftar Hasil */}
      <main className="search-results">
        {loading ? (
          <p className="loading-text">Memuat hasil pencarian...</p>
        ) : filteredResults.length > 0 ? (
          filteredResults.map(item => (
            <SearchResultCard key={item.id} item={item} />
          ))
        ) : (
          <p className="no-results-text">Tidak ada kendaraan yang cocok dengan pencarian Anda.</p>
        )}
      </main>

      {/* Navbar Bawah (Fixed di bawah) */}
      <nav className="bottom-nav">
        <NavIcon
          label="Beranda"
          active={false}
          to="/beranda"
          d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        />
        <NavIcon
          label="Pencarian"
          active={true}
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
          active={false}
          to="/profil"
          d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        />
      </nav>
    </div>
  );
}

export default Pencarian;