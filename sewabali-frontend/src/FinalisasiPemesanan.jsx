import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FinalisasiPemesanan.css';

function FinalisasiPemesanan() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [pemesanan, setPemesanan] = useState(null);
  const [files, setFiles] = useState({
    ktp: null,
    sim_c: null,
    jaminan: null,
    bukti_transfer: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedDetails = sessionStorage.getItem('lastPemesananDetails');
    
    if (savedDetails) {
        const details = JSON.parse(savedDetails);
        setPemesanan({
            id: details.id_pemesanan,
            total_bayar: details.total_harga,
            durasi: details.durasi_hari,
            tanggal_pesan: details.tanggal_pesan,
            kendaraan: details.kendaraan,
            bank: { nama: "BCA", rekening: "8724123456", atas_nama: "Pemilik Kendaraan" }
        });
    } else {
        setError("Data pemesanan hilang. Mohon kembali ke halaman detail.");
    }
  }, [id]);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.ktp || !files.jaminan) {
      setError("Mohon lengkapi KTP dan Dokumen Jaminan.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage("Mengunggah dokumen...");

    try {
      // Buat FormData untuk upload
      const formData = new FormData();
      formData.append('pemesanan_id', pemesanan.id);
      formData.append('ktp', files.ktp);
      
      if (files.sim_c) {
        formData.append('sim_c', files.sim_c);
      }
      
      formData.append('jaminan', files.jaminan);
      
      if (files.bukti_transfer) {
        formData.append('bukti_transfer', files.bukti_transfer);
      }

      // Get token dari localStorage
      const token = localStorage.getItem('authToken');
      
      // Upload ke backend
      const response = await axios.post('http://127.0.0.1:8000/api/dokumen-verifikasi', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setMessage("Upload berhasil! Dokumen sedang diverifikasi oleh perental...");
      
      setTimeout(() => {
        sessionStorage.removeItem('lastPemesananDetails'); 
        navigate('/pembayaran-sukses'); 
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal upload dokumen. Coba lagi nanti.');
      setLoading(false);
    }
  };

  if (!pemesanan) {
    return <div className="loading-state">{error ? error : "Memuat ringkasan..."}</div>;
  }

  return (
    <div className="finalisasi-container">
      <header className="finalisasi-header">
        <Link to={`/pemesanan/${pemesanan.kendaraan.id}`} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/></svg>
          Kembali
        </Link>
        <span>Finalisasi</span>
      </header>

      <main className="finalisasi-content">
        <div className="card payment-info-card">
            <h2 className="card-title">Rincian Pembayaran</h2>
            <div className="summary-section">
                <p>Kendaraan: <strong>{pemesanan.kendaraan.nama}</strong></p>
                <p>Durasi: <strong>{pemesanan.durasi} Hari</strong></p>
            </div>
            <p className="payment-amount">Total Bayar: <br/><strong>Rp {pemesanan.total_bayar.toLocaleString('id-ID')}</strong></p>
            
            <div className="bank-details">
                <p>Transfer ke Bank: <strong>{pemesanan.bank.nama}</strong></p>
                <p>No. Rekening: <strong>{pemesanan.bank.rekening}</strong></p>
                <p>A/N: <strong>{pemesanan.bank.atas_nama}</strong></p>
            </div>
        </div>

        {message && <div className={`status-message ${error ? 'error' : 'success'}`}>{message}</div>}
        {error && <div className="status-message error">{error}</div>}

        <form onSubmit={handleSubmit} className="card upload-form-card">
          <h2 className="card-title">1. Unggah Dokumen Verifikasi</h2>
          
          <div className="form-group">
            <label>Kartu Tanda Penduduk (KTP) *</label>
            <label htmlFor="ktp" className={`file-label ${files.ktp ? 'uploaded' : ''}`}>
              {files.ktp ? files.ktp.name : 'Pilih file KTP'}
            </label>
            <input type="file" id="ktp" name="ktp" accept="image/*,.pdf" onChange={handleFileChange} required style={{ display: 'none' }} />
          </div>

          <div className="form-group">
            <label>SIM C (Opsional)</label>
            <label htmlFor="sim_c" className={`file-label ${files.sim_c ? 'uploaded' : ''}`}>
              {files.sim_c ? files.sim_c.name : 'Pilih file SIM C'}
            </label>
            <input type="file" id="sim_c" name="sim_c" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          <div className="form-group">
            <label>Dokumen Jaminan (Cth: KTP Asli/KK) *</label>
            <label htmlFor="jaminan" className={`file-label ${files.jaminan ? 'uploaded' : ''}`}>
              {files.jaminan ? files.jaminan.name : 'Pilih dokumen jaminan'}
            </label>
            <input type="file" id="jaminan" name="jaminan" accept="image/*,.pdf" onChange={handleFileChange} required style={{ display: 'none' }} />
          </div>

          <h2 className="card-title mt-4">2. Unggah Bukti Pembayaran</h2>
          
          <div className="form-group">
            <label>Bukti Transfer / Struk Bank *</label>
            <label htmlFor="bukti_transfer" className={`file-label ${files.bukti_transfer ? 'uploaded' : ''}`}>
              {files.bukti_transfer ? files.bukti_transfer.name : 'Pilih bukti transfer'}
            </label>
            <input type="file" id="bukti_transfer" name="bukti_transfer" accept="image/*,.pdf" onChange={handleFileChange} required style={{ display: 'none' }} />
          </div>
          
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Kirim Finalisasi'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default FinalisasiPemesanan;