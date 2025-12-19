import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Notifikasi.css';

// Data Mockup Notifikasi
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'payment',
    title: 'Pembayaran Berhasil',
    message: 'Pembayaran untuk Innova Zenix berhasil diverifikasi oleh sistem. Anda sekarang dapat melihat detail pesanan di halaman Riwayat. Terima kasih telah menggunakan layanan kami!',
    time: 'Baru saja',
    isRead: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Menunggu Verifikasi',
    message: 'Dokumen KTP dan SIM Anda sedang diperiksa oleh admin. Proses ini biasanya memakan waktu maksimal 1x24 jam. Kami akan memberitahu Anda segera setelah disetujui.',
    time: '2 jam lalu',
    isRead: false,
  },
  {
    id: 3,
    type: 'promo',
    title: 'Diskon Spesial Bali!',
    message: 'Liburan makin hemat! Gunakan kode promo BALISERU untuk mendapatkan diskon 20% untuk semua penyewaan motor minggu ini. Berlaku hingga 30 Desember.',
    time: '1 hari lalu',
    isRead: true,
  },
  {
    id: 4,
    type: 'system',
    title: 'Selamat Datang',
    message: 'Terima kasih telah mendaftar di SewaBali.id. Silakan lengkapi profil Anda (Foto & Alamat) untuk kemudahan transaksi penyewaan ke depannya.',
    time: '3 hari lalu',
    isRead: true,
  }
];

function Notifikasi() {
  const [notifList, setNotifList] = useState(INITIAL_NOTIFICATIONS);
  
  // State untuk Modal Detail
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fungsi Buka Notifikasi
  const handleOpenNotif = (item) => {
    setSelectedNotif(item);
    setShowModal(true);

    // Otomatis tandai sebagai sudah dibaca saat dibuka
    if (!item.isRead) {
        const updatedList = notifList.map(n => 
            n.id === item.id ? { ...n, isRead: true } : n
        );
        setNotifList(updatedList);
    }
  };

  // Fungsi Tutup Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedNotif(null), 300); // Delay biar animasi selesai dulu
  };

  const markAllRead = () => {
    const updatedList = notifList.map(item => ({ ...item, isRead: true }));
    setNotifList(updatedList);
  };

  const clearAll = () => {
    if(window.confirm("Hapus semua notifikasi?")) {
        setNotifList([]);
    }
  };

  const getIcon = (type) => {
    switch(type) {
        case 'payment': return <span className="notif-icon green">💸</span>;
        case 'promo': return <span className="notif-icon orange">🎉</span>;
        case 'info': return <span className="notif-icon blue">ℹ️</span>;
        default: return <span className="notif-icon gray">🔔</span>;
    }
  };

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <Link to="/beranda" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Notifikasi</span>
        <div style={{width: 40}}></div>
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Actions Bar */}
        {notifList.length > 0 && (
            <div className="notif-actions">
                <button onClick={markAllRead} className="btn-text-action">Tandai semua dibaca</button>
                <button onClick={clearAll} className="btn-text-action danger">Hapus semua</button>
            </div>
        )}

        {/* List Notifikasi */}
        <div className="notif-list">
            {notifList.length > 0 ? (
                notifList.map((item) => (
                    <div 
                        key={item.id} 
                        className={`notif-item ${item.isRead ? 'read' : 'unread'}`}
                        onClick={() => handleOpenNotif(item)}
                    >
                        <div className="notif-left">
                            {getIcon(item.type)}
                        </div>
                        <div className="notif-mid">
                            <div className="notif-head">
                                <h4>{item.title}</h4>
                                <span className="time">{item.time}</span>
                            </div>
                            <p>{item.message}</p>
                        </div>
                        {!item.isRead && <div className="notif-dot"></div>}
                    </div>
                ))
            ) : (
                <div className="empty-notif">
                    <div className="bell-illustration">🔕</div>
                    <h3>Belum ada notifikasi</h3>
                    <p>Semua informasi terbaru akan muncul di sini.</p>
                </div>
            )}
        </div>

        <div style={{height: 50}}></div>
      </div>

      {/* --- MODAL DETAIL NOTIFIKASI (Bottom Sheet Style) --- */}
      {showModal && selectedNotif && (
        <div className="notif-modal-overlay" onClick={handleCloseModal}>
            <div className="notif-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-drag-bar"></div>
                
                <div className="modal-icon-wrapper">
                    {getIcon(selectedNotif.type)}
                </div>

                <h3 className="modal-notif-title">{selectedNotif.title}</h3>
                <span className="modal-notif-time">{selectedNotif.time}</span>
                
                <div className="modal-notif-body">
                    <p>{selectedNotif.message}</p>
                </div>

                <button className="btn-close-modal-full" onClick={handleCloseModal}>
                    Tutup
                </button>
            </div>
        </div>
      )}

    </div>
  );
}

export default Notifikasi;