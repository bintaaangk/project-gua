import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UnggahDokumen.css'; 

const ID_PENYEWA = 1; 

function UnggahDokumen() { 
  const navigate = useNavigate();
  
  const [files, setFiles] = useState({
    ktp: null,
    sim_c: null,
    jaminan: null,
  });
  const [loading, setLoading] = useState(false);
  
  // Cek apakah ada data pemesanan sebelumnya (opsional, untuk validasi)
  useEffect(() => {
    const savedDetails = sessionStorage.getItem('lastPemesananDetails');
    if (!savedDetails) {
        // Jika user langsung tembak URL tanpa pesan dulu
        // alert("Tidak ada data pemesanan aktif.");
        // navigate('/beranda');
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
        setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.ktp || !files.jaminan) {
      alert("Mohon lengkapi dokumen wajib (KTP & Jaminan).");
      return;
    }

    setLoading(true);

    try {
      // Simulasi Proses Upload
      // const formData = new FormData(); ... (Logika backend)

      // Ambil ID pemesanan dari session untuk redirect
      const savedDetails = JSON.parse(sessionStorage.getItem('lastPemesananDetails'));
      const newPemesananId = savedDetails ? savedDetails.id_pemesanan : 456; 

      // Simulasi delay network
      setTimeout(() => {
        // Redirect ke halaman Pembayaran sesuai request kode asli Anda
        navigate(`/pembayaran/${newPemesananId}`); 
      }, 1500);

    } catch (err) {
      console.error("Upload gagal:", err);
      alert('Terjadi kesalahan saat mengunggah dokumen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <Link to="/beranda" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Verifikasi Dokumen</span>
        <div style={{width: 40}}></div>
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Info Card */}
        <div className="info-card-warning">
            <div className="info-icon">⚠️</div>
            <div className="info-text">
                <h4>Penting!</h4>
                <p>Dokumen wajib diunggah untuk verifikasi keamanan. Pastikan foto terlihat jelas dan tidak buram.</p>
            </div>
        </div>

        <div className="divider-thick"></div>

        <form className="upload-form-section">
            <h3 className="section-label">Upload Dokumen</h3>

            {/* Input 1: KTP */}
            <div className="input-group">
                <label>1. Foto KTP (Wajib)</label>
                <div className="custom-file-wrapper">
                    <input 
                        type="file" 
                        id="ktp" 
                        name="ktp" 
                        accept="image/*,.pdf" 
                        onChange={handleFileChange} 
                        className="hidden-input"
                    />
                    <label htmlFor="ktp" className={`file-box ${files.ktp ? 'uploaded' : ''}`}>
                        {files.ktp ? (
                            <div className="file-success">
                                <span className="check-icon">✔</span>
                                <span className="filename">{files.ktp.name}</span>
                                <span className="change-text">Ganti File</span>
                            </div>
                        ) : (
                            <div className="file-placeholder">
                                <span className="icon-upload">📷</span>
                                <span>Ketuk untuk ambil foto KTP</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {/* Input 2: SIM C */}
            <div className="input-group">
                <label>2. Foto SIM C (Opsional)</label>
                <div className="custom-file-wrapper">
                    <input 
                        type="file" 
                        id="sim_c" 
                        name="sim_c" 
                        accept="image/*,.pdf" 
                        onChange={handleFileChange} 
                        className="hidden-input"
                    />
                    <label htmlFor="sim_c" className={`file-box ${files.sim_c ? 'uploaded' : ''}`}>
                        {files.sim_c ? (
                            <div className="file-success">
                                <span className="check-icon">✔</span>
                                <span className="filename">{files.sim_c.name}</span>
                                <span className="change-text">Ganti File</span>
                            </div>
                        ) : (
                            <div className="file-placeholder">
                                <span className="icon-upload">📷</span>
                                <span>Ketuk untuk ambil foto SIM</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {/* Input 3: Jaminan */}
            <div className="input-group">
                <label>3. Dokumen Jaminan (Wajib)</label>
                <p className="sub-label">Contoh: KK Asli, Ijazah, atau STNK Pribadi</p>
                <div className="custom-file-wrapper">
                    <input 
                        type="file" 
                        id="jaminan" 
                        name="jaminan" 
                        accept="image/*,.pdf" 
                        onChange={handleFileChange} 
                        className="hidden-input"
                    />
                    <label htmlFor="jaminan" className={`file-box ${files.jaminan ? 'uploaded' : ''}`}>
                        {files.jaminan ? (
                            <div className="file-success">
                                <span className="check-icon">✔</span>
                                <span className="filename">{files.jaminan.name}</span>
                                <span className="change-text">Ganti File</span>
                            </div>
                        ) : (
                            <div className="file-placeholder">
                                <span className="icon-upload">📄</span>
                                <span>Pilih Dokumen Jaminan</span>
                            </div>
                        )}
                    </label>
                </div>
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
            {loading ? 'Mengunggah...' : 'Lanjut ke Pembayaran'}
        </button>
      </footer>

    </div>
  );
}

export default UnggahDokumen;