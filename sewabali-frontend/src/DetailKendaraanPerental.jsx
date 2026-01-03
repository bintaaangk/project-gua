import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailKendaraanPerental.css';

function DetailKendaraanPerental() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [kendaraan, setKendaraan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/kendaraan/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setKendaraan(response.data);
            } catch (error) {
                console.error("Gagal memuat detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Memuat detail unit...</p>
            </div>
        );
    }

    return (
        <div className="perental-detail-wrapper">
            {/* STICKY HEADER */}
            <header className="detail-header-premium">
                <button className="btn-back-circle" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div className="header-text-main">
                    <h3>Detail Unit Anda</h3>
                    <p>Status: <span className={kendaraan?.status.toLowerCase()}>{kendaraan?.status}</span></p>
                </div>
            </header>

            <div className="detail-scroll-content">
                {/* HERO IMAGE SECTION */}
                <div className="image-hero-card">
                    <img src={kendaraan?.gambar_url} alt={kendaraan?.nama} />
                    <div className="type-badge-overlay">{kendaraan?.tipe}</div>
                </div>

                {/* MAIN INFO SECTION */}
                <div className="info-card-main">
                    <div className="title-row">
                        <h1>{kendaraan?.nama}</h1>
                        <div className="plat-badge-detail">{kendaraan?.plat_nomor}</div>
                    </div>
                    <div className="price-tag-detail">
                        Rp {kendaraan?.harga_per_hari.toLocaleString('id-ID')} <span>/ hari</span>
                    </div>
                </div>

                {/* SPECIFICATIONS GRID */}
                <div className="specs-container">
                    <div className="spec-box-mini">
                        <div className="spec-icon blue">⚙️</div>
                        <div className="spec-info">
                            <span>Transmisi</span>
                            <strong>{kendaraan?.transmisi}</strong>
                        </div>
                    </div>
                    <div className="spec-box-mini">
                        <div className="spec-icon orange">👥</div>
                        <div className="spec-info">
                            <span>Kapasitas</span>
                            <strong>{kendaraan?.kapasitas} Kursi</strong>
                        </div>
                    </div>
                </div>

                {/* SYARAT JAMINAN SECTION */}
                <div className="detail-section-premium">
                    <div className="section-header-inline">
                        <span className="icon-circle">🛡️</span>
                        <h4>Syarat Jaminan Anda</h4>
                    </div>
                    <div className="jaminan-box-premium">
                        {kendaraan?.jaminan ? (
                            <p>{kendaraan.jaminan}</p>
                        ) : (
                            <p className="no-data-text">Anda belum mengatur syarat jaminan untuk unit ini.</p>
                        )}
                    </div>
                </div>

                {/* BANK INFO SECTION */}
                <div className="detail-section-premium">
                    <div className="section-header-inline">
                        <span className="icon-circle">🏦</span>
                        <h4>Rekening Pembayaran</h4>
                    </div>
                    <div className="bank-box-premium">
                        <div className="bank-icon-placeholder">🏧</div>
                        <div className="bank-details-text">
                            <strong>Informasi Rekening:</strong>
                            <p>{kendaraan?.no_rekening || "Belum ada nomor rekening terdaftar."}</p>
                        </div>
                    </div>
                </div>

                {/* FOOTER ACTION (OPTIONAL) */}
                <div className="internal-footer">
                    <p>Halaman ini menampilkan detail unit yang terlihat oleh publik dan pengaturan internal Anda.</p>
                </div>
            </div>
        </div>
    );
}

export default DetailKendaraanPerental;