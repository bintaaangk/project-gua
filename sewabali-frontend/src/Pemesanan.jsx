import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pemesanan.css'; 

function Pemesanan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kendaraan, setKendaraan] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tanggal hari ini YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({ 
    durasi_hari: 1,
    tanggal_pesan: today,
  });
  const [totalHarga, setTotalHarga] = useState(0);
  
  // State UI
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // Hitung total harga otomatis saat durasi berubah
  const calculateTotal = useCallback((durasi, hargaPerHari) => {
    return durasi * hargaPerHari;
  }, []);

  // Ambil Data Kendaraan dari API
  useEffect(() => {
    async function fetchKendaraan() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/kendaraan/${id}`);
        setKendaraan(response.data);
        
        if (response.data) {
          // Update total harga awal
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

  // Update State saat User Mengetik
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === 'durasi_hari' ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({ ...prev, [name]: numericValue }));
    
    // Update total harga real-time
    if (kendaraan && name === 'durasi_hari') {
       setTotalHarga(calculateTotal(numericValue, kendaraan.harga_per_hari));
    }
  };

  // --- FUNGSI SUBMIT (MEMBUAT PESANAN KE DATABASE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.durasi_hari <= 0) {
      alert("Durasi sewa minimal 1 hari.");
      return;
    }

    setIsSubmitting(true); 

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Silakan login terlebih dahulu.");
        navigate('/login');
        return;
      }

      // 1. SIAPKAN DATA UNTUK DIKIRIM KE BACKEND
      const payload = {
        id_kendaraan: kendaraan.id, 
        tanggal_pesan: formData.tanggal_pesan,
        durasi_hari: formData.durasi_hari,
        total_harga: totalHarga 
      };

      console.log("Mengirim Pesanan:", payload); 

      // 2. KIRIM KE API 
      const response = await axios.post(
        'http://127.0.0.1:8000/api/pemesanan',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 3. JIKA SUKSES
      if (response.status === 201) {
        const newOrder = response.data.pemesanan;
        console.log("Pesanan Berhasil Dibuat! ID:", newOrder.id_pemesanan);

        // 4. SIMPAN DATA KE SESSION (Opsional, untuk jaga-jaga)
        sessionStorage.setItem('lastPemesananDetails', JSON.stringify({
          id_pemesanan: newOrder.id_pemesanan, 
          total_harga: totalHarga,
          durasi_hari: formData.durasi_hari,
          tanggal_pesan: formData.tanggal_pesan, 
          kendaraan: kendaraan 
        }));

        alert("Pesanan berhasil dibuat! Silakan upload dokumen verifikasi.");

        // --- PERUBAHAN DISINI: Arahkan ke Halaman Unggah Dokumen ---
        // Menggunakan ID Pemesanan yang baru dibuat
        navigate(`/unggah-dokumen/${newOrder.id_pemesanan}`); 
      }

    } catch (err) {
      console.error("Pemesanan gagal:", err.response || err);
      const pesan = err.response?.data?.message || "Terjadi kesalahan server.";
      
      // Handle jika token expired / 401
      if (err.response?.status === 401) {
          alert("Sesi login berakhir. Silakan login ulang.");
          navigate('/login');
      } else {
          alert(`Gagal membuat pesanan: ${pesan}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Memuat...</div>;
  
  if (!kendaraan) return <div className="loading-state">Kendaraan tidak ditemukan</div>;
  
  const formattedTotal = formatRupiah(totalHarga);

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="btn-back-circle" style={{border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="header-title">Konfirmasi Sewa</span>
        <div style={{width: 40}}></div> 
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Ringkasan Mobil */}
        <div className="summary-section">
            <div className="vehicle-thumb-row">
                <img src={kendaraan.gambar_url} alt={kendaraan.nama} className="thumb-img" onError={(e)=>{e.target.src='https://via.placeholder.com/150'}} />
                <div className="vehicle-info">
                    <h3>{kendaraan.nama}</h3>
                    <p className="price-label">{formatRupiah(kendaraan.harga_per_hari)}/hari</p>
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
                    <button type="button" className="btn-counter" onClick={() => {
                        const newVal = Math.max(1, formData.durasi_hari - 1);
                        setFormData(prev => ({...prev, durasi_hari: newVal}));
                        setTotalHarga(calculateTotal(newVal, kendaraan.harga_per_hari));
                    }}>-</button>
                    <input 
                        type="number" 
                        name="durasi_hari" 
                        min="1" 
                        value={formData.durasi_hari} 
                        onChange={handleChange} 
                        className="custom-input text-center"
                    />
                    <button type="button" className="btn-counter" onClick={() => {
                        const newVal = formData.durasi_hari + 1;
                        setFormData(prev => ({...prev, durasi_hari: newVal}));
                        setTotalHarga(calculateTotal(newVal, kendaraan.harga_per_hari));
                    }}>+</button>
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

        <div style={{height: 100}}></div> 
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
            {isSubmitting ? 'Memproses...' : 'Lanjut Dokumen'}
        </button>
      </footer>

    </div>
  );
}

export default Pemesanan;