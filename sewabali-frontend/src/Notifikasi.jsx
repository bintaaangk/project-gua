import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Notifikasi.css';

function Notifikasi() {
  const [notifList, setNotifList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Detail
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchNotifikasi() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/notifikasi', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setNotifList(response.data);
      } catch (error) {
        console.error('Gagal fetch notifikasi:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNotifikasi();
  }, []);

  // Fungsi Buka Notifikasi
  const handleOpenNotif = (item) => {
    setSelectedNotif(item);
    setShowModal(true);
    
    // Mark as read
    if (!item.is_read) {
      markAsRead(item.id);
    }
  };

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
                        className={`notif-item ${item.is_read ? 'read' : 'unread'}`}
                        onClick={() => handleOpenNotif(item)}
                    >
                        <div className="notif-left">
                            {getIcon(item.tipe)}
                        </div>
                        <div className="notif-mid">
                            <div className="notif-head">
                                <h4>{item.tipe === 'dokumen_upload' ? 'Dokumen Diunggah' : item.tipe === 'dokumen_verified' ? 'Dokumen Disetujui' : item.tipe === 'dokumen_rejected' ? 'Dokumen Ditolak' : 'Notifikasi'}</h4>
                                <span className="time">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                            </div>
                            <p>{item.pesan}</p>
                        </div>
                        {!item.is_read && <div className="notif-dot"></div>}
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
                    {getIcon(selectedNotif.tipe)}
                </div>

                <h3 className="modal-notif-title">
                  {selectedNotif.tipe === 'dokumen_upload' ? 'Dokumen Diunggah' : 
                   selectedNotif.tipe === 'dokumen_verified' ? 'Dokumen Disetujui' : 
                   selectedNotif.tipe === 'dokumen_rejected' ? 'Dokumen Ditolak' : 'Notifikasi'}
                </h3>
                <span className="modal-notif-time">{new Date(selectedNotif.created_at).toLocaleDateString('id-ID')}</span>
                
                <div className="modal-notif-body">
                    <p>{selectedNotif.pesan}</p>
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