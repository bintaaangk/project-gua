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
    const [rejectReason, setRejectReason] = useState(""); // State untuk alasan custom

    const [verificationStatus, setVerificationStatus] = useState({
        ktp: null,
        sim: null,
        jaminan: null,
        pembayaran: null
    });

    const token = localStorage.getItem('token');

    // Helper URL Gambar dengan encodeURI untuk mengatasi karakter spesial (#, emoji, spasi)
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
            if (rejectReason.trim() !== "") {
                catatan = rejectReason;
            } else {
                const reasons = [];
                if (verificationStatus.ktp === 'invalid') reasons.push('KTP tidak jelas');
                if (verificationStatus.sim === 'invalid') reasons.push('SIM tidak valid');
                if (verificationStatus.jaminan === 'invalid') reasons.push('Jaminan kurang');
                if (verificationStatus.pembayaran === 'invalid') reasons.push('Bukti bayar salah');
                catatan = "Penolakan: " + reasons.join(', ');
            }
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

                            {/* TEXTAREA ALASAN PENOLAKAN */}
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
                        {selectedOrder.status === 'dalam_sewa' ? (
                             <button className="btn-submit-action" onClick={() => handleUpdateStatus(selectedOrder.id, 'sedang_disewa', 'Unit diserahkan')}>🔑 Serahkan Kendaraan</button>
                        ) : (
                            <button className={`btn-submit-action ${!isAllChecked(selectedOrder) ? 'disabled' : ''}`} disabled={!isAllChecked(selectedOrder)} onClick={handleSubmitDecision}>
                                {Object.values(verificationStatus).includes('invalid') ? 'Kirim Penolakan' : 'Terima & Konfirmasi'}
                            </button>
                        )}
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
                    <p>{orders.length} Transaksi</p>
                </div>
            </header>
            <div className="mobile-content">
                {orders.map(item => (
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
                            {item.status === 'dalam_sewa' ? (
                                <button className="btn-verify-now" style={{ backgroundColor: '#007bff', color: 'white' }} onClick={() => handleUpdateStatus(item.id, 'sedang_disewa', 'Kunci diserahkan')}>🔑 Serahkan Kendaraan</button>
                            ) : item.status === 'sedang_disewa' ? (
                                <button className="btn-verify-now" style={{ backgroundColor: '#28a745', color: 'white' }} onClick={() => handleUpdateStatus(item.id, 'selesai', 'Kembali dengan baik')}>🏁 Selesaikan Pesanan</button>
                            ) : item.status === 'selesai' ? (
                                <button className="btn-verify-now disabled" disabled>✅ Selesai</button>
                            ) : (
                                <button className="btn-verify-now" onClick={() => openDetailModal(item)}>🔍 Verifikasi</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {renderModal()}
        </div>
    );
};

export default PesananMasuk;