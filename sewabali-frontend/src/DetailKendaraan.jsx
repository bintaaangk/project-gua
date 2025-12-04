import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './DetailKendaraan.css'; // File CSS Detail Kendaraan

// --- INI HANYA DATA TIRUAN (MOCK DATA) ---
const MOCK_DATA = {
  1: {
    nama: "Innova Zenix 2024",
    harga_per_hari: 750000,
    gambar_url: "https://placehold.co/800x400/007bff/FFFFFF?text=Innova+Zenix", 
    transmisi: "Otomatis",
    kapasitas: 7,
    bahan_bakar: "Bensin",
    deskripsi: "Nikmati kenyamanan premium dengan Innova Zenix. Cocok untuk perjalanan keluarga besar di Bali dengan interior mewah dan performa mesin yang handal.",
    perental: {
      nama: "Bli Komang Jaya",
      avatar_url: "https://placehold.co/100x100/007bff/FFFFFF?text=BK",
      alamat: "Jl. Raya Kuta No.88, Badung, Bali", // Alamat Teks
      lokasi_map: "Kuta, Bali" // Kata kunci untuk Google Maps
    }
  },
  2: {
    nama: "All New Avanza 2023",
    harga_per_hari: 550000,
    gambar_url: "https://placehold.co/800x400/198754/FFFFFF?text=All+New+Avanza",
    transmisi: "Manual",
    kapasitas: 7,
    bahan_bakar: "Bensin",
    deskripsi: "Pilihan favorit untuk petualangan hemat dan efisien. Avanza terbaru hadir dengan desain modern dan kabin yang lebih luas.",
     perental: {
      nama: "Made RentCar",
      avatar_url: "https://placehold.co/100x100/198754/FFFFFF?text=MR",
      alamat: "Jl. Monkey Forest, Ubud, Gianyar, Bali",
      lokasi_map: "Ubud, Bali"
    }
  },
  3: {
    nama: "Pajero Sport Dakar 2024",
    harga_per_hari: 900000,
    gambar_url: "https://placehold.co/800x400/333333/FFFFFF?text=Pajero+Sport",
    transmisi: "Otomatis",
    kapasitas: 7,
    bahan_bakar: "Diesel",
    deskripsi: "Tangguh di segala medan. Pajero Sport Dakar memberikan performa dan kemewahan dalam satu paket. Jelajahi Bali tanpa batas.",
     perental: {
      nama: "Bali SUV Rent",
      avatar_url: "https://placehold.co/100x100/333333/FFFFFF?text=SV",
      alamat: "Jl. Teuku Umar Barat, Denpasar, Bali",
      lokasi_map: "Denpasar, Bali"
    }
  },
  4: {
    nama: "Yamaha Aerox 155",
    harga_per_hari: 185000,
    gambar_url: "https://placehold.co/800x400/dc3545/FFFFFF?text=Aerox+155",
    transmisi: "Otomatis",
    kapasitas: 2,
    bahan_bakar: "Bensin",
    deskripsi: "Skuter matik sporty dengan desain agresif, cocok untuk menjelajahi pantai-pantai di Bali dengan kecepatan dan gaya.",
    perental: {
      nama: "Rental Motor Kuta",
      avatar_url: "https://placehold.co/100x100/dc3545/FFFFFF?text=RK",
      alamat: "Jl. Legian Kelod, Kuta, Bali",
      lokasi_map: "Legian, Bali"
    }
  },
  5: {
    nama: "Yamaha Nmax 155",
    harga_per_hari: 150000,
    gambar_url: "https://placehold.co/800x400/ffc107/333333?text=Nmax+155",
    transmisi: "Otomatis",
    kapasitas: 2,
    bahan_bakar: "Bensin",
    deskripsi: "Skuter matik premium dengan kenyamanan maksimal dan bagasi luas, ideal untuk perjalanan jauh dan santai keliling pulau.",
    perental: {
      nama: "Bali Scooter Rental",
      avatar_url: "https://placehold.co/100x100/ffc107/333333?text=BS",
      alamat: "Jl. Sunset Road, Seminyak, Bali",
      lokasi_map: "Seminyak, Bali"
    }
  },
  6: {
    nama: "Yamaha Xmax 250",
    harga_per_hari: 215000,
    gambar_url: "https://placehold.co/800x400/6610f2/FFFFFF?text=Xmax+250",
    transmisi: "Otomatis",
    kapasitas: 2,
    bahan_bakar: "Bensin",
    deskripsi: "Skuter bongsor dengan tenaga besar dan stabilitas tinggi, memberikan pengalaman touring yang mewah di jalanan Bali.",
    perental: {
      nama: "Lombok Motor Rent",
      avatar_url: "https://placehold.co/100x100/6610f2/FFFFFF?text=LM",
      alamat: "Jl. Raya Canggu, Badung, Bali",
      lokasi_map: "Canggu, Bali"
    }
  },
};
// --- AKHIR DATA TIRUAN ---


const SpecIcon = ({ d, title, value }) => (
  <div className="spec-item">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className="spec-text">
      <span className="spec-title">{title}</span>
      <span className="spec-value">{value}</span>
    </div>
  </div>
);


