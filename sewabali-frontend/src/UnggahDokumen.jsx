import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UnggahDokumen.css'; // PERUBAHAN: Mengimpor CSS baru

// Asumsi ID Penyewa yang sedang login
const ID_PENYEWA = 1; 

// PERUBAHAN: Nama fungsi diganti
function UnggahDokumen() { 
  const navigate = useNavigate();
  
  const [files, setFiles] = useState({
    ktp: null,
    sim_c: null,
    jaminan: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

    try {
      const formData = new FormData();
      formData.append('id_penyewa', ID_PENYEWA); 
      formData.append('ktp', files.ktp);
      formData.append('jaminan', files.jaminan);
      
      if (files.sim_c) {
        formData.append('sim_c', files.sim_c);
      }

      // SIMULASI SUKSES 
      setMessage("Dokumen berhasil diupload. Silakan lanjut ke Pembayaran.");
      
      const savedDetails = JSON.parse(sessionStorage.getItem('lastPemesananDetails'));
      const newPemesananId = savedDetails ? savedDetails.id_pemesanan : 456; 

      setTimeout(() => {
        // Redirect ke halaman Pembayaran
        navigate(`/pembayaran/${newPemesananId}`); 
      }, 2000);

    } catch (err) {
      console.error("Upload gagal:", err.response || err);
      const serverError = err.response?.data?.errors?.ktp?.[0] || err.response?.data?.errors?.jaminan?.[0] || 'Terjadi kesalahan pada server.';
      setError('Upload gagal. ' + serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    // PERUBAHAN: Nama class container diganti
    <div className="unggah-container"> 
      <header className="unggah-header">
        <Link to="/beranda" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#333"/></svg>
          Back
        </Link>
        <span>Unggah Dokumen Verifikasi</span>
      </header>

      <main className="unggah-content">
        {message && <div className="status-message success">{message}</div>}
        {error && <div className="status-message error">{error}</div>}

        <div className="card guide-card">
            <h2 className="card-title">Penting: Verifikasi Akun</h2>
            <p>Untuk menyewa, Anda wajib mengunggah dokumen di bawah ini. Proses verifikasi memerlukan waktu maksimal 2 jam.</p>
            <ul>
                <li>Dokumen harus jelas dan tidak buram.</li>
                <li>Hanya format JPG, JPEG, PNG, atau PDF yang diterima.</li>
            </ul>
        </div>

        <form onSubmit={handleSubmit} className="card upload-form-card">
          <h2 className="card-title">Unggah Dokumen</h2>
          
          <div className="form-group">
            <label>1. Kartu Tanda Penduduk (KTP) *</label>
            <label htmlFor="ktp" className="file-label file-required">
              {files.ktp ? files.ktp.name : 'Pilih file KTP'}
            </label>
            <input type="file" id="ktp" name="ktp" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} required style={{ display: 'none' }} />
          </div>

          <div className="form-group">
            <label>2. Surat Izin Mengemudi C (SIM C) (Opsional)</label>
            <label htmlFor="sim_c" className="file-label">
              {files.sim_c ? files.sim_c.name : 'Pilih file SIM C'}
            </label>
            <input type="file" id="sim_c" name="sim_c" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          <div className="form-group">
            <label>3. Dokumen Jaminan (Cth: KK/Ijazah/STNK) *</label>
            <label htmlFor="jaminan" className="file-label file-required">
              {files.jaminan ? files.jaminan.name : 'Pilih dokumen jaminan'}
            </label>
            <input type="file" id="jaminan" name="jaminan" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} required style={{ display: 'none' }} />
          </div>
          
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? 'Mengunggah...' : 'Verifikasi Dokumen'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default UnggahDokumen; // PERUBAHAN: Nama fungsi diganti