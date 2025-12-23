import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pembayaran.css'; 

function Pembayaran() {
  const { id } = useParams(); // id_pemesanan (opsional, bisa ambil dari session)
  const navigate = useNavigate();
  const [buktiFile, setBuktiFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State data
  const [pemesanan, setPemesanan] = useState(null);

  useEffect(() => {
    // Ambil data dari Session Storage
    const savedData = sessionStorage.getItem('lastPemesananDetails');
    if (savedData) {
      setPemesanan(JSON.parse(savedData));
    } else {
      alert("Data pemesanan tidak ditemukan.");
      navigate('/beranda');
    }
  }, [navigate]); 

  const formattedTotal = pemesanan ? `Rp ${pemesanan.total_harga.toLocaleString('id-ID')}` : 'Rp 0';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setBuktiFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!buktiFile) {
      alert("Mohon upload bukti transfer Anda.");
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // 1. Upload bukti bayar ke API
      const formData = new FormData();
      formData.append('id_pemesanan', pemesanan?.id_pemesanan);
      formData.append('path_bukti', buktiFile);

      const buktiResponse = await axios.post(
        'http://127.0.0.1:8000/api/bukti-bayar',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (buktiResponse.status === 201) {
        // 2. Simpan ke riwayat lokal juga
        const newHistoryItem = {
          id: pemesanan?.id_pemesanan || 0, 
          kendaraan: pemesanan?.kendaraan?.nama || 'Kendaraan', 
          img: pemesanan?.kendaraan?.gambar_url || '',
          tanggal: pemesanan?.tanggal_pesan || new Date().toISOString().split('T')[0],
          durasi: `${pemesanan?.durasi_hari || 1} Hari`,
          total: pemesanan?.total_harga || 0,
          status: "Menunggu Verifikasi Pembayaran",
          timestamp: new Date().getTime() 
        };

        const existingData = localStorage.getItem('userTransactionHistory');
        let historyArray = existingData ? JSON.parse(existingData) : [];
        historyArray.unshift(newHistoryItem);
        localStorage.setItem('userTransactionHistory', JSON.stringify(historyArray));
        
        // 3. Bersihkan session
        sessionStorage.removeItem('lastPemesananDetails'); 

        alert('Bukti pembayaran berhasil diupload! Menunggu verifikasi dari pemilik kendaraan.');

        // Simulasi loading
        setTimeout(() => {
          navigate('/riwayat'); 
        }, 1500);
      }

    } catch (err) {
      console.error("Error:", err);
      alert('Gagal mengupload bukti pembayaran: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!pemesanan) return <div className="loading-screen">Memuat tagihan...</div>;

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <Link to="/unggah-dokumen" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Pembayaran</span>
        <div style={{width: 40}}></div>
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Card Total Tagihan */}
        <div className="payment-card total-card">
            <div className="card-header-label">Total Tagihan</div>
            <div className="total-amount">{formattedTotal}</div>
            <div className="order-id-label">Order ID: #{pemesanan.id_pemesanan}</div>
        </div>

        {/* Card Metode Transfer */}
        <div className="payment-card bank-card">
            <h3 className="card-title">Transfer Bank</h3>
            <div className="bank-details">
                <div className="bank-logo-placeholder">BCA</div>
                <div className="bank-info">
                    <span className="bank-name">BCA (Bank Central Asia)</span>
                    <span className="account-name">
                      {pemesanan?.kendaraan?.perental?.nama || 'Pemilik Kendaraan'}
                    </span>
                </div>
            </div>
            
            <div className="rek-box">
                <span className="rek-number">6023456872</span>
                <button className="btn-copy">Salin</button>
            </div>
            
            <div className="instruction-text">
                <p>Silakan transfer sesuai nominal tepat hingga 3 digit terakhir untuk mempercepat verifikasi.</p>
            </div>
        </div>

        <div className="divider-thick"></div>

        {/* Form Upload Bukti */}
        <form onSubmit={handleSubmit} className="upload-section">
            <h3 className="section-label">Konfirmasi Pembayaran</h3>
            <p className="upload-instruction">Sudah transfer? Upload bukti pembayaran Anda di sini.</p>
            
            <div className="custom-file-wrapper">
                <input 
                    type="file" 
                    id="bukti_pembayaran" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden-input"
                />
                <label htmlFor="bukti_pembayaran" className={`file-box ${buktiFile ? 'uploaded' : ''}`}>
                    {buktiFile ? (
                        <div className="file-success">
                            <span className="check-icon">✔</span>
                            <span className="filename">{buktiFile.name}</span>
                            <span className="change-text">Ganti Foto</span>
                        </div>
                    ) : (
                        <div className="file-placeholder">
                            <span className="icon-upload">📸</span>
                            <span>Upload Struk Transfer</span>
                        </div>
                    )}
                </label>
            </div>
        </form>

        <div style={{height: 100}}></div>
      </div>

      {/* Sticky Footer */}
      <footer className="sticky-footer-action-single">
        <button 
            onClick={handleSubmit} 
            className={`btn-block-primary ${loading ? 'disabled' : ''}`}
            disabled={loading}
        >
            {loading ? 'Memproses...' : 'Kirim Bukti Pembayaran'}
        </button>
      </footer>

    </div>
  );
}

export default Pembayaran;