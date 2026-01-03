import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PesananMasuk.css';

const API_URL = 'http://127.0.0.1:8000/api';

const PesananMasuk = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [activeTab, setActiveTab] = useState('verifikasi'); 

    const [verificationStatus, setVerificationStatus] = useState({
        ktp: null,
        sim: null,
        jaminan: null,
        pembayaran: null
    });

    const token = localStorage.getItem('token');

    const getImgUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return encodeURI(`http://127.0.0.1:8000/storage/${path}`);
    };

    const fetchOrders = async () => {
        if (!token) { navigate('/login'); return; }
        try {
            const response = await axios.get(`${API_URL}/transaksi/perental`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Gagal mengambil pesanan:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [navigate, token]);

    // --- LOGIKA FILTER TAB ---
    const filteredOrders = orders.filter(order => {
        const status = order.status.toLowerCase();
        if (activeTab === 'verifikasi') {
            return status === 'menunggu_verifikasi' || status === 'menunggu_dokumen';
        }
        if (activeTab === 'serahkan') {
            return status === 'dalam_sewa' || status === 'disetujui';
        }
        if (activeTab === 'selesaikan') {
            return status === 'sedang_disewa';
        }
        if (activeTab === 'selesai') {
            return status === 'selesai';
        }
        if (activeTab === 'ditolak') {
            return status === 'ditolak' || status === 'batal';
        }
        return false;
    });

    const handleUpdateStatus = async (id, newStatus, catatan = '') => {
        const confirmMsg = newStatus === 'sedang_disewa' 
            ? "Konfirmasi: Kendaraan telah diserahkan ke penyewa?" 
            : newStatus === 'selesai' ? "Selesaikan pesanan ini?" : `Ubah status menjadi ${newStatus}?`;

        if (!window.confirm(confirmMsg)) return;

        try {
            await axios.post(`${API_URL}/transaksi/${id}/konfirmasi`, {
                status: newStatus,
                catatan: catatan
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Status berhasil diperbarui!");
            setShowModal(false);
            
            // Pindahkan tab secara otomatis setelah aksi berhasil
            if (newStatus === 'Dikonfirmasi') setActiveTab('serahkan');
            if (newStatus === 'sedang_disewa') setActiveTab('selesaikan');
            if (newStatus === 'selesai') setActiveTab('selesai');
            if (newStatus === 'Ditolak') setActiveTab('ditolak');

            fetchOrders();
        } catch (error) {
            alert("Gagal memperbarui status.");
        }
    };

    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setVerificationStatus({ ktp: null, sim: null, jaminan: null, pembayaran: null });
        setRejectReason(""); 
        setShowModal(true);
    };

    const handleVerifyItem = (itemKey, status) => {
        setVerificationStatus(prev => ({ ...prev, [itemKey]: status }));
    };

    const isAllChecked = (order) => {
        if (!order) return false;
        const doc = order.dokumen_verifikasi;
        const pay = order.bukti_bayar;
        if (doc?.path_ktp && verificationStatus.ktp === null) return false;
        if (doc?.path_sim_c && verificationStatus.sim === null) return false;
        if (doc?.path_jaminan && verificationStatus.jaminan === null) return false;
        if (pay?.file_path && verificationStatus.pembayaran === null) return false;
        return true;
    };

    const handleSubmitDecision = () => {
        const hasInvalidItem = Object.values(verificationStatus).includes('invalid');
        const finalStatus = hasInvalidItem ? 'Ditolak' : 'Dikonfirmasi';
        
        let catatan = "";
        if (hasInvalidItem) {
            catatan = rejectReason.trim() !== "" ? rejectReason : "Ada dokumen yang tidak valid.";
        } else {
            catatan = 'Dokumen valid dan lengkap.';
        }

        handleUpdateStatus(selectedOrder.id, finalStatus, catatan);
    };

    const renderModal = () => {
        if (!showModal || !selectedOrder) return null;
        const doc = selectedOrder.dokumen_verifikasi || {};
        const pay = selectedOrder.bukti_bayar || {};

        const VerifyRow = ({ label, imgPath, stateKey }) => {
            if (!imgPath) return null;
            const url = getImgUrl(imgPath);
            return (
                <div className="verify-card-item">
                    <div className="doc-preview">
                        <span className="doc-label">{label}</span>
                        <img src={url} alt={label} className="img-thumbnail" onClick={() => window.open(url, '_blank')} />
                    </div>
                    <div className="verify-btn-group">
                        <button className={`v-btn v-valid ${verificationStatus[stateKey] === 'valid' ? 'active' : ''}`} onClick={() => handleVerifyItem(stateKey, 'valid')}>✅ Valid</button>
                        <button className={`v-btn v-invalid ${verificationStatus[stateKey] === 'invalid' ? 'active' : ''}`} onClick={() => handleVerifyItem(stateKey, 'invalid')}>❌ Tolak</button>
                    </div>
                </div>
            );
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content-premium">
                    <div className="modal-header">
                        <h3>Verifikasi Pesanan</h3>
                        <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                        <div className="verification-container">
                            <VerifyRow label="KTP Identitas" imgPath={doc.path_ktp} stateKey="ktp" />
                            <VerifyRow label="SIM C / A" imgPath={doc.path_sim_c} stateKey="sim" />
                            <VerifyRow label="Dokumen Jaminan" imgPath={doc.path_jaminan} stateKey="jaminan" />
                            <VerifyRow label="Bukti Pembayaran" imgPath={pay.file_path} stateKey="pembayaran" />

                            {Object.values(verificationStatus).includes('invalid') && (
                                <div style={{ marginTop: '15px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#f43f5e' }}>Alasan Penolakan:</label>
                                    <textarea 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }}
                                        placeholder="Jelaskan apa yang harus diperbaiki penyewa..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className={`btn-submit-action ${!isAllChecked(selectedOrder) ? 'disabled' : ''}`} disabled={!isAllChecked(selectedOrder)} onClick={handleSubmitDecision}>
                            {Object.values(verificationStatus).includes('invalid') ? 'Kirim Penolakan' : 'Terima & Konfirmasi'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mobile-wrapper">
            <header className="mobile-header">
                <button className="btn-back-circle" onClick={() => navigate('/perental/dashboard')}>❮</button>
                <div className="header-text">
                    <h3>Pesanan Masuk</h3>
                    <p>{filteredOrders.length} Pesanan Baru</p>
                </div>
            </header>

            {/* TAB NAVIGATION */}
            <div className="order-tabs">
                <button className={activeTab === 'verifikasi' ? 'active' : ''} onClick={() => setActiveTab('verifikasi')}>Verifikasi</button>
                <button className={activeTab === 'serahkan' ? 'active' : ''} onClick={() => setActiveTab('serahkan')}>Serahkan</button>
                <button className={activeTab === 'selesaikan' ? 'active' : ''} onClick={() => setActiveTab('selesaikan')}>Selesaikan</button>
                <button className={activeTab === 'selesai' ? 'active' : ''} onClick={() => setActiveTab('selesai')}>Selesai</button>
                <button className={activeTab === 'ditolak' ? 'active' : ''} onClick={() => setActiveTab('ditolak')}>Ditolak</button>
            </div>

            <div className="mobile-content">
                {loading ? (
                    <div className="loading-state">Memuat data...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="empty-state">Tidak ada pesanan di kategori ini</div>
                ) : (
                    filteredOrders.map(item => (
                        <div key={item.id} className="order-card-premium">
                            <div className="card-top">
                                <span className="trx-code">{item.kode}</span>
                                <span className={`status-badge ${item.status}`}>{item.status_label}</span>
                            </div>
                            <div className="card-middle">
                                <div className="car-image-box">
                                    <img src={getImgUrl(item.kendaraan?.gambar_url)} alt="mobil" />
                                </div>
                                <div className="order-details">
                                    <h4>{item.kendaraan?.nama}</h4>
                                    <p>👤 {item.user?.name}</p>
                                    <p className="price-total">Rp {item.total_harga?.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            <div className="card-bottom">
                                {(item.status === 'dalam_sewa' || item.status === 'disetujui') && (
                                    <button className="btn-verify-now" style={{ backgroundColor: '#007bff', color: 'white' }} onClick={() => handleUpdateStatus(item.id, 'sedang_disewa', 'Unit diserahkan')}>🔑 Serahkan Kendaraan</button>
                                )}
                                {item.status === 'sedang_disewa' && (
                                    <button className="btn-verify-now" style={{ backgroundColor: '#28a745', color: 'white' }} onClick={() => handleUpdateStatus(item.id, 'selesai', 'Kembali dengan baik')}>🏁 Selesaikan Pesanan</button>
                                )}
                                {item.status === 'selesai' && (
                                    <button className="btn-verify-now disabled" disabled>✅ Transaksi Selesai</button>
                                )}
                                {(item.status === 'menunggu_verifikasi' || item.status === 'menunggu_dokumen') && (
                                    <button className="btn-verify-now" onClick={() => openDetailModal(item)}>🔍 Verifikasi Dokumen</button>
                                )}
                                {item.status === 'ditolak' && (
                                    <div className="reject-info">Menunggu penyewa memperbaiki dokumen</div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {renderModal()}

            {/* BOTTOM NAV */}
            <div className="nav-container-fixed">
                <nav className="bottom-nav-perental">
                    <button className="nav-btn" onClick={() => navigate('/perental/dashboard')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span>Home</span>
                    </button>
                    
                    <button className="nav-btn active" onClick={() => navigate('/pesanan-masuk')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <span>Pesanan</span>
                    </button>

                    <button className="nav-btn" onClick={() => navigate('/perental/profil')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span>Profil</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default PesananMasuk;