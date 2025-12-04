import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FinalisasiPemesanan.css'; // Import CSS baru

// Asumsi ID Penyewa yang sedang login
const ID_PENYEWA = 1;

function FinalisasiPemesanan() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID Pemesanan dari URL
  
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

  // 1. Ambil detail pemesanan saat komponen dimuat (dari sessionStorage)
  useEffect(() => {
    const savedDetails = sessionStorage.getItem('lastPemesananDetails');
    
    if (savedDetails) {
        const details = JSON.parse(savedDetails);
        setPemesanan({
            id: details.id_pemesanan,
            total_bayar: details.total_harga,
            durasi: details.durasi_hari,
            // Data kendaraan & perental
            kendaraan: details.kendaraan,
            // Data bank tiruan (sesuaikan dengan perental Anda)
            bank: { nama: "BCA", rekening: "8724123456", atas_nama: details.kendaraan.perental.nama }
        });
    } else {
        // Jika data hilang, navigasi kembali (atau tampilkan error)
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
    
    // Validasi semua file wajib
    if (!files.ktp || !files.jaminan || !files.bukti_transfer) {
      setError("Mohon lengkapi KTP, Dokumen Jaminan, dan Bukti Transfer.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage("Mengunggah dokumen dan bukti pembayaran. Mohon tunggu...");

    try {
      // 1. Kumpulkan data untuk API
      const formData = new FormData();
      formData.append('id_pemesanan', pemesanan.id);
      formData.append('id_penyewa', ID_PENYEWA); 
      formData.append('ktp', files.ktp);
      formData.append('jaminan', files.jaminan);
      formData.append('bukti_pembayaran', files.bukti_transfer); // Mengganti nama field untuk backend

      // Tambahkan data non-file untuk validasi
      formData.append('total_bayar', pemesanan.total_bayar);
      formData.append('no_rekening_perental', pemesanan.bank.rekening);
      
      // 2. SIMULASI: Kirim data ke API (Verifikasi Dokumen + Bukti Bayar)
      // Endpoint: POST /api/dokumen-verifikasi (untuk kemudahan, kita anggap API ini menangani semua)
      // const response = await axios.post('http://localhost:8000/api/dokumen-verifikasi', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });


      // ----------------------------------------------------
      // LANGKAH 3: SIMULASI VERIFIKASI AKHIR OLEH PERENTAL
      // ----------------------------------------------------
      setMessage("Upload berhasil! Verifikasi Perental sedang diproses (4 detik)...");
      
      setTimeout(() => {
        // Hapus data dari sessionStorage setelah sukses
        sessionStorage.removeItem('lastPemesananDetails'); 
        
        // Redirect ke halaman Sukses
        navigate('/pembayaran-sukses'); 
      }, 4000); 

    } catch (err) {
      console.error("Finalisasi gagal:", err.response || err);
      setError('Finalisasi gagal. Terjadi kesalahan pada server atau data tidak valid.');
      setTimeout(() => setLoading(false), 1000);
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
          Konfirmasi Pemesanan
        </Link>
        <span>Finalisasi</span>
      </header>

      <main className="finalisasi-content">
        {/* Detail Pembayaran */}
        <div className="card payment-info-card">
            <h2 className="card-title">Rincian Pembayaran</h2>
            <div className="summary-section">
                <p>Kendaraan: <strong>{pemesanan.nama_kendaraan}</strong></p>
                <p>Durasi: <strong>{pemesanan.durasi} Hari</strong></p>
            </div>
            <p className="payment-amount">Total yang Harus Dibayar:</p>
            <strong className="payment-total-final">Rp {pemesanan.total_bayar.toLocaleString('id-ID')}</strong>
            
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
          
          {/* Dokumen KTP */}
          <div className="form-group">
            <label>Kartu Tanda Penduduk (KTP) *</label>
            <label htmlFor="ktp" className={`file-label ${files.ktp ? 'uploaded' : ''}`}>
              {files.ktp ? files.ktp.name : 'Pilih file KTP'}
            </label>
            <input type="file" id="ktp" name="ktp" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} required style={{ display: 'none' }} />
          </div>

          {/* Dokumen SIM C */}
          <div className="form-group">
            <label>Surat Izin Mengemudi C (SIM C) (Opsional)</label>
            <label htmlFor="sim_c" className={`file-label ${files.sim_c ? 'uploaded' : ''}`}>
              {files.sim_c ? files.sim_c.name : 'Pilih file SIM C'}
            </label>
            <input type="file" id="sim_c" name="sim_c" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Dokumen Jaminan */}
          <div className="form-group">
            <label>Dokumen Jaminan (Cth: KK/Ijazah/STNK) *</label>
            <label htmlFor="jaminan" className={`file-label ${files.jaminan ? 'uploaded' : ''}`}>
              {files.jaminan ? files.jaminan.name : 'Pilih dokumen jaminan'}
            </label>
            <input type="file" id="jaminan" name="jaminan" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} required style={{ display: 'none' }} />
          </div>

          <h2 className="card-title mt-4">2. Unggah Bukti Pembayaran</h2>
          
          {/* Bukti Transfer */}
          <div className="form-group">
            <label>Bukti Transfer / Struk Bank *</label>
            <label htmlFor="bukti_transfer" className={`file-label ${files.bukti_transfer ? 'uploaded' : ''}`}>
              {files.bukti_transfer ? files.bukti_transfer.name : 'Pilih bukti transfer'}
            </label>
            <input type="file" id="bukti_transfer" name="bukti_transfer" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} required style={{ display: 'none' }} />
          </div>
          
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? 'Sedang Memproses Verifikasi...' : 'Kirim Finalisasi & Verifikasi'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default FinalisasiPemesanan;