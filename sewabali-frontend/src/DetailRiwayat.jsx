import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './DetailRiwayat.css';

// Data Tiruan (Mock Data) - DITAMBAHKAN NOMOR TELEPON
const MOCK_TRANSACTION_DETAILS = {
  101: {
    id: 101,
    status: "Menunggu Verifikasi",
    tanggal_pesan: "03 Nov 2025",
    total_bayar: 750000,
    durasi: 1,
    kendaraan: {
      nama: "Innova Zenix 2024",
      img: "https://placehold.co/100x70/007bff/FFFFFF?text=Innova"
    },
    perental: {
      nama: "Bli Komang Jaya",
      no_rekening: "001-12345678-1",
      no_telepon: "081234567890" // <-- NOMOR WA PERENTAL (Format 08...)
    },
    dokumen: {
      ktp: "Terunggah",
      sim: "Terunggah",
      jaminan: "Terunggah"
    }
  },
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

  // --- FUNGSI UNTUK MEMBUKA WHATSAPP ---
  const handleContactWA = () => {
    if (!data || !data.perental.no_telepon) return;

    // 1. Format Nomor Telepon (Ganti 0 di depan dengan 62)
    let phoneNumber = data.perental.no_telepon;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.slice(1);
    }

    // 2. Buat Pesan Otomatis
    const message = `Halo ${data.perental.nama}, saya penyewa dengan ID Pesanan #${data.id} (${data.kendaraan.nama}). Saya ingin bertanya mengenai pesanan saya.`;

    // 3. Buat Link WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // 4. Buka di Tab Baru
    window.open(whatsappUrl, '_blank');
  };
  // -------------------------------------

  if (!data) return <div className="loading-page">Memuat detail...</div>;

  return (
    <div className="detail-riwayat-container">
      {/* Header */}
      <header className="detail-riwayat-header">
        <Link to="/riwayat" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/></svg>
          Kembali
        </Link>
        <span>Detail Transaksi #{data.id}</span>
      </header>

      <main className="detail-riwayat-content">
        
        {/* Status Banner */}
        <div className="status-banner warning">
            <div className="status-icon">⏳</div>
            <div className="status-text">
                <h3>Menunggu Verifikasi</h3>
                <p>Perental sedang memeriksa pembayaran dan dokumen Anda. Mohon tunggu 1x24 jam.</p>
            </div>
        </div>

        {/* Info Kendaraan */}
        <div className="card section-card">
            <h2 className="section-title">Kendaraan</h2>
            <div className="vehicle-summary">
                <img src={data.kendaraan.img} alt={data.kendaraan.nama} />
                <div>
                    <h4>{data.kendaraan.nama}</h4>
                    <p>Durasi Sewa: {data.durasi} Hari</p>
                    <p>Tanggal: {data.tanggal_pesan}</p>
                </div>
            </div>
        </div>

        {/* Info Pembayaran */}
        <div className="card section-card">
            <h2 className="section-title">Rincian Pembayaran</h2>
            <div className="info-row">
                <span>Total Bayar</span>
                <strong>Rp {data.total_bayar.toLocaleString('id-ID')}</strong>
            </div>
            <div className="info-row">
                <span>Metode</span>
                <span>Transfer Bank</span>
            </div>
            <div className="info-row">
                <span>Bukti Transfer</span>
                <span className="text-success">Sudah Diupload</span>
            </div>
        </div>

        {/* Info Dokumen */}
        <div className="card section-card">
            <h2 className="section-title">Status Dokumen</h2>
            <div className="document-list">
                <div className="doc-item">
                    <span>KTP</span>
                    <span className="badge-check">✓ {data.dokumen.ktp}</span>
                </div>
                <div className="doc-item">
                    <span>SIM C</span>
                    <span className="badge-check">✓ {data.dokumen.sim}</span>
                </div>
                <div className="doc-item">
                    <span>Jaminan</span>
                    <span className="badge-check">✓ {data.dokumen.jaminan}</span>
                </div>
            </div>
        </div>

        {/* Info Perental */}
        <div className="card section-card">
            <h2 className="section-title">Info Perental</h2>
            <p><strong>{data.perental.nama}</strong></p>
            
            {/* TOMBOL YANG MENGARAH KE WA */}
            <button className="contact-btn" onClick={handleContactWA}>
                Hubungi Perental (WhatsApp)
            </button>
        </div>

      </main>
    </div>
  );
}

export default DetailRiwayat;