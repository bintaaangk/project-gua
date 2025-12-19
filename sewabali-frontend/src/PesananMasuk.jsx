import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PesananMasuk.css';

const API_URL = 'http://localhost:8000/api';

const PesananMasuk = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    // --- FETCH DATA ---
    useEffect(() => {
        if (!token) { navigate('/login'); return; }

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/transaksi/perental`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Gagal ambil pesanan:", error);
                // DUMMY DATA (Jika backend belum siap)
                setOrders([
                    {
                        id: 1,
                        kode: 'TRX-998877',
                        penyewa: 'Budi Santoso',
                        unit: 'Toyota Avanza Zenix',
                        tgl_sewa: '20 Nov',
                        tgl_kembali: '23 Nov',
                        total: 1050000,
                        status: 'Menunggu'
                    },
                    {
                        id: 2,
                        kode: 'TRX-112233',
                        penyewa: 'Siti Aminah',
                        unit: 'Honda Brio RS',
                        tgl_sewa: '01 Des',
                        tgl_kembali: '02 Des',
                        total: 350000,
                        status: 'Aktif'
                    },
                    {
                        id: 3,
                        kode: 'TRX-445566',
                        penyewa: 'Joko Anwar',
                        unit: 'Mitsubishi Xpander',
                        tgl_sewa: '05 Des',
                        tgl_kembali: '08 Des',
                        total: 1200000,
                        status: 'Selesai'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate, token]);

    const handleAction = (id, action) => {
        if(!window.confirm(`Yakin ingin ${action} pesanan ini?`)) return;
        alert(`Pesanan berhasil di-${action}!`);
    };

    if (loading) return <div className="mobile-wrapper" style={{justifyContent:'center', alignItems:'center', color:'#94a3b8'}}>Memuat...</div>;

    return (
        <div className="mobile-wrapper">
            {/* --- HEADER --- */}
            <header className="mobile-header">
                <button className="btn-back-soft" onClick={() => navigate('/perental/dashboard')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div className="header-title">
                    <h3>Pesanan Masuk</h3>
                </div>
                <div style={{width: 40}}></div>
            </header>

            {/* --- CONTENT --- */}
            <div className="mobile-content">
                {orders.length === 0 ? (
                    <div className="empty-illustration">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 8v13H3V8M1 3h22v5H1V3z"/><path d="M10 12h4"/></svg>
                        <p>Belum ada pesanan masuk.</p>
                    </div>
                ) : (
                    <>
                        {orders.map(item => (
                            <div key={item.id} className="order-card-premium">
                                {/* Baris Atas: Kode & Status */}
                                <div className="card-top-row">
                                    <span className="trx-badge">#{item.kode}</span>
                                    <span className={`status-dot-badge ${item.status.toLowerCase()}`}>
                                        <span className="dot"></span> {item.status}
                                    </span>
                                </div>

                                {/* Info Mobil */}
                                <div className="car-info">
                                    <h3 className="car-name">{item.unit}</h3>
                                    <div className="renter-row">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        <span>{item.penyewa}</span>
                                    </div>
                                </div>

                                {/* Timeline Ticket Style */}
                                <div className="timeline-ticket">
                                    <div className="time-box">
                                        <span className="time-label">Ambil</span>
                                        <span className="time-date">{item.tgl_sewa}</span>
                                    </div>
                                    <div className="time-connector">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                                    </div>
                                    <div className="time-box" style={{alignItems:'flex-end'}}>
                                        <span className="time-label">Kembali</span>
                                        <span className="time-date">{item.tgl_kembali}</span>
                                    </div>
                                </div>

                                {/* Footer & Action */}
                                <div className="card-bottom-row">
                                    <div className="price-block">
                                        <small>Total Pendapatan</small>
                                        <span className="amount">Rp {item.total.toLocaleString('id-ID')}</span>
                                    </div>

                                    {item.status === 'Menunggu' && (
                                        <div className="btn-group">
                                            <button className="btn-pill btn-reject" onClick={()=>handleAction(item.id, 'tolak')}>Tolak</button>
                                            <button className="btn-pill btn-accept" onClick={()=>handleAction(item.id, 'terima')}>Terima</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* --- FLOATING NAVBAR (SAMA DENGAN DASHBOARD) --- */}
            <nav className="bottom-nav-float">
                {/* 1. Tombol HOME: Mengarahkan kembali ke Dashboard */}
                <button className="nav-btn" onClick={() => navigate('/perental/dashboard')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </button>

                {/* 2. Tombol PESANAN: Status Active (Biru) karena sedang di halaman ini */}
                <button className="nav-btn active">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>Pesanan</span>
                </button>

                {/* 3. Tombol PROFIL */}
               <button className="nav-btn" onClick={() => navigate('/perental/profil')}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    <span>Profil</span>
</button>
            </nav>
        </div>
    );
};

export default PesananMasuk;