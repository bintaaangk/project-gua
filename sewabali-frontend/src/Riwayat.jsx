import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Riwayat.css'; 

// Komponen Navigasi Bawah
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

// Data Mockup
const MOCK_HISTORY_INIT = [
    {
        id: 99,
        kendaraan: "Toyota Avanza 2023",
        tanggal: "01 Jan 2025",
        durasi: "1 Hari",
        total: 500000,
        status: "Selesai",
        img: "https://placehold.co/150x100/3b82f6/white?text=Avanza"
    },
    {
        id: 56,
        kendaraan: "Innova Reborn",
        tanggal: "15 Jan 2025",
        durasi: "3 Hari",
        total: 1500000,
        status: "Menunggu Verifikasi",
        img: "https://placehold.co/150x100/f59e0b/white?text=Innova"
    },
    {
        id: 55,
        kendaraan: "Honda Vario 160",
        tanggal: "12 Des 2024",
        durasi: "2 Hari",
        total: 300000,
        status: "Dibatalkan",
        img: "https://placehold.co/150x100/ef4444/white?text=Vario"
    }
];

function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [activeTab, setActiveTab] = useState('semua');

  useEffect(() => {
    // Ambil data dari LocalStorage atau gunakan Mockup
    const savedDataJSON = localStorage.getItem('userTransactionHistory');
    let savedData = [];
    if (savedDataJSON) {
        try { savedData = JSON.parse(savedDataJSON); } catch (e) { console.error(e); }
    }
    setRiwayat(savedData.length > 0 ? savedData : MOCK_HISTORY_INIT);
  }, []);

  // Logika Filter Tab
  const filteredRiwayat = riwayat.filter((item) => {
    if (activeTab === 'semua') return true;
    if (activeTab === 'menunggu') return item.status === 'Menunggu Verifikasi';
    if (activeTab === 'selesai') return item.status === 'Selesai';
    if (activeTab === 'batal') return item.status === 'Dibatalkan';
    return item.status === activeTab;
  });

  // Helper warna badge status
  const getStatusClass = (status) => {
      if (status === 'Selesai') return 'badge-success';
      if (status === 'Menunggu Verifikasi') return 'badge-warning';
      if (status === 'Dibatalkan') return 'badge-danger';
      return 'badge-default';
  };

  return (
    <div className="riwayat-page">
      
      {/* HEADER FIXED */}
      <div className="sticky-header">
          <div className="header-title-area">
            <h1>Riwayat Transaksi</h1>
          </div>
          
          {/* TABS SCROLLABLE */}
          <div className="tabs-wrapper">
            {['semua', 'menunggu', 'selesai', 'batal'].map((tab) => (
                <button 
                    key={tab}
                    className={`tab-pill ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
          </div>
      </div>
      
      {/* LIST KONTEN */}
      <div className="riwayat-list">
        {filteredRiwayat.length > 0 ? (
            filteredRiwayat.map((item, idx) => (
                <div key={idx} className="transaction-card">
                    
                    {/* Baris Atas: Tanggal & Status */}
                    <div className="card-header">
                        <span className="date-text">{item.tanggal}</span>
                        <span className={`status-badge ${getStatusClass(item.status)}`}>
                            {item.status}
                        </span>
                    </div>

                    {/* Baris Tengah: Gambar & Info */}
                    <div className="card-body">
                        <img 
                            src={item.img} 
                            alt={item.kendaraan} 
                            className="vehicle-thumb"
                            onError={(e)=>{e.target.src="https://placehold.co/100x70/e0e0e0/777?text=N/A"}} 
                        />
                        <div className="vehicle-info">
                            <h3 className="vehicle-name">{item.kendaraan}</h3>
                            <p className="order-id">ID: #{item.id} • {item.durasi}</p>
                            <h4 className="price">Rp {Number(item.total).toLocaleString('id-ID')}</h4>
                        </div>
                    </div>

                    {/* Baris Bawah: Tombol Aksi */}
                    <div className="card-actions">
                        {item.status === 'Menunggu Verifikasi' ? (
                             // PERUBAHAN: Tombol diubah dari "Bayar Sekarang" menjadi "Cek Status" atau "Unggah Bukti"
                             // Karena user biasanya sudah di tahap menunggu verifikasi admin
                             <Link to={`/riwayat/${item.id}`} className="btn-action primary">
                                Lihat Status
                             </Link>
                        ) : (
                             <Link to={`/riwayat/${item.id}`} className="btn-action outline">Lihat Detail</Link>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>Belum ada transaksi</h3>
                <p>Tidak ada riwayat pada status ini.</p>
            </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <NavIcon label="Beranda" active={false} to="/beranda" d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
        <NavIcon label="Pencarian" active={false} to="/pencarian" d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65" />
        <NavIcon label="Riwayat" active={true} to="/riwayat" d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" />
        <NavIcon label="Profil" active={false} to="/profil" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" />
      </nav>
    </div>
  );
}

export default Riwayat;