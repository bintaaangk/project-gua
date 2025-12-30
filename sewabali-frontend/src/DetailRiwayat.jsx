import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailRiwayat.css';

function DetailRiwayat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get(`http://127.0.0.1:8000/api/riwayat/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error('Gagal memuat detail:', error);
                navigate('/riwayat');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    const renderStatusLabel = (status) => {
        const s = (status || "").toLowerCase();
        if (s === 'dalam_sewa') return "SIAP DIAMBIL";
        if (s === 'menunggu_dokumen') return "MENUNGGU DOKUMEN";
        if (s === 'menunggu_pembayaran') return "MENUNGGU PEMBAYARAN";
        if (s === 'menunggu_verifikasi') return "SEDANG DIVERIFIKASI";
        if (s === 'selesai') return "SELESAI";
        if (s === 'batal') return "DIBATALKAN / DITOLAK";
        return s.replace(/_/g, ' ').toUpperCase();
    };

    const handleContactWA = () => {
        if (!data || !data.kendaraan?.user?.nomor_telepon) {
            alert("Nomor telepon perental tidak tersedia.");
            return;
        }
        let phoneNumber = data.kendaraan.user.nomor_telepon;
        if (phoneNumber.startsWith('0')) phoneNumber = '62' + phoneNumber.slice(1);
        const message = `Halo, saya penyewa ID #${data.id_pemesanan}. Ingin menanyakan status sewa saya.`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const getStatusType = (status) => {
        const s = (status || "").toLowerCase();
        if (s === 'selesai') return 'success';
        if (s === 'dalam_sewa') return 'info';
        if (s.includes('verifikasi') || s.includes('menunggu')) return 'warning';
        if (s === 'batal' || s === 'rejected') return 'danger';
        return 'warning';
    };

    if (loading) return <div className="loading-screen">Memuat detail...</div>;
    if (!data) return null;

    const statusType = getStatusType(data.status);

    return (
        <div className="mobile-page-container">
            <header className="page-header">
                <Link to="/riwayat" className="btn-back-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
                    </svg>
                </Link>
                <span className="header-title">Detail Pesanan</span>
                <div style={{ width: 24 }}></div>
            </header>

            <div className="scroll-content">
                {/* Status Banner */}
                <div className={`status-card ${statusType}`}>
                    <div className="status-icon-large">
                        {data.status === 'selesai' ? '✅' : data.status === 'dalam_sewa' ? '📍' : statusType === 'danger' ? '❌' : '⏳'}
                    </div>
                    <div className="status-info">
                        <h3>{renderStatusLabel(data.status)}</h3>
                        <p>Status pesanan diperbarui secara real-time.</p>
                    </div>
                </div>

                {/* Instruksi Pengambilan */}
                {data.status === 'dalam_sewa' && (
                    <div className="instruction-card-modern">
                        <div className="instruction-header">
                            <span className="sparkle-icon">🎉</span>
                            <h4>Unit Siap Diambil!</h4>
                        </div>
                        <p className="instruction-text">Ambil kendaraan di lokasi perental:</p>
                        <div className="location-detail-box">
                            <div className="loc-icon">📍</div>
                            <div className="loc-text">
                                <strong>Alamat Pengambilan:</strong>
                                <p>{data.kendaraan?.user?.alamat || "Hubungi perental untuk alamat."}</p>
                            </div>
                        </div>
                        {data.catatan && (
                            <div className="note-from-perental">
                                <strong>Catatan dari Perental:</strong>
                                <p>"{data.catatan}"</p>
                            </div>
                        )}
                        <button className="btn-whatsapp-full" onClick={handleContactWA}>
                            Hubungi Perental Sekarang
                        </button>
                    </div>
                )}

                {/* --- TAHAP PENOLAKAN: Tampilkan Alasan & Tombol Upload Ulang --- */}
{data.status === 'batal' && (
    <div className="rejection-card">
        <div className="rejection-header">
            <span>⚠️</span>
            <h4>Pesanan Ditolak / Dibatalkan</h4>
        </div>
        <div className="rejection-body">
            <p className="rejection-label">Alasan Penolakan:</p>
            <div className="rejection-note">
                "{data.catatan || "Mohon maaf, dokumen atau pembayaran Anda tidak dapat kami verifikasi."}"
            </div>
            
            <p className="rejection-instruction">
                Silakan perbaiki dokumen atau bukti pembayaran Anda dan unggah kembali agar perental dapat memproses ulang pesanan Anda.
            </p>
            
            <div className="rejection-actions">
                {/* Arahkan kembali ke halaman upload (sesuaikan route-mu) */}
                {/* Gunakan data.id_pemesanan, bukan data.id */}
<button 
    className="btn-reupload" 
    onClick={() => navigate(`/upload-pembayaran/${data.id_pemesanan}`)}
>
    🔄 Unggah Ulang Data
</button>
                <button className="btn-contact-support" onClick={handleContactWA}>
                    Hubungi Perental
                </button>
            </div>
        </div>
    </div>
)}

                {/* Detail Kendaraan */}
                <div className="detail-section">
                    <span className="section-label">Kendaraan</span>
                    <div className="vehicle-card-mini">
                        <img src={data.kendaraan?.gambar_url} alt="mobil" className="vehicle-img" />
                        <div className="vehicle-details">
                            <h4>{data.kendaraan?.nama}</h4>
                            <p>{data.durasi_hari} Hari • {new Date(data.tanggal_pesan).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</p>
                            <span className="plate-badge">{data.kendaraan?.plat_nomor || 'TANPA PLAT'}</span>
                        </div>
                    </div>
                </div>

                {/* Spesifikasi */}
                <div className="specs-grid-detail">
                    <div className="spec-box">
                        <span className="spec-icon">🕹️</span>
                        <span className="spec-label-text">Transmisi</span>
                        <span className="spec-value">{data.kendaraan?.transmisi}</span>
                    </div>
                    <div className="spec-box">
                        <span className="spec-icon">👥</span>
                        <span className="spec-label-text">Kapasitas</span>
                        <span className="spec-value">{data.kendaraan?.kapasitas} Kursi</span>
                    </div>
                    <div className="spec-box">
                        <span className="spec-icon">⛽</span>
                        <span className="spec-label-text">Bahan Bakar</span>
                        <span className="spec-value">Bensin</span>
                    </div>
                </div>

                <div className="divider-thick"></div>

                {/* Checklist Dokumen & Pembayaran (YANG SEBELUMNYA HILANG) */}
                <div className="detail-section">
                    <span className="section-label">Kelengkapan Data</span>
                    <div className="checklist-item-modern">
                        <div className={`status-dot ${data.dokumen_verifikasi ? 'filled' : ''}`}></div>
                        <div className="checklist-content">
                            <h5>Dokumen Persyaratan</h5>
                            <p className={data.dokumen_verifikasi ? 'text-success' : 'text-warning'}>
                                {data.dokumen_verifikasi ? '✔ Unggah dokumen sudah diupload' : '✖ Belum ada dokumen'}
                            </p>
                        </div>
                    </div>
                    <div className="checklist-item-modern">
                        <div className={`status-dot ${data.bukti_bayar ? 'filled' : ''}`}></div>
                        <div className="checklist-content">
                            <h5>Bukti Pembayaran</h5>
                            <p className={data.bukti_bayar ? 'text-success' : 'text-warning'}>
                                {data.bukti_bayar ? '✔ Bukti pembayaran sudah diupload' : '✖ Belum ada bukti bayar'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="divider-thick"></div>

                {/* Info Pembayaran */}
                <div className="detail-section">
                    <span className="section-label">Rincian Pembayaran</span>
                    <div className="info-row">
                        <span>Total Biaya Sewa</span>
                        <strong>Rp {Number(data.total_harga).toLocaleString('id-ID')}</strong>
                    </div>
                    <div className="info-row">
                        <span>Status Verifikasi</span>
                        <span className={`text-${statusType}`}>
                            {renderStatusLabel(data.status)}
                        </span>
                    </div>
                </div>

                <div className="divider-thick"></div>

                {/* Pemilik Kendaraan (DIPERBAIKI AGAR RAPI) */}
                <div className="detail-section">
                    <span className="section-label">Pemilik Kendaraan</span>
                    <div className="renter-box">
                        <div className="renter-profile">
                            <div className="renter-avatar-placeholder">
                                {data.kendaraan?.user?.name?.charAt(0) || 'P'}
                            </div>
                            <div className="renter-info-text">
                                <h4 className="renter-name-text">{data.kendaraan?.user?.name || 'Perental'}</h4>
                                <p className="renter-sub">Pemilik Unit</p>
                            </div>
                        </div>
                        <button className="btn-whatsapp" onClick={handleContactWA}>
                            Chat WA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailRiwayat;