import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './DetailRiwayat.css';

// Data Tiruan (Mock Data)
const MOCK_TRANSACTION_DETAILS = {
  101: {
    id: 101,
    status: "Menunggu Verifikasi",
    tanggal_pesan: "03 Nov 2025",
    total_bayar: 750000,
    durasi: 1,
    kendaraan: {
      nama: "Toyota Innova Zenix 2024",
      img: "https://placehold.co/100x70/007bff/FFFFFF?text=Innova"
    },
    perental: {
      nama: "Bli Komang Jaya",
      no_rekening: "001-12345678-1",
      no_telepon: "081234567890" 
    },
    dokumen: {
      ktp: "Terunggah",
      sim: "Terunggah",
      jaminan: "Terunggah"
    }
  },
  // Default data untuk menghindari crash jika ID tidak ditemukan
  default: {
    id: 0,
    status: "Menunggu Verifikasi",
    tanggal_pesan: "-",
    total_bayar: 0,
    durasi: 0,
    kendaraan: { nama: "-", img: "" },
    perental: { nama: "-", no_rekening: "-", no_telepon: "081234567890" },
    dokumen: { ktp: "-", sim: "-", jaminan: "-" }
  }
};

function DetailRiwayat() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const transaction = MOCK_TRANSACTION_DETAILS[id] || MOCK_TRANSACTION_DETAILS[101];
    setData(transaction);
  }, [id]);

  const handleContactWA = () => {
    if (!data || !data.perental.no_telepon) return;
    let phoneNumber = data.perental.no_telepon;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.slice(1);
    }
    const message = `Halo ${data.perental.nama}, saya penyewa dengan ID Pesanan #${data.id} (${data.kendaraan.nama}). Mohon info status pesanan saya.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!data) return <div className="loading-screen">Memuat detail...</div>;

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <Link to="/riwayat" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Detail Pesanan #{data.id}</span>
        <div style={{width: 40}}></div>
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Status Banner */}
        <div className="status-card warning">
            <div className="status-icon-large">⏳</div>
            <div className="status-info">
                <h3>Menunggu Verifikasi</h3>
                <p>Pembayaran dan dokumen sedang diperiksa oleh perental. Estimasi 1x24 jam.</p>
            </div>
        </div>

        {/* Info Kendaraan */}
        <div className="detail-section">
            <h3 className="section-label">Kendaraan</h3>
            <div className="vehicle-card-mini">
                <img src={data.kendaraan.img} alt={data.kendaraan.nama} className="vehicle-img" />
                <div className="vehicle-details">
                    <h4>{data.kendaraan.nama}</h4>
                    <p>Sewa {data.durasi} Hari • {data.tanggal_pesan}</p>
                </div>
            </div>
        </div>

        <div className="divider-thick"></div>

        {/* Rincian Pembayaran */}
        <div className="detail-section">
            <h3 className="section-label">Rincian Pembayaran</h3>
            <div className="info-row">
                <span>Total Bayar</span>
                <strong>Rp {data.total_bayar.toLocaleString('id-ID')}</strong>
            </div>
            <div className="info-row">
                <span>Metode Pembayaran</span>
                <span>Transfer Bank</span>
            </div>
            <div className="info-row">
                <span>Status Bukti</span>
                <span className="status-text-success">Sudah Diupload</span>
            </div>
        </div>

        <div className="divider-thick"></div>

        {/* Status Dokumen */}
        <div className="detail-section">
            <h3 className="section-label">Dokumen Persyaratan</h3>
            <div className="doc-list">
                <div className="doc-row">
                    <span className="doc-name">KTP</span>
                    <span className="doc-status uploaded">✔ Terunggah</span>
                </div>
                <div className="doc-row">
                    <span className="doc-name">SIM C</span>
                    <span className="doc-status uploaded">✔ Terunggah</span>
                </div>
                <div className="doc-row">
                    <span className="doc-name">Jaminan</span>
                    <span className="doc-status uploaded">✔ Terunggah</span>
                </div>
            </div>
        </div>

        <div className="divider-thick"></div>

        {/* Info Perental */}
        <div className="detail-section">
            <h3 className="section-label">Info Perental</h3>
            <div className="renter-box">
                <div className="renter-profile">
                    <div className="renter-avatar-placeholder">{data.perental.nama.charAt(0)}</div>
                    <div>
                        <h4 className="renter-name-text">{data.perental.nama}</h4>
                        <p className="renter-sub">Pemilik Kendaraan</p>
                    </div>
                </div>
                <button className="btn-whatsapp" onClick={handleContactWA}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382C17.111 14.196 15.344 13.314 15.015 13.195C14.685 13.076 14.444 13.016 14.204 13.376C13.964 13.736 13.284 14.536 13.074 14.776C12.864 15.016 12.654 15.046 12.294 14.866C11.934 14.686 10.774 14.306 9.394 13.076C8.304 12.106 7.564 10.906 7.354 10.546C7.144 10.186 7.334 9.996 7.514 9.816C7.674 9.656 7.874 9.396 8.054 9.186C8.234 8.976 8.294 8.826 8.414 8.586C8.534 8.346 8.474 8.136 8.384 7.956C8.294 7.776 7.564 5.986 7.264 5.266C6.974 4.566 6.674 4.666 6.454 4.666C6.254 4.666 6.024 4.656 5.794 4.656C5.564 4.656 5.184 4.746 4.864 5.096C4.544 5.446 3.644 6.296 3.644 8.016C3.644 9.736 4.894 11.406 5.074 11.646C5.254 11.886 7.544 15.426 11.174 16.996C13.884 18.166 14.654 17.886 15.584 17.766C16.514 17.646 18.444 16.616 18.844 15.486C19.244 14.356 19.244 13.386 19.124 13.196C19.004 13.006 18.764 12.896 18.404 12.716L17.472 14.382ZM12.004 2C6.484 2 2 6.484 2 12C2 13.764 2.464 15.424 3.284 16.884L2 22L7.244 20.624C8.664 21.394 10.304 21.824 12.004 21.824C17.524 21.824 22.004 17.344 22.004 11.824C22.004 6.304 17.524 1.824 12.004 1.824V2Z"/></svg>
                    Chat WA
                </button>
            </div>
        </div>

        <div style={{height: 40}}></div>
      </div>
    </div>
  );
}

export default DetailRiwayat;