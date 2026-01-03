import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailKendaraan.css'; // File CSS

// Komponen Ikon Spesifikasi (TETAP SAMA)
const SpecIcon = ({ d, title, value }) => (
  <div className="spec-box">
    <div className="spec-icon-circle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
    <div className="spec-details">
      <span className="spec-label">{title}</span>
      <span className="spec-val">{value}</span>
    </div>
  </div>
);

function DetailKendaraan() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [kendaraan, setKendaraan] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State rentalOwner
  const [rentalOwner, setRentalOwner] = useState(null);

  // --- 1. PERBAIKAN FETCH DATA (Single Request) ---
  useEffect(() => {
    async function fetchKendaraan() {
      try {
        // Fetch data kendaraan (Pastikan Controller Laravel pakai 'with user')
        const response = await axios.get(`http://127.0.0.1:8000/api/kendaraan/${id}`);
        setKendaraan(response.data);
        
        // Ambil data user langsung dari respon relasi
        if (response.data.user) {
            setRentalOwner(response.data.user);
        }
      } catch (error) {
        console.error('Gagal fetch detail kendaraan:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchKendaraan();
  }, [id]);

  if (loading) return <div className="loading-screen">Memuat...</div>;
  if (!kendaraan) return <div className="loading-screen">Kendaraan tidak ditemukan</div>;

  const formattedPrice = `Rp ${parseInt(kendaraan.harga_per_hari).toLocaleString('id-ID')}`;

  // --- 2. FUNGSI PEMBERSIH ALAMAT (Supaya bersih dari link Google Maps) ---
  const cleanAddress = (rawAddress) => {
    if (!rawAddress) return 'Bali, Indonesia';
    // Hapus teks mulai dari "(Titik:" sampai akhir
    return rawAddress.split('(Titik:')[0].trim();
  };

  // Gunakan alamat bersih ini untuk Tampilan & Peta
  const finalAddress = cleanAddress(rentalOwner?.alamat || rentalOwner?.address);

  // --- 3. LOGIKA WHATSAPP ---
  const handleWhatsApp = () => {
    const phoneNumber = rentalOwner?.nomor_telepon || rentalOwner?.no_hp || '6281234567890';
    const message = `Halo, saya tertarik untuk menyewa ${kendaraan.nama}. Apakah tersedia?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- 4. URL MAP YANG SUDAH BERSIH ---
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(finalAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mobile-detail-page">
      
      {/* Header Sticky */}
      <header className="detail-navbar">
        <button className="btn-back-circle" onClick={handleBack} style={{background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="nav-title">Detail Mobil</span>
        <button className="btn-share-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        </button>
      </header>

      {/* Konten Scrollable */}
      <div className="detail-scroll-content">
        
        {/* Gambar Utama */}
        <div className="hero-image-wrapper">
          <img 
            src={kendaraan.gambar_url} 
            alt={kendaraan.nama} 
            className="hero-img" 
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/e0e0e0/777?text=Gambar+Tidak+Ada"; }}
          />
        </div>

        {/* Info Utama */}
        <div className="info-section">
            <h1 className="vehicle-title-large">{kendaraan.nama}</h1>
            <div className="price-tag-large">
                {formattedPrice}<span className="unit">/hari</span>
            </div>
        </div>

        <div className="divider"></div>

        {/* Spesifikasi Grid */}
        <div className="spec-section">
            <h3 className="section-heading">Spesifikasi</h3>
            <div className="spec-grid">
                <SpecIcon 
                    title="Transmisi" 
                    value={kendaraan.transmisi || 'N/A'}
                    d="M18 6H16C15.4696 6 14.9609 6.21071 14.5858 6.58579C14.2107 6.96086 14 7.46957 14 8V16C14 16.5304 14.2107 17.0391 14.5858 17.4142C14.9609 17.7893 15.4696 18 16 18H18M10 6H8C7.46957 6 6.96086 6.21071 6.58579 6.58579C6.21071 6.96086 6 7.46957 6 8V16C6 16.5304 6.21071 17.0391 6.58579 17.4142C6.96086 17.7893 7.46957 18 8 18H10M10 6V18"
                />
                <SpecIcon 
                    title="Kapasitas" 
                    value={`${kendaraan.kapasitas || 0} Orang`}
                    d="M17 18C17 18.5304 16.7893 19.0391 16.4142 19.4142C16.0391 19.7893 15.5304 20 15 20H9C8.46957 20 7.96086 19.7893 7.58579 19.4142C7.21071 19.0391 7 18.5304 7 18V17M17 10C17 10.5304 16.7893 11.0391 16.4142 11.4142C16.0391 11.7893 15.5304 12 15 12H9C8.46957 12 7.96086 11.7893 7.58579 11.4142C7.21071 11.0391 7 10.5304 7 10V4C7 3.46957 7.21071 2.96086 7.58579 2.58579C7.96086 2.21071 8.46957 2 9 2H15C15.5304 2 16.0391 2.21071 16.4142 2.58579C16.7893 2.96086 17 3.46957 17 4V10Z"
                />
                <SpecIcon 
                    title="Plat Nomor" 
                    value={kendaraan.plat_nomor || 'N/A'}
                    d="M6 6H18C18.5304 6 19.0391 6.21071 19.4142 6.58579C19.7893 6.96086 20 7.46957 20 8V16C20 16.5304 19.7893 17.0391 19.4142 17.4142C19.0391 17.7893 18.5304 18 18 18H6C5.46957 18 4.96086 17.7893 4.58579 17.4142C4.21071 17.0391 4 16.5304 4 16V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6Z"
                />
            </div>
        </div>

        <div className="divider"></div>

        {/* Deskripsi */}
        <div className="desc-section">
            <h3 className="section-heading">Informasi Kendaraan</h3>
            <p className="desc-text">{kendaraan.deskripsi || `${kendaraan.nama} adalah kendaraan tipe ${kendaraan.tipe} yang nyaman digunakan untuk keliling Bali.`}</p>
        </div>

        {/* Tambahkan bagian Syarat Jaminan setelah bagian Deskripsi atau Fasilitas */}
<div className="detail-section">
    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>
        🛡️ Syarat Dokumen Jaminan
    </h3>
    <div style={{ 
        backgroundColor: '#fff7ed', 
        padding: '15px', 
        borderRadius: '12px', 
        border: '1px solid #ffedd5',
        color: '#9a3412',
        fontSize: '0.9rem',
        lineHeight: '1.6'
    }}>
      {console.log("Cek Jaminan:", kendaraan.jaminan)}
        {/* Pastikan menggunakan nama field yang sama dengan di database (jaminan) */}
        {kendaraan.jaminan ? kendaraan.jaminan : "Hubungi perental untuk detail jaminan."}
    </div>
</div>

        <div className="divider"></div>

        {/* Profil Perental */}
        <div className="renter-section">
            <h3 className="section-heading">Pemilik Kendaraan</h3>
            {rentalOwner ? (
              <div className="renter-card">
                  <img src={rentalOwner.avatar_url || "https://placehold.co/100x100/007bff/FFFFFF?text=User"} alt="Avatar" className="renter-avatar" />
                  <div className="renter-info">
                      <h4 className="renter-name">{rentalOwner.name || rentalOwner.nama}</h4>
                      {/* --- ALAMAT BERSIH DI SINI --- */}
                      <p className="renter-loc">{finalAddress}</p>
                  </div>
                  <button onClick={handleWhatsApp} className="btn-wa">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382C17.111 14.196 15.344 13.314 15.015 13.195C14.685 13.076 14.444 13.016 14.204 13.376C13.964 13.736 13.284 14.536 13.074 14.776C12.864 15.016 12.654 15.046 12.294 14.866C11.934 14.686 10.774 14.306 9.394 13.076C8.304 12.106 7.564 10.906 7.354 10.546C7.144 10.186 7.334 9.996 7.514 9.816C7.674 9.656 7.874 9.396 8.054 9.186C8.234 8.976 8.294 8.826 8.414 8.586C8.534 8.346 8.474 8.136 8.384 7.956C8.294 7.776 7.564 5.986 7.264 5.266C6.974 4.566 6.674 4.666 6.454 4.666C6.254 4.666 6.024 4.656 5.794 4.656C5.564 4.656 5.184 4.746 4.864 5.096C4.544 5.446 3.644 6.296 3.644 8.016C3.644 9.736 4.894 11.406 5.074 11.646C5.254 11.886 7.544 15.426 11.174 16.996C13.884 18.166 14.654 17.886 15.584 17.766C16.514 17.646 18.444 16.616 18.844 15.486C19.244 14.356 19.244 13.386 19.124 13.196C19.004 13.006 18.764 12.896 18.404 12.716L17.472 14.382ZM12.004 2C6.484 2 2 6.484 2 12C2 13.764 2.464 15.424 3.284 16.884L2 22L7.244 20.624C8.664 21.394 10.304 21.824 12.004 21.824C17.524 21.824 22.004 17.344 22.004 11.824C22.004 6.304 17.524 1.824 12.004 1.824V2Z"/></svg>
                      Chat
                  </button>
              </div>
            ) : (
              <div className="renter-card" style={{opacity: 0.7}}>
                  <div className="renter-info">
                      <h4 className="renter-name">Rental SewaBali</h4>
                      <p className="renter-loc">Admin</p>
                  </div>
              </div>
            )}
        </div>

        <div className="divider"></div>

        {/* Lokasi Peta */}
        <div className="map-section">
            <h3 className="section-heading">Lokasi Pengambilan</h3>
            <div className="map-wrapper">
                <iframe 
                    title="Lokasi"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={mapSrc} // URL Map Bersih
                >
                </iframe>
            </div>
        </div>

        {/* Spacer agar tidak tertutup tombol sticky bawah */}
        <div style={{height: '100px'}}></div>

      </div>

      {/* Sticky Bottom CTA */}
      <footer className="sticky-footer">
        <div className="footer-price">
            <span className="fp-label">Total Harga</span>
            <span className="fp-value">{formattedPrice}</span>
        </div>
        <Link to={`/pemesanan/${id}`} className="btn-sewa-now">
            Sewa Sekarang
        </Link>
      </footer>

    </div>
  );
}

export default DetailKendaraan;