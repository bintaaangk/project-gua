import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Pencarian.css';

// Komponen Navigasi Bawah (Konsisten dengan Profil)
const NavIcon = ({ d, label, active, to }) => ( 
  <Link to={to} className={`bottom-nav-item ${active ? 'active' : ''}`}>
    <div className="nav-icon-wrapper">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={d} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
    <span>{label}</span>
  </Link>
);

// Komponen Card Hasil Pencarian (Mobile Style)
function SearchResultCard({ item }) {
  const formattedPrice = `Rp ${item.harga_per_hari.toLocaleString('id-ID')}`;
  
  // Simulasi data jarak & lokasi
  const jarak = item.jarak || (Math.random() * 10 + 1).toFixed(1); 
  const lokasiTiruan = item.id % 2 === 0 ? 'Kuta' : 'Denpasar';

  return (
    <Link to={`/kendaraan/${item.id}`} className="mobile-search-card">
      {/* Gambar di Kiri */}
      <div className="card-img-wrapper">
        <img 
          src={item.gambar_url} 
          alt={item.nama} 
          className="card-img"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x100/e0e0e0/777?text=Gambar"; }} 
        />
        <span className="badge-type">{item.tipe}</span>
      </div>

      {/* Info di Kanan */}
      <div className="card-info">
        <div className="card-header">
          <h3 className="item-name">{item.nama}</h3>
          <span className="item-distance">
             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
             {jarak} km • {lokasiTiruan}
          </span>
        </div>
        
        <div className="card-bottom">
          <div className="price-wrapper">
            <span className="price-label">Mulai dari</span>
            <span className="price-amount">{formattedPrice}<small>/hari</small></span>
          </div>
          <button className="btn-pesan">Pesan</button>
        </div>
      </div>
    </Link>
  );
}

function Pencarian() {
  const [query, setQuery] = useState('');
  const [originalData, setOriginalData] = useState([]); 
  const [displayedResults, setDisplayedResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Filter
  const [activeCategory, setActiveCategory] = useState('Semua'); 
  const [activeSort, setActiveSort] = useState('default'); 

  useEffect(() => {
    // Simulasi Fetch Data
    async function fetchAllData() {
      try {
        const response = await axios.get('http://localhost:8000/api/kendaraan');
        const allItems = [...response.data.mobil, ...response.data.motor].map(item => ({
            ...item,
            jarak: (Math.random() * 15 + 0.5).toFixed(1)
        }));
        
        setOriginalData(allItems);
        setDisplayedResults(allItems);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // Logika Filtering
  useEffect(() => {
    let updatedList = [...originalData];

    if (query) {
        updatedList = updatedList.filter(item => 
            item.nama.toLowerCase().includes(query.toLowerCase())
        );
    }
    if (activeCategory !== 'Semua') {
        updatedList = updatedList.filter(item => item.tipe === activeCategory);
    }
    if (activeSort === 'terdekat') {
        updatedList.sort((a, b) => parseFloat(a.jarak) - parseFloat(b.jarak));
    } else if (activeSort === 'termurah') {
        updatedList.sort((a, b) => a.harga_per_hari - b.harga_per_hari);
    }
    setDisplayedResults(updatedList);

  }, [query, activeCategory, activeSort, originalData]);

  return (
    <div className="pencarian-page">
      
      {/* HEADER FIXED & FILTER */}
      <div className="sticky-search-header">
          {/* Baris Pencarian */}
          <div className="search-bar-row">
            <Link to="/beranda" className="btn-back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </Link>
            <div className="input-container">
               <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
               <input 
                 type="text" 
                 placeholder="Cari kendaraan..." 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
               />
               {query && <button className="btn-clear" onClick={() => setQuery('')}>✕</button>}
            </div>
          </div>

          {/* Baris Filter (Scroll Horizontal) */}
          <div className="filter-scroll-container">
             <button className={`filter-chip ${activeCategory === 'Semua' ? 'active' : ''}`} onClick={() => setActiveCategory('Semua')}>Semua</button>
             <button className={`filter-chip ${activeCategory === 'Mobil' ? 'active' : ''}`} onClick={() => setActiveCategory('Mobil')}>🚗 Mobil</button>
             <button className={`filter-chip ${activeCategory === 'Motor' ? 'active' : ''}`} onClick={() => setActiveCategory('Motor')}>🛵 Motor</button>
             <div className="vertical-sep"></div>
             <button className={`filter-chip ${activeSort === 'terdekat' ? 'active-blue' : ''}`} onClick={() => setActiveSort(activeSort === 'terdekat' ? 'default' : 'terdekat')}>📍 Terdekat</button>
             <button className={`filter-chip ${activeSort === 'termurah' ? 'active-blue' : ''}`} onClick={() => setActiveSort(activeSort === 'termurah' ? 'default' : 'termurah')}>💲 Termurah</button>
          </div>
      </div>

      {/* CONTENT LIST */}
      <div className="search-content">
        {loading ? (
          <div className="state-message">Memuat data...</div>
        ) : displayedResults.length > 0 ? (
           displayedResults.map(item => <SearchResultCard key={item.id} item={item} />)
        ) : (
          <div className="state-message">
             <div style={{fontSize: '40px', marginBottom: '10px'}}>🔍</div>
             <p>Tidak ditemukan.</p>
             <button className="btn-reset-filter" onClick={() => {setQuery(''); setActiveCategory('Semua'); setActiveSort('default')}}>Reset Filter</button>
          </div>
        )}
      </div>

      {/* NAVBAR BAWAH */}
      <nav className="bottom-nav">
        <NavIcon label="Beranda" active={false} to="/beranda" d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
        <NavIcon label="Pencarian" active={true} to="/pencarian" d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65" />
        <NavIcon label="Riwayat" active={false} to="/riwayat" d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" />
        <NavIcon label="Profil" active={false} to="/profil" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" />
      </nav>
    </div>
  );
}

export default Pencarian;