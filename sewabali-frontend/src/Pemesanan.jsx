import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pemesanan.css'; 

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
  }, [id, calculateTotal, formData.durasi_hari]); // Dependensi: update jika ID atau Durasi berubah

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
        id_kendaraan: kendaraan.id, // ID Mobil
        tanggal_pesan: formData.tanggal_pesan,
        durasi_hari: formData.durasi_hari,
        total_harga: totalHarga // Kirim total harga hasil hitungan frontend
      };

      console.log("Mengirim Pesanan:", payload); // Debugging

      // 2. KIRIM KE API (PemesananController@store)
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

      // 3. JIKA SUKSES, TERIMA ID BARU DARI BACKEND
      if (response.status === 201) {
        const newOrder = response.data.pemesanan;
        console.log("Pesanan Berhasil Dibuat! ID:", newOrder.id_pemesanan);

        // 4. SIMPAN DATA ASLI KE SESSION (Untuk halaman Pembayaran)
        // Kita butuh ID Pemesanan ASLI dari database, bukan mock/dummy
        sessionStorage.setItem('lastPemesananDetails', JSON.stringify({
          id_pemesanan: newOrder.id_pemesanan, // INI YANG PENTING!
          total_harga: totalHarga,
          durasi_hari: formData.durasi_hari,
          tanggal_pesan: formData.tanggal_pesan, 
          kendaraan: kendaraan // Data mobil untuk tampilan
        }));

        alert("Pesanan berhasil dibuat! Silakan upload bukti pembayaran.");

        // 5. PINDAH KE HALAMAN PEMBAYARAN (Dengan membawa ID)
        // Saya arahkan langsung ke /pembayaran/:id agar lebih aman
        navigate(`/pembayaran/${newOrder.id_pemesanan}`); 
      }

    } catch (err) {
      console.error("Pemesanan gagal:", err.response || err);
      const pesan = err.response?.data?.message || "Terjadi kesalahan server.";
      alert(`Gagal membuat pesanan: ${pesan}`);
    } finally {
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
        <div style={{width: 40}}></div> 
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Ringkasan Mobil */}
        <div className="summary-section">
            <div className="vehicle-thumb-row">
                {/* Pastikan gambar ada fallback jika error */}
                <img src={kendaraan.gambar_url || 'https://via.placeholder.com/150'} alt={kendaraan.nama} className="thumb-img" />
                <div className="vehicle-info">
                    <h3>{kendaraan.nama}</h3>
                    <p className="price-label">Rp {parseInt(kendaraan.harga_per_hari).toLocaleString('id-ID')}/hari</p>
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
            {isSubmitting ? 'Memproses...' : 'Lanjut Bayar'}
        </button>
      </footer>

    </div>
  );
}

export default Pemesanan;