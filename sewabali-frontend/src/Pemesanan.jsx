import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pemesanan.css'; 

const MOCK_PEMESANAN_ID = 456; 

function Pemesanan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kendaraan, setKendaraan] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({ 
    durasi_hari: 1,
    tanggal_pesan: today,
  });
  const [totalHarga, setTotalHarga] = useState(0);
  
  // State UI
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotal = useCallback((durasi, hargaPerHari) => {
    return durasi * hargaPerHari;
  }, []);

  useEffect(() => {
    async function fetchKendaraan() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/kendaraan/${id}`);
        setKendaraan(response.data);
        
        if (response.data) {
          setTotalHarga(calculateTotal(formData.durasi_hari, response.data.harga_per_hari));
        }
      } catch (error) {
        console.error('Gagal fetch kendaraan:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchKendaraan();
  }, [id, calculateTotal, formData.durasi_hari]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === 'durasi_hari' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.durasi_hari <= 0) {
      alert("Durasi sewa minimal 1 hari.");
      return;
    }

    setIsSubmitting(true); // Tampilkan loading

    try {
      // Fetch perental data untuk dilengkapi ke sessionStorage
      const perentalResponse = await axios.get(`http://127.0.0.1:8000/api/users/${kendaraan.user_id}`);
      
      sessionStorage.setItem('lastPemesananDetails', JSON.stringify({
        id_pemesanan: MOCK_PEMESANAN_ID,
        total_harga: totalHarga,
        durasi_hari: formData.durasi_hari,
        tanggal_pesan: formData.tanggal_pesan, 
        kendaraan: {
          ...kendaraan,
          perental: perentalResponse.data
        }
      }));

      // Simulasi delay sedikit agar terasa prosesnya
      setTimeout(() => {
        navigate(`/unggah-dokumen`); 
      }, 1000);

    } catch (err) {
      console.error("Pemesanan gagal:", err);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Memuat...</div>;
  
  if (!kendaraan) return <div className="loading-state">Kendaraan tidak ditemukan</div>;
  
  const formattedTotal = `Rp ${totalHarga.toLocaleString('id-ID')}`;

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <Link to={`/kendaraan/${kendaraan.id}`} className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Konfirmasi Sewa</span>
        <div style={{width: 40}}></div> {/* Spacer untuk balancing */}
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Ringkasan Mobil */}
        <div className="summary-section">
            <div className="vehicle-thumb-row">
                <img src={kendaraan.gambar_url} alt={kendaraan.nama} className="thumb-img" />
                <div className="vehicle-info">
                    <h3>{kendaraan.nama}</h3>
                    <p className="price-label">Rp {kendaraan.harga_per_hari.toLocaleString('id-ID')}/hari</p>
                    <div className="renter-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Pemilik Kendaraan
                    </div>
                </div>
            </div>
        </div>

        <div className="divider-thick"></div>

        {/* Form Input */}
        <div className="form-section">
            <h4 className="section-label">Detail Pesanan</h4>
            
            <div className="input-group">
                <label>Mulai Sewa</label>
                <div className="input-wrapper">
                    <input 
                        type="date" 
                        name="tanggal_pesan" 
                        value={formData.tanggal_pesan} 
                        onChange={handleChange} 
                        min={today} 
                        className="custom-input"
                    />
                </div>
            </div>

            <div className="input-group">
                <label>Durasi (Hari)</label>
                <div className="input-wrapper">
                    <button type="button" className="btn-counter" onClick={() => setFormData(prev => ({...prev, durasi_hari: Math.max(1, prev.durasi_hari - 1)}))}>-</button>
                    <input 
                        type="number" 
                        name="durasi_hari" 
                        min="1" 
                        value={formData.durasi_hari} 
                        onChange={handleChange} 
                        className="custom-input text-center"
                    />
                    <button type="button" className="btn-counter" onClick={() => setFormData(prev => ({...prev, durasi_hari: prev.durasi_hari + 1}))}>+</button>
                </div>
            </div>
        </div>

        <div className="divider-thick"></div>

        {/* Rincian Biaya */}
        <div className="cost-section">
            <h4 className="section-label">Rincian Pembayaran</h4>
            <div className="cost-row">
                <span>Harga Sewa x {formData.durasi_hari} Hari</span>
                <span>{formattedTotal}</span>
            </div>
            <div className="cost-row">
                <span>Biaya Layanan</span>
                <span>Rp 0</span>
            </div>
            <div className="cost-row total">
                <span>Total Pembayaran</span>
                <span className="highlight-price">{formattedTotal}</span>
            </div>
        </div>

        <div style={{height: 100}}></div> {/* Spacer bawah */}
      </div>

      {/* Sticky Bottom Button */}
      <footer className="sticky-footer-action">
        <div className="total-display">
            <span>Total</span>
            <strong>{formattedTotal}</strong>
        </div>
        <button 
            onClick={handleSubmit} 
            className={`btn-primary-action ${isSubmitting ? 'disabled' : ''}`}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Memproses...' : 'Lanjut Bayar'}
        </button>
      </footer>

    </div>
  );
}

export default Pemesanan;