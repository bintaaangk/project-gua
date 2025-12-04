import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Riwayat.css'; // File CSS

// Komponen Ikon untuk Bottom Nav
const NavIcon = ({ d, label, active, to }) => ( 
  <Link to={to} className={`bottom-nav-item ${active ? 'active' : ''}`}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{label}</span>
  </Link>
);

// Data Tiruan Riwayat (Mock Data)
const MOCK_HISTORY = [
    {
        id: 101,
        kendaraan: "Innova Zenix 2024",
        tanggal: "03 Nov 2025",
        durasi: "1 Hari",
        total: 750000,
        status: "Menunggu Verifikasi",
        img: "https://placehold.co/100x70/007bff/FFFFFF?text=Innova"
    },
    {
        id: 102,
        kendaraan: "Pajero Sport Dakar",
        tanggal: "05 Nov 2025",
        durasi: "3 Hari",
        total: 2700000,
        status: "Menunggu Verifikasi",
        img: "https://placehold.co/100x70/333333/FFFFFF?text=Pajero"
    },
    {
        id: 98,
        kendaraan: "Yamaha Nmax 155",
        tanggal: "20 Okt 2025",
        durasi: "2 Hari",
        total: 300000,
        status: "Selesai",
        img: "https://placehold.co/100x70/ffc107/333333?text=Nmax"
    },
    {
        id: 55,
        kendaraan: "Avanza 2011",
        tanggal: "10 Sep 2025",
        durasi: "1 Hari",
        total: 500000,
        status: "Dibatalkan",
        img: "https://placehold.co/100x70/198754/FFFFFF?text=Avanza"
    }
];

function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  // State untuk tab aktif (default: 'semua')
  const [activeTab, setActiveTab] = useState('semua');

  useEffect(() => {
    setRiwayat(MOCK_HISTORY);
  }, []);

  // Fungsi untuk memfilter data berdasarkan tab yang aktif
  const filteredRiwayat = riwayat.filter((item) => {
    if (activeTab === 'semua') return true;
    if (activeTab === 'menunggu') return item.status === 'Menunggu Verifikasi';
    if (activeTab === 'selesai') return item.status === 'Selesai';
    if (activeTab === 'batal') return item.status === 'Dibatalkan';
    return true;
  });

  // Fungsi untuk menentukan warna badge status
  const getStatusClass = (status) => {
      switch(status) {
          case 'Selesai': return 'status-success';
          case 'Menunggu Verifikasi': return 'status-warning';
          case 'Dibatalkan': return 'status-danger';
          default: return 'status-default';
      }
  };

  return (
    <div className="riwayat-container">
      {/* Header */}
      <header className="riwayat-header">
        <h1>Riwayat Transaksi</h1>
      </header>

      {/* --- TAB KATEGORI --- */}
      <div className="history-tabs">
        <button 
          className={`history-tab-btn ${activeTab === 'semua' ? 'active' : ''}`}
          onClick={() => setActiveTab('semua')}
        >
          Semua
        </button>
        <button 
          className={`history-tab-btn ${activeTab === 'menunggu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menunggu')}
        >
          Menunggu
        </button>
        <button 
          className={`history-tab-btn ${activeTab === 'selesai' ? 'active' : ''}`}
          onClick={() => setActiveTab('selesai')}
        >
          Selesai
        </button>
        <button 
          className={`history-tab-btn ${activeTab === 'batal' ? 'active' : ''}`}
          onClick={() => setActiveTab('batal')}
        >
          Dibatalkan
        </button>
      </div>
      {/* -------------------- */}

      {/* Konten List Riwayat */}
      <main className="riwayat-content">
        {filteredRiwayat.length > 0 ? (
            filteredRiwayat.map((item) => (
                <div key={item.id} className="history-card">
                    <div className="history-card-top">
                        <div className="history-id">Order ID: #{item.id}</div>
                        <div className="history-date">{item.tanggal}</div>
                    </div>
                    
                    <div className="history-card-body">
                        <img src={item.img} alt={item.kendaraan} className="history-img" />
                        <div className="history-info">
                            <h3>{item.kendaraan}</h3>
                            <p>Durasi: {item.durasi}</p>
                            <p className="history-price">Rp {item.total.toLocaleString('id-ID')}</p>
                        </div>
                    </div>

                    <div className="history-card-footer">
                        <span className={`status-badge ${getStatusClass(item.status)}`}>
                            {item.status}
                        </span>
                        {item.status === 'Menunggu Verifikasi' && (
     <Link to={`/riwayat/${item.id}`} className="btn-action-small" style={{textDecoration:'none', display:'inline-block'}}>
        Lihat
     </Link>
)}
                    </div>
                </div>
            ))
        ) : (
            <div className="empty-state">
                <p>Tidak ada riwayat transaksi di kategori ini.</p>
            </div>
        )}
      </main>

      {/* Navbar Bawah (Fixed) */}
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
          active={true}
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

export default Riwayat;