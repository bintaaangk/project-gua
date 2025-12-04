import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pemesanan.css'; // File CSS baru

// --- DATA TIRUAN (MOCK DATA) ---
const MOCK_DATA = {
  1: { id: 1, nama: "Innova Zenix 2024", harga_per_hari: 750000, gambar_url: "https://placehold.co/100x70/007bff/FFFFFF?text=IN", perental: { nama: "Bli Komang Jaya", no_rekening: "001-12345678-1" } },
  2: { id: 2, nama: "All New Avanza 2023", harga_per_hari: 550000, gambar_url: "https://placehold.co/100x70/198754/FFFFFF?text=AV", perental: { nama: "Made RentCar", no_rekening: "002-87654321-1" } },
  3: { id: 3, nama: "Pajero Sport Dakar 2024", harga_per_hari: 900000, gambar_url: "https://placehold.co/100x70/333333/FFFFFF?text=PJ", perental: { nama: "Bali SUV Rent", no_rekening: "003-99887766-1" } },
  4: { id: 4, nama: "Yamaha Aerox 155", harga_per_hari: 185000, gambar_url: "https://placehold.co/100x70/dc3545/FFFFFF?text=AE", perental: { nama: "Rental Motor Kuta", no_rekening: "004-11223344-1" } },
  5: { id: 5, nama: "Yamaha Nmax 155", harga_per_hari: 150000, gambar_url: "https://placehold.co/100x70/ffc107/333333?text=NM", perental: { nama: "Bali Scooter Rental", no_rekening: "005-55667788-1" } },
  6: { id: 6, nama: "Yamaha Xmax 250", harga_per_hari: 215000, gambar_url: "https://placehold.co/100x70/6610f2/FFFFFF?text=XM", perental: { nama: "Lombok Motor Rent", no_rekening: "006-00998877-1" } },
};

const MOCK_PEMESANAN_ID = 456; 
const ID_PENYEWA = 1; 

function Pemesanan() {
  const { id } = useParams(); // ID Kendaraan (dari DetailKendaraan)
  const navigate = useNavigate();
  const [kendaraan, setKendaraan] = useState(null);
  
  const [formData, setFormData] = useState({ 
    durasi_hari: 1,
    tanggal_pesan: new Date().toISOString().split('T')[0], // Tanggal hari ini
  });
  const [totalHarga, setTotalHarga] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const calculateTotal = useCallback((durasi, hargaPerHari) => {
    return durasi * hargaPerHari;
  }, []);

  useEffect(() => {
    const numericId = parseInt(id);
    const data = MOCK_DATA[numericId] || MOCK_DATA[1]; 
    setKendaraan(data);

    if (data) {
      setTotalHarga(calculateTotal(formData.durasi_hari, data.harga_per_hari));
    }
  }, [id, formData.durasi_hari, calculateTotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === 'durasi_hari' ? parseInt(value) || 0 : value;

    setFormData(prev => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.durasi_hari <= 0) {
      setError("Durasi sewa minimal 1 hari.");
      return;
    }

    try {
      const payload = {
        id_penyewa: ID_PENYEWA,
        id_kendaraan: kendaraan.id,
        durasi_hari: formData.durasi_hari,
        tanggal_pesan: formData.tanggal_pesan,
        total_harga: totalHarga,
      };

      // SIMULASI API: Asumsi API Pemesanan sukses
      // const response = await axios.post('http://localhost:8000/api/pemesanan', payload);
      // const newPemesananId = response.data.pemesanan.id_pemesanan; 
      
      const newPemesananId = MOCK_PEMESANAN_ID; // Menggunakan ID tiruan untuk simulasi

      // --- SIMPAN DATA YANG DIHITUNG KE SESSION STORAGE ---
      sessionStorage.setItem('lastPemesananDetails', JSON.stringify({
        id_pemesanan: newPemesananId,
        total_harga: totalHarga,
        durasi_hari: formData.durasi_hari,
        kendaraan: kendaraan
      }));
      // ----------------------------------------------------------------

      setMessage("Pemesanan berhasil. Lanjut ke Verifikasi Dokumen...");
      
      setTimeout(() => {
        // --- PERUBAHAN KRITIS DI SINI ---
        // Redirect ke halaman Unggah Dokumen
        navigate(`/unggah-dokumen`); 
        // --------------------------------
      }, 1500);

    } catch (err) {
      console.error("Pemesanan gagal:", err.response || err);
      setError('Pemesanan gagal. Terjadi kesalahan pada server.');
    }
  };

  if (!kendaraan) {
    return <div className="loading-page">Memuat data kendaraan...</div>;
  }

  const formattedTotal = `Rp ${totalHarga.toLocaleString('id-ID')}`;

  return (
    <div className="pemesanan-container">
      {/* Header */}
      <header className="pemesanan-header">
        <Link to={`/kendaraan/${kendaraan.id}`} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/></svg>
        </Link>
        <span>Konfirmasi Pemesanan</span>
      </header>

      <main className="pemesanan-content">
        {message && <div className="pemesanan-status success">{message}</div>}
        {error && <div className="pemesanan-status error">{error}</div>}

        {/* 1. Ringkasan Kendaraan */}
        <div className="card summary-card">
          <h2 className="card-title">Ringkasan</h2>
          <div className="summary-item">
            <img src={kendaraan.gambar_url} alt={kendaraan.nama} />
            <div className="summary-text">
              <span className="summary-vehicle-name">{kendaraan.nama}</span>
              <span className="summary-price-per-day">Rp {kendaraan.harga_per_hari.toLocaleString('id-ID')}/hari</span>
            </div>
          </div>
          <div className="summary-detail">
            <span>Perental</span>
            <strong>{kendaraan.perental.nama}</strong>
          </div>
        </div>

        {/* 2. Formulir Pemilihan Durasi */}
        <form onSubmit={handleSubmit} className="card form-card">
          <h2 className="card-title">Detail Sewa</h2>
          
          <div className="form-group">
            <label htmlFor="tanggal_pesan">Tanggal Mulai Sewa</label>
            <input 
              type="date" 
              id="tanggal_pesan" 
              name="tanggal_pesan"
              value={formData.tanggal_pesan}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="durasi_hari">Durasi Sewa (Hari)</label>
            <input 
              type="number" 
              id="durasi_hari" 
              name="durasi_hari"
              min="1"
              value={formData.durasi_hari}
              onChange={handleChange}
              required
            />
          </div>

          {/* 3. Ringkasan Biaya */}
          <div className="biaya-section">
            <div className="biaya-item">
              <span>Harga Sewa ({formData.durasi_hari} Hari)</span>
              <strong>{formattedTotal}</strong>
            </div>
            <div className="biaya-item total">
              <span>Total Akhir</span>
              <strong style={{ color: '#007bff' }}>{formattedTotal}</strong>
            </div>
          </div>

          {/* Tombol Konfirmasi */}
          <button type="submit" className="konfirmasi-btn">
            Konfirmasi & Lanjut Unggah Dokumen
          </button>
        </form>
      </main>
    </div>
  );
}

export default Pemesanan;