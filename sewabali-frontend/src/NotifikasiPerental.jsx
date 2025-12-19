import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotifikasiPerental.css';

const NotifikasiPerental = () => {
    const navigate = useNavigate();

    // --- DATA DUMMY NOTIFIKASI ---
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'order', // order, system, success, alert
            title: 'Pesanan Baru Masuk! 📦',
            desc: 'Halo Bos! Ada pelanggan bernama Budi Santoso yang ingin menyewa Toyota Avanza Zenix untuk tanggal 20-23 Nov. Silakan cek ketersediaan unit dan konfirmasi pesanan ini segera agar pelanggan tidak menunggu lama.',
            time: '2 Menit yang lalu',
            isRead: false
        },
        {
            id: 2,
            type: 'success',
            title: 'Saldo Masuk Rp 1.050.000',
            desc: 'Hore! Pembayaran dari transaksi #TRX-998877 telah berhasil diverifikasi oleh sistem. Dana sudah masuk ke dompet saldo Anda dan bisa ditarik kapan saja.',
            time: '1 Jam yang lalu',
            isRead: false
        },
        {
            id: 3,
            type: 'alert',
            title: 'Unit Perlu Servis 🔧',
            desc: 'Peringatan sistem: Jadwal servis rutin Honda Brio RS sudah dekat (KM 49.000). Harap segera lakukan perawatan berkala untuk menjaga performa kendaraan dan keselamatan penyewa.',
            time: 'Kemarin',
            isRead: true
        },
        {
            id: 4,
            type: 'system',
            title: 'Selamat Datang di SewaBali',
            desc: 'Akun Anda berhasil diverifikasi. Mulai tambahkan unit kendaraan Anda sekarang juga untuk mendapatkan pelanggan pertama Anda!',
            time: '3 Hari yang lalu',
            isRead: true
        }
    ]);

    // --- STATE UNTUK MODAL DETAIL ---
    const [selectedNotif, setSelectedNotif] = useState(null); // Menyimpan notif yg diklik

    // Fungsi Tandai Semua Dibaca
    const handleMarkAllRead = () => {
        const updated = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updated);
        alert("Semua notifikasi ditandai sudah dibaca.");
    };

    // Fungsi Klik Item (Buka Modal)
    const handleItemClick = (notif) => {
        // 1. Tandai sudah dibaca
        const updated = notifications.map(n => 
            n.id === notif.id ? { ...n, isRead: true } : n
        );
        setNotifications(updated);

        // 2. Set data notif yang dipilih & Buka Modal
        setSelectedNotif(notif);
    };

    // Fungsi Tutup Modal
    const closeModal = () => {
        setSelectedNotif(null);
    };

    // Helper render Icon (Dipakai di list & modal)
    const renderIcon = (type) => {
        switch(type) {
            case 'order': return '📦';
            case 'success': return '💰';
            case 'alert': return '⚠️';
            default: return '📢';
        }
    };

    // Helper Aksi Tombol di Modal
    const handleModalAction = () => {
        if (selectedNotif?.type === 'order') {
            navigate('/pesanan-masuk');
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
                {notifications.length === 0 ? (
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
                                <p className="notif-desc" style={{
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    maxWidth: '220px'
                                }}>
                                    {item.desc}
                                </p>
                                <span className="notif-time">{item.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- MODAL POPUP DETAIL (BARU) --- */}
            {selectedNotif && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Detail Pesan</span>
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
                            {selectedNotif.type === 'order' ? 'Lihat Pesanan' : 'Tutup'}
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