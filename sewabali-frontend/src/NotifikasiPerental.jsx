import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NotifikasiPerental.css';

const NotifikasiPerental = () => {
    const navigate = useNavigate();

    // --- STATE NOTIFIKASI (Sekarang kosong karena akan ambil dari Database) ---
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- STATE UNTUK MODAL DETAIL ---
    const [selectedNotif, setSelectedNotif] = useState(null);

    // --- FUNGSI AMBIL DATA DARI DATABASE ---
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token'); // Pastikan token tersimpan saat login
            const response = await axios.get('http://localhost:8000/api/notifikasi', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil notifikasi:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Polling sederhana: Cek notifikasi baru setiap 20 detik (opsional)
        const interval = setInterval(fetchNotifications, 20000);
        return () => clearInterval(interval);
    }, []);

    // --- FUNGSI TANDAI SEMUA DIBACA (API) ---
    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8000/api/notifikasi/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh data setelah update
            fetchNotifications();
        } catch (error) {
            console.error("Gagal menandai semua dibaca:", error);
        }
    };

    // --- FUNGSI KLIK ITEM (TANDAI DIBACA & BUKA MODAL) ---
    const handleItemClick = async (notif) => {
        if (!notif.isRead) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:8000/api/notifikasi/${notif.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Refresh data agar status unread di UI hilang
                fetchNotifications();
            } catch (error) {
                console.error("Gagal menandai dibaca:", error);
            }
        }
        setSelectedNotif(notif);
    };

    // --- FUNGSI TUTUP MODAL ---
    const closeModal = () => {
        setSelectedNotif(null);
    };

    // --- HELPER RENDER ICON ---
    const renderIcon = (type) => {
        switch(type) {
            case 'order': return '📦';
            case 'success': return '✅';
            case 'alert': return '⚠️';
            case 'system': return '🔑';
            default: return '📢';
        }
    };

    // --- HELPER AKSI TOMBOL DI MODAL ---
   // --- HELPER AKSI TOMBOL DI MODAL ---
const handleModalAction = () => {
    if (selectedNotif?.type === 'order') {
        // Langsung bawa perental ke daftar pesanan masuk
        navigate('/pesanan-masuk');
    } else if (selectedNotif?.type === 'success') {
        // Jika ada id_kendaraan di data notif, arahkan ke detailnya
        if (selectedNotif.id_kendaraan) {
            navigate(`/perental/kendaraan/${selectedNotif.id_kendaraan}`);
        } else {
            // Fallback jika id tidak ditemukan
            navigate('/perental/dashboard');
        }
    } else {
        closeModal();
    }
};

    return (
        <div className="mobile-wrapper">
            {/* HEADER */}
            <header className="header-simple">
                <button className="btn-back-simple" onClick={() => navigate('/perental/dashboard')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div className="header-title-simple">Notifikasi</div>
                <button className="btn-mark-read" onClick={handleMarkAllRead}>Baca Semua</button>
            </header>

            {/* LIST NOTIFIKASI */}
            <div className="notif-list">
                {loading ? (
                    <div className="empty-state-notif">
                        <p>Memuat notifikasi...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="empty-state-notif">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        <h3>Tidak ada notifikasi</h3>
                        <p>Semua informasi terbaru akan muncul di sini.</p>
                    </div>
                ) : (
                    notifications.map(item => (
                        <div 
                            key={item.id} 
                            className={`notif-item ${!item.isRead ? 'unread' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <div className={`notif-icon-box ${item.type}`}>
                                {renderIcon(item.type)}
                            </div>
                            <div className="notif-content">
                                <h4 className="notif-title">{item.title}</h4>
                                <p className="notif-desc">
                                    {item.desc}
                                </p>
                                <span className="notif-time">{item.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- MODAL POPUP DETAIL --- */}
            {selectedNotif && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Detail Notifikasi</span>
                            <button className="btn-close-modal" onClick={closeModal}>✕</button>
                        </div>

                        <div className={`detail-icon-large ${selectedNotif.type}`}>
                            {renderIcon(selectedNotif.type)}
                        </div>

                        <h2 className="detail-title">{selectedNotif.title}</h2>
                        <span className="detail-time">{selectedNotif.time}</span>
                        
                        <p className="detail-desc">
                            {selectedNotif.desc}
                        </p>

                        <button className="btn-action-primary" onClick={handleModalAction}>
                            {selectedNotif.type === 'order' ? 'Verifikasi Sekarang' : 
                             selectedNotif.type === 'success' ? 'Cek Unit Saya' : 'Tutup'}
                        </button>
                    </div>
                </div>
            )}

            {/* BOTTOM NAV */}
            <nav className="bottom-nav-float">
                <button className="nav-btn" onClick={() => navigate('/perental/dashboard')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </button>
                <button className="nav-btn" onClick={() => navigate('/pesanan-masuk')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>Pesanan</span>
                </button>
                <button className="nav-btn" onClick={() => navigate('/perental/profil')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Profil</span>
                </button>
            </nav>
        </div>
    );
};

export default NotifikasiPerental;