function DetailKendaraan() {
  const { id } = useParams(); 
  const [kendaraan, setKendaraan] = useState(null);

  useEffect(() => {
    // Menggunakan ID dari URL
    const numericId = parseInt(id);
    // Jika data tidak ditemukan, default ke ID 1 (untuk demo)
    const data = MOCK_DATA[numericId] || MOCK_DATA[1]; 
    setKendaraan(data);
  }, [id]);

  if (!kendaraan) {
    return <div className="loading-page">Loading...</div>;
  }

  const formattedPrice = `Rp ${kendaraan.harga_per_hari.toLocaleString('id-ID')}`;

  return (
    <div className="detail-container">
      {/* Header */}
      <header className="detail-header">
        <Link to="/beranda" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/>
          </svg>
        </Link>
        <span>Detail Kendaraan</span>
      </header>

      {/* Konten Utama */}
      <main className="detail-content">
        {/* Gambar */}
        <div className="detail-image-gallery">
          <img src={kendaraan.gambar_url} alt={kendaraan.nama} />
        </div>

        {/* Kartu Informasi */}
        <div className="detail-info-card">
          <div className="detail-title-price">
            <h1 className="detail-title">{kendaraan.nama}</h1>
            <span className="detail-price">{formattedPrice}<span>/hari</span></span>
          </div>

          {/* Spesifikasi */}
          <h2 className="detail-subtitle">Spesifikasi</h2>
          <div className="detail-specs-grid">
            <SpecIcon 
              title="Transmisi" 
              value={kendaraan.transmisi}
              d="M18 6H16C15.4696 6 14.9609 6.21071 14.5858 6.58579C14.2107 6.96086 14 7.46957 14 8V16C14 16.5304 14.2107 17.0391 14.5858 17.4142C14.9609 17.7893 15.4696 18 16 18H18M10 6H8C7.46957 6 6.96086 6.21071 6.58579 6.58579C6.21071 6.96086 6 7.46957 6 8V16C6 16.5304 6.21071 17.0391 6.58579 17.4142C6.96086 17.7893 7.46957 18 8 18H10M10 6V18"
            />
            <SpecIcon 
              title="Kapasitas Penumpang" 
              value={`${kendaraan.kapasitas} Kursi`}
              d="M17 18C17 18.5304 16.7893 19.0391 16.4142 19.4142C16.0391 19.7893 15.5304 20 15 20H9C8.46957 20 7.96086 19.7893 7.58579 19.4142C7.21071 19.0391 7 18.5304 7 18V17M17 10C17 10.5304 16.7893 11.0391 16.4142 11.4142C16.0391 11.7893 15.5304 12 15 12H9C8.46957 12 7.96086 11.7893 7.58579 11.4142C7.21071 11.0391 7 10.5304 7 10V4C7 3.46957 7.21071 2.96086 7.58579 2.58579C7.96086 2.21071 8.46957 2 9 2H15C15.5304 2 16.0391 2.21071 16.4142 2.58579C16.7893 2.96086 17 3.46957 17 4V10Z"
            />
            <SpecIcon 
              title="Jenis Bahan Bakar" 
              value={kendaraan.bahan_bakar}
              d="M15.47 13.9L18.8 17.23C19.43 17.86 19.8 18.7 19.8 19.56C19.8 20.42 19.43 21.26 18.8 21.89C18.17 22.52 17.33 22.89 16.47 22.89C15.61 22.89 14.77 22.52 14.14 21.89L10.81 18.56M15.47 13.9L12.64 11.07L4.5 19.21L4.2 19.5C3.3 20.42 2.73 21.68 2.7 23H1C1 14.06 7.06 8 16 8C16.2 8 16.39 8.04 16.58 8.04L15.47 13.9Z"
            />
          </div>

          {/* Deskripsi */}
          <h2 className="detail-subtitle">Deskripsi</h2>
          <p className="detail-description">{kendaraan.deskripsi}</p>
          
          {/* Informasi Perental & Peta */}
          <h2 className="detail-subtitle">Informasi Perental</h2>
          <div className="detail-perental">
            <img src={kendaraan.perental.avatar_url} alt={kendaraan.perental.nama} />
            <div>
              <span className="perental-name">{kendaraan.perental.nama}</span>
              <p className="perental-address">{kendaraan.perental.alamat}</p>
            </div>
          </div>

          {/* --- TAMBAHAN PETA (MAPS) --- */}
          <div className="detail-map-container">
            <h3 className="map-title">Lokasi Pengambilan</h3>
            <div className="map-frame">
              <iframe 
                title="Lokasi Perental"
                width="100%" 
                height="250" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(kendaraan.perental.lokasi_map)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              >
              </iframe>
            </div>
          </div>
          {/* --- AKHIR TAMBAHAN --- */}

        </div>
      </main>

      {/* Footer CTA */}
      <footer className="detail-footer-cta">
        <Link to={`/pemesanan/${id}`} className="sewa-btn-detail">
          Sewa Sekarang
        </Link>
      </footer>
    </div>
  );
}

export default DetailKendaraan;