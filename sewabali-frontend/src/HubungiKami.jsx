import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HalamanInfo.css';

function HubungiKami() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: ''
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi kirim pesan
    console.log("Pesan Terkirim:", formData);
    setSent(true);
    setFormData({ nama: '', email: '', pesan: '' });
    
    // Hilangkan notifikasi setelah 3 detik
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="mobile-page-container">
      <header className="page-header">
        <Link to="/about" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Hubungi Kami</span>
        <div style={{width: 40}}></div>
      </header>

      <div className="scroll-content">
        <div className="contact-hero">
            <h2>Butuh Bantuan?</h2>
            <p>Tim support kami siap membantu Anda 24/7.</p>
        </div>

        <div className="contact-info-box">
            <div className="contact-row">
                <span className="icon-c">📍</span>
                <span>Jl. Sunset Road No. 88, Kuta, Bali</span>
            </div>
            <div className="contact-row">
                <span className="icon-c">📧</span>
                <span>support@sewabali.id</span>
            </div>
            <div className="contact-row">
                <span className="icon-c">📞</span>
                <span>+62 812-3456-7890</span>
            </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
            {sent && <div className="alert-box">Pesan berhasil dikirim! Kami akan membalas segera.</div>}
            
            <div className="form-group">
                <label>Nama Lengkap</label>
                <input 
                    type="text" 
                    name="nama"
                    className="form-input" 
                    placeholder="Masukkan nama anda" 
                    value={formData.nama}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="contoh@email.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Pesan</label>
                <textarea 
                    name="pesan"
                    className="form-textarea" 
                    placeholder="Tulis pesan atau keluhan Anda di sini..."
                    value={formData.pesan}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>

            <button type="submit" className="btn-send">Kirim Pesan</button>
        </form>
      </div>
    </div>
  );
}

export default HubungiKami;