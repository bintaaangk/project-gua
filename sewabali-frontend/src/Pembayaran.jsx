import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pembayaran.css'; // File CSS baru

function Pembayaran() {
  const { id } = useParams(); // ID Pemesanan (dari URL)
  const navigate = useNavigate();
  const [buktiFile, setBuktiFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // State untuk menyimpan data yang diambil dari sessionStorage
  const [pemesanan, setPemesanan] = useState(null);

  // Ambil data harga dari sessionStorage saat dimuat
  useEffect(() => {
    const savedData = sessionStorage.getItem('lastPemesananDetails');
    if (savedData) {
      const details = JSON.parse(savedData);
      // Data yang dibutuhkan untuk halaman Pembayaran
      setPemesanan({
        id_pemesanan: details.id_pemesanan,
        total_harga: details.total_harga,
        id_kendaraan: details.kendaraan.id, 
        kendaraan: details.kendaraan,
        perental: details.kendaraan.perental, 
      });
    } else {
      // Kasus jika user langsung akses halaman ini tanpa Pemesanan
      setError("Data pemesanan tidak ditemukan. Silakan pesan ulang.");
    }
  }, [id]); 

  const formattedTotal = pemesanan ? `Rp ${pemesanan.total_harga.toLocaleString('id-ID')}` : 'Rp 0';

  const handleFileChange = (e) => {
    setBuktiFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!buktiFile) {
      setError("Mohon upload bukti transfer Anda.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Menggunakan FormData untuk mengirim file dan data lainnya
      const formData = new FormData();
      formData.append('id_pemesanan', pemesanan.id_pemesanan);
      formData.append('total_bayar', pemesanan.total_harga); 
      formData.append('no_rekening_perental', pemesanan.kendaraan.perental.no_rekening);
      formData.append('bukti_pembayaran', buktiFile);

      // Kirim data ke API Laravel
      // Endpoint: POST /api/pembayaran (memproses upload file)
      const response = await axios.post('http://localhost:8000/api/pembayaran', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage("Pembayaran berhasil diupload. Mengarahkan ke Riwayat...");
      
      // Hapus data dari sessionStorage setelah sukses
      sessionStorage.removeItem('lastPemesananDetails'); 

      setTimeout(() => {
        navigate('/riwayat'); // Redirect ke halaman Riwayat
      }, 3000);

    } catch (err) {
      console.error("Upload gagal:", err.response || err);
      // Ambil pesan error validasi dari Laravel (jika ada)
      const serverError = err.response?.data?.errors?.bukti_pembayaran?.[0] || 'Terjadi kesalahan pada server. (Cek console log)';
      setError('Upload gagal. ' + serverError);
    } finally {
      setLoading(false);
    }
  };

  if (!pemesanan) {
    return <div className="loading-page">{error ? error : "Memuat ringkasan tagihan..."}</div>;
  }

  return (
    <div className="pembayaran-container">
      {/* Header */}
      <header className="pembayaran-header">
        {/* Kembali ke halaman Pemesanan */}
        <Link to={`/pemesanan/${pemesanan.id_kendaraan}`} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/></svg>
        </Link>
        <span>Konfirmasi Pembayaran</span>
      </header>

      <main className="pembayaran-content">
        {message && <div className="pembayaran-status success">{message}</div>}
        {error && <div className="pembayaran-status error">{error}</div>}

        {/* 1. Ringkasan Tagihan */}
        <div className="card tagihan-card">
          <h2 className="card-title">Total Tagihan</h2>
          <div className="tagihan-price">
            <span className="tagihan-label">Total yang harus dibayar:</span>
            <strong className="tagihan-amount">{formattedTotal}</strong>
          </div>
        </div>

        {/* 2. Detail Transfer (Informasi Perental) */}
        <div className="card transfer-card">
          <h2 className="card-title">Detail Transfer</h2>
          <p>Silakan transfer sejumlah **{formattedTotal}** ke rekening perental:</p>
          <div className="transfer-info">
            <span>Nama Perental: <strong>{pemesanan.kendaraan.perental.nama}</strong></span>
            <span>Nomor Rekening: <strong>{pemesanan.kendaraan.perental.no_rekening}</strong></span>
          </div>
        </div>

        {/* 3. Form Upload Bukti */}
        <form onSubmit={handleSubmit} className="card upload-card">
          <h2 className="card-title">Upload Bukti Transfer</h2>

          <div className="form-group file-upload">
            {/* Label yang berfungsi sebagai tombol file */}
            <label htmlFor="bukti_pembayaran" className="file-label">
              {buktiFile ? buktiFile.name : 'Pilih file bukti (.jpg/.jpeg/.png) untuk diupload'}
            </label>
            <input 
              type="file" 
              id="bukti_pembayaran" 
              name="bukti_pembayaran"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              style={{ display: 'none' }} // Sembunyikan input file bawaan
            />
          </div>
          
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? 'Mengunggah...' : 'Upload & Selesaikan Pembayaran'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Pembayaran;
