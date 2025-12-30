import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UploadPembayaran.css'; 

function UploadPembayaran() { 
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [files, setFiles] = useState({
    ktp: null,
    sim_c: null,
    jaminan: null,
    pembayaran: null
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
        setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi: Setidaknya ada satu file yang diunggah untuk perbaikan
    if (!files.ktp && !files.sim_c && !files.jaminan && !files.pembayaran) {
      alert("Mohon pilih setidaknya satu dokumen atau bukti pembayaran untuk diperbaiki.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('pemesanan_id', id); 
      if (files.ktp) formData.append('ktp', files.ktp);
      if (files.sim_c) formData.append('sim_c', files.sim_c);
      if (files.jaminan) formData.append('jaminan', files.jaminan);
      if (files.pembayaran) formData.append('bukti_pembayaran', files.pembayaran);

      // Endpoint diarahkan ke upload ulang / update verifikasi
      await axios.post(`http://127.0.0.1:8000/api/transaksi/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert("Data berhasil diperbarui! Silakan tunggu verifikasi ulang dari perental.");
      navigate(`/riwayat/${id}`);

    } catch (err) {
      console.error("Upload gagal:", err.response?.data || err.message);
      alert('Gagal mengunggah data perbaikan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-page-container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="btn-back-circle" style={{border:'none', background:'none'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="header-title">Perbaikan Data Sewa</span>
        <div style={{width: 40}}></div>
      </header>

      <div className="scroll-content">
        <div className="info-card-blue">
            <div className="info-icon">💡</div>
            <div className="info-text">
                <h4>Unggah Ulang Dokumen</h4>
                <p>Silakan unggah kembali dokumen atau bukti transfer yang diminta/ditolak oleh perental agar pesanan dapat diproses kembali.</p>
            </div>
        </div>

        <form className="upload-form-section" onSubmit={handleSubmit}>
            
            {/* INPUT KTP */}
            <div className="input-group">
                <label>1. Foto KTP (Perbaikan)</label>
                <input type="file" id="ktp" name="ktp" accept="image/*" onChange={handleFileChange} className="hidden-input" />
                <label htmlFor="ktp" className={`file-box-mini ${files.ktp ? 'uploaded' : ''}`}>
                    {files.ktp ? `✅ ${files.ktp.name}` : "📁 Pilih Foto KTP"}
                </label>
            </div>

            {/* INPUT SIM */}
            <div className="input-group">
                <label>2. Foto SIM C / A (Opsional)</label>
                <input type="file" id="sim_c" name="sim_c" accept="image/*" onChange={handleFileChange} className="hidden-input" />
                <label htmlFor="sim_c" className={`file-box-mini ${files.sim_c ? 'uploaded' : ''}`}>
                    {files.sim_c ? `✅ ${files.sim_c.name}` : "📁 Pilih Foto SIM"}
                </label>
            </div>

            {/* INPUT JAMINAN */}
            <div className="input-group">
                <label>3. Dokumen Jaminan (KK/Lainnya)</label>
                <input type="file" id="jaminan" name="jaminan" accept="image/*" onChange={handleFileChange} className="hidden-input" />
                <label htmlFor="jaminan" className={`file-box-mini ${files.jaminan ? 'uploaded' : ''}`}>
                    {files.jaminan ? `✅ ${files.jaminan.name}` : "📁 Pilih Dokumen Jaminan"}
                </label>
            </div>

            <div className="divider-thick" style={{margin: '20px -20px'}}></div>

            {/* INPUT PEMBAYARAN */}
            <div className="input-group">
                <label>4. Bukti Transfer Pembayaran</label>
                <input type="file" id="pembayaran" name="pembayaran" accept="image/*" onChange={handleFileChange} className="hidden-input" />
                <label htmlFor="pembayaran" className={`file-box-premium ${files.pembayaran ? 'uploaded' : ''}`}>
                    {files.pembayaran ? (
                        <div className="file-success">
                            <span>✅ Bukti Terpilih</span>
                            <small>{files.pembayaran.name}</small>
                        </div>
                    ) : (
                        <div className="file-placeholder">
                            <span className="icon-upload">💳</span>
                            <span>Unggah Bukti Transfer Baru</span>
                        </div>
                    )}
                </label>
            </div>
        </form>

        <div style={{height: 100}}></div>
      </div>

      <footer className="sticky-footer-action-single">
        <button onClick={handleSubmit} className={`btn-block-primary ${loading ? 'disabled' : ''}`} disabled={loading}>
            {loading ? 'Mengirim Perbaikan...' : 'Kirim Perbaikan Data'}
        </button>
      </footer>
    </div>
  );
}

export default UploadPembayaran;