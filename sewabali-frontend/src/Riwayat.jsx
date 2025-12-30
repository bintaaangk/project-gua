import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalPengingat from './ModalPengingat'; 
import './Riwayat.css'; 

const NavIcon = ({ d, label, active, to }) => ( 
  <Link to={to} className={`bottom-nav-item ${active ? 'active' : ''}`}>
    <div className="nav-icon-wrapper">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
    <span>{label}</span>
  </Link>
);

function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('semua');
  
  // --- STATE UNTUK PENGINGAT ---
  const [showReminder, setShowReminder] = useState(false);
  const [reminderData, setReminderData] = useState(null);
  
  const navigate = useNavigate();

  const fetchRiwayat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/riwayat', {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json' // Penting agar tidak diarahkan ke rute login
        }
      });
      
      setRiwayat(response.data);
    } catch (error) {
      console.error('Gagal mengambil riwayat:', error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI CEK PENGINGAT (DENGAN HEADER YANG DIPERBAIKI) ---
  const checkDeadline = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log("Mengecek pengingat dengan token:", token); // Cek apakah token ada

        const response = await axios.get('http://127.0.0.1:8000/api/pengingat-tenggat', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' 
            }
        });

        console.log("Respon Server:", response.data); // LIHAT DI CONSOLE F12

        if (response.data.ada_tenggat) {
            setReminderData(response.data);
            setShowReminder(true);
        }
    } catch (err) {
        console.error("Error Pengingat:", err.response?.data || err.message);
    }
};

  useEffect(() => {
    fetchRiwayat();
    checkDeadline(); 
  }, []);

  const filteredRiwayat = riwayat.filter((item) => {
    const status = (item.status || "").toLowerCase();
    if (activeTab === 'semua') return true;
    if (activeTab === 'menunggu') return status.includes('menunggu') || status.includes('verifikasi');
    if (activeTab === 'selesai') return status === 'selesai';
    if (activeTab === 'batal') return status === 'batal' || status === 'rejected';
    return status === activeTab;
  });

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes('menunggu') || s.includes('verifikasi')) return 'badge-warning';
    if (s === 'selesai' || s === 'dalam_sewa') return 'badge-success';
    if (s === 'batal' || s === 'rejected') return 'badge-danger';
    return 'badge-default';
  };

  const formatStatus = (status) => {
    return (status || "PENDING").replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="riwayat-page">
      <div className="sticky-header">
          <div className="header-title-area">
            <h1>Riwayat Transaksi</h1>
          </div>
          
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
      
      <div className="riwayat-list">
        {loading ? (
            <div className="loading-state">Memuat riwayat...</div>
        ) : filteredRiwayat.length > 0 ? (
            filteredRiwayat.map((item) => (
                <div key={item.id_pemesanan} className="transaction-card">
                    <div className="card-header">
                        <span className="date-text">
                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className={`status-badge ${getStatusClass(item.status)}`}>
                            {formatStatus(item.status)}
                        </span>
                    </div>

                    <div className="card-body">
                        <img 
                            src={item.kendaraan?.gambar_url || "https://via.placeholder.com/150?text=Mobil"} 
                            alt={item.kendaraan?.nama} 
                            className="vehicle-thumb"
                        />
                        <div className="vehicle-info">
                            <h3 className="vehicle-name">{item.kendaraan?.nama || 'Unit Dihapus'}</h3>
                            <p className="order-id">ID: #{item.id_pemesanan} • {item.durasi_hari} Hari</p>
                            <h4 className="price">Rp {Number(item.total_harga).toLocaleString('id-ID')}</h4>
                        </div>
                    </div>

                    <div className="card-actions">
                        <Link to={`/riwayat/${item.id_pemesanan}`} className="btn-action outline">
                            Lihat Detail
                        </Link>
                        {item.status === 'menunggu_pembayaran' && (
                            <Link to={`/pembayaran/${item.id_pemesanan}`} className="btn-action primary">
                                Bayar Sekarang
                            </Link>
                        )}
                        {item.status === 'menunggu_dokumen' && (
                            <Link to={`/unggah-dokumen/${item.id_pemesanan}`} className="btn-action warning">
                                Unggah Dokumen
                            </Link>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>Belum ada transaksi</h3>
                <p>Silakan lakukan pemesanan kendaraan terlebih dahulu.</p>
            </div>
        )}
      </div>

      {/* --- MODAL PENGINGAT DI SINI --- */}
      <ModalPengingat 
          show={showReminder} 
          onClose={() => setShowReminder(false)} 
          data={reminderData} 
      />

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