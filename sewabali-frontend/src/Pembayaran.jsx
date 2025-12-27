import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pembayaran.css'; 

function Pembayaran() {
  const { id } = useParams(); // Ambil ID dari URL (Contoh: /pembayaran/123)
  const navigate = useNavigate();
  const [buktiFile, setBuktiFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State data
  const [pemesanan, setPemesanan] = useState(null);

  useEffect(() => {
    // 1. Coba ambil dari Session Storage dulu
    const savedData = sessionStorage.getItem('lastPemesananDetails');
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log("Data Session:", parsedData); 
      setPemesanan(parsedData);
    } else if (id) {
      // 2. Jika session kosong, tapi ada ID di URL, set minimal data
      console.log("Data Session Kosong, pakai ID URL:", id);
      setPemesanan({
        id_pemesanan: id,
        total_harga: 0, 
        kendaraan: { perental: { nama: 'Pemilik Kendaraan' } }
      });
    } else {
      alert("Data pemesanan tidak ditemukan.");
      navigate('/beranda');
    }
  }, [id, navigate]); 

  const formattedTotal = pemesanan ? `Rp ${(pemesanan.total_harga || 0).toLocaleString('id-ID')}` : 'Rp 0';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setBuktiFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const idPemesananFinal = pemesanan?.id_pemesanan || id;

    if (!idPemesananFinal) {
      alert("Error: ID Pemesanan tidak ditemukan. Silakan ulangi pesanan.");
      return;
    }

    if (!buktiFile) {
      alert("Mohon upload bukti transfer Anda.");
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      
      // Sesuai Controller: id_pemesanan
      formData.append('id_pemesanan', idPemesananFinal); 
      
      // Sesuai Controller: total_bayar & no_rekening (Opsional tapi baik dikirim)
      formData.append('total_bayar', pemesanan?.total_harga || 0);
      formData.append('no_rekening_perental', 'BCA 6023456872'); 
      
      // PENTING: Sesuai Controller, nama field harus 'bukti_pembayaran'
      formData.append('bukti_pembayaran', buktiFile); 

      // PENTING: URL harus '/api/bukti-bayar' sesuai routes/api.php
      const buktiResponse = await axios.post(
        'http://localhost:8000/api/bukti-bayar', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (buktiResponse.status === 201 || buktiResponse.status === 200) {
        alert('Bukti pembayaran berhasil diupload! Menunggu verifikasi.');
        
        sessionStorage.removeItem('lastPemesananDetails'); 
        setTimeout(() => {
          navigate('/riwayat'); 
        }, 1000);
      }

    } catch (err) {
      console.error("Error Upload:", err.response || err);
      const pesanError = err.response?.data?.message || JSON.stringify(err.response?.data?.errors) || "Gagal upload.";
      alert(`Gagal: ${pesanError}`);
    } finally {
      setLoading(false);
    }
  };

  if (!pemesanan) return <div className="loading-screen">Memuat tagihan...</div>;

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <Link to="/beranda" className="btn-back-circle">
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
            <div className="order-id-label">Order ID: #{pemesanan.id_pemesanan || id}</div>
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
                <button className="btn-copy" onClick={() => {navigator.clipboard.writeText('6023456872'); alert('Disalin!')}}>Salin</button>
            </div>
            
            <div className="instruction-text">
                <p>Silakan transfer sesuai nominal tepat hingga 3 digit terakhir untuk mempercepat verifikasi.</p>
            </div>
        </div>

        <div className="divider-thick"></div>

        {/* Form Upload Bukti */}
        <form className="upload-section">
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