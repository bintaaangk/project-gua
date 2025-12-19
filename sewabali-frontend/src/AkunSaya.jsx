import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AkunSaya.css'; 

function AkunSaya() {
  // --- STATE UTAMA ---
  const [user, setUser] = useState({
    nama: "Fikri Aditia",
    email: "fikriaditia@gmail.com",
    telepon: "081234567890",
    alamat: "Jl. Raya Canggu No. 10, Bali",
    avatar: "https://placehold.co/120x120/ffffff/007bff?text=FA"
  });

  const [editMode, setEditMode] = useState({ telepon: false, alamat: false });

  // --- STATE KEAMANAN (MODAL) ---
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [passData, setPassData] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: ''
  });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // --- EFFECT ---
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfileData');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  // --- HANDLERS PROFIL ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    setEditMode({ telepon: false, alamat: false });
    localStorage.setItem('userProfileData', JSON.stringify(user));
    alert("Profil berhasil diperbarui!");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setUser(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  // --- HANDLERS KEAMANAN ---
  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
    setPassError(''); // Reset error saat mengetik
  };

  const savePassword = (e) => {
    e.preventDefault();
    
    // 1. Validasi Sederhana
    if (!passData.currentPass || !passData.newPass || !passData.confirmPass) {
        setPassError("Semua kolom harus diisi.");
        return;
    }

    // 2. Simulasi Cek Password Lama (Anggap password lama '123456')
    if (passData.currentPass !== '123456') {
        setPassError("Kata sandi saat ini salah (Default: 123456).");
        return;
    }

    // 3. Cek Konfirmasi Password
    if (passData.newPass !== passData.confirmPass) {
        setPassError("Konfirmasi kata sandi tidak cocok.");
        return;
    }

    // 4. Cek Panjang Password
    if (passData.newPass.length < 6) {
        setPassError("Kata sandi minimal 6 karakter.");
        return;
    }

    // SUKSES
    setPassSuccess("Kata sandi berhasil diubah!");
    setPassError('');
    setPassData({ currentPass: '', newPass: '', confirmPass: '' });
    
    // Tutup modal setelah 1.5 detik
    setTimeout(() => {
        setShowSecurityModal(false);
        setPassSuccess('');
    }, 1500);
  };

  return (
    <div className="mobile-page-container">
      
      {/* Header Sticky */}
      <header className="page-header">
        <Link to="/profil" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Informasi Pribadi</span>
        <div style={{width: 40}}></div>
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {/* Foto Profil */}
        <div className="profile-header-section">
            <div className="avatar-large-wrapper">
                <img src={user.avatar} alt="Profile" className="avatar-large" />
                <input type="file" id="upload-avatar" accept="image/*" style={{display: 'none'}} onChange={handlePhotoChange}/>
                <label htmlFor="upload-avatar" className="btn-edit-photo-large">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </label>
            </div>
            <p className="profile-subtitle">Pastikan data Anda selalu up-to-date untuk kemudahan transaksi.</p>
        </div>

        {/* Informasi Akun */}
        <div className="info-card">
            {/* Nama */}
            <div className="info-item">
                <label>Nama Lengkap</label>
                <div className="info-value">
                    <span className="text-dark">{user.nama}</span>
                    <span className="icon-lock">🔒</span>
                </div>
            </div>
            <div className="divider-thin"></div>

            {/* Email */}
            <div className="info-item">
                <label>Email</label>
                <div className="info-value">
                    <span className="text-dark">{user.email}</span>
                    <span className="verified-badge">Terverifikasi</span>
                </div>
            </div>
            <div className="divider-thin"></div>

            {/* Telepon */}
            <div className="info-item">
                <label>Nomor Telepon</label>
                <div className="info-value">
                    {editMode.telepon ? (
                        <input type="tel" name="telepon" value={user.telepon} onChange={handleChange} className="input-inline" autoFocus />
                    ) : (
                        <span className="text-dark">{user.telepon}</span>
                    )}
                    <button className="btn-text-edit" onClick={() => toggleEdit('telepon')}>
                        {editMode.telepon ? 'Batal' : 'Ubah'}
                    </button>
                </div>
            </div>
            <div className="divider-thin"></div>

            {/* Alamat */}
            <div className="info-item">
                <label>Alamat</label>
                <div className="info-value">
                    {editMode.alamat ? (
                        <textarea name="alamat" value={user.alamat} onChange={handleChange} className="textarea-inline" rows="2" />
                    ) : (
                        <span className="text-dark">{user.alamat}</span>
                    )}
                    <button className="btn-text-edit" onClick={() => toggleEdit('alamat')}>
                        {editMode.alamat ? 'Batal' : 'Ubah'}
                    </button>
                </div>
            </div>
        </div>

        {/* Info Tambahan (KEAMANAN) - SEKARANG BISA DIKLIK */}
        <div className="info-card-secondary">
            <div className="secondary-item clickable" onClick={() => setShowSecurityModal(true)}>
                <div className="sec-icon">🛡️</div>
                <div className="sec-text">
                    <h4>Keamanan Akun</h4>
                    <p>Ubah kata sandi & keamanan</p>
                </div>
                <div className="chevron">&rsaquo;</div>
            </div>
        </div>

        <div style={{height: 100}}></div>
      </div>

      {/* Sticky Footer */}
      <footer className="sticky-footer-action-single">
        <button className="btn-block-primary" onClick={handleSave}>
            Simpan Perubahan
        </button>
      </footer>

      {/* --- MODAL UBAH PASSWORD --- */}
      {showSecurityModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Ubah Kata Sandi</h3>
                    <button className="btn-close-modal" onClick={() => setShowSecurityModal(false)}>✕</button>
                </div>
                
                <form onSubmit={savePassword}>
                    {passError && <div className="alert-error">{passError}</div>}
                    {passSuccess && <div className="alert-success">{passSuccess}</div>}

                    <div className="form-group-modal">
                        <label>Kata Sandi Saat Ini</label>
                        <input 
                            type="password" 
                            name="currentPass" 
                            value={passData.currentPass} 
                            onChange={handlePassChange} 
                            placeholder="Masukkan sandi lama"
                        />
                    </div>

                    <div className="form-group-modal">
                        <label>Kata Sandi Baru</label>
                        <input 
                            type="password" 
                            name="newPass" 
                            value={passData.newPass} 
                            onChange={handlePassChange} 
                            placeholder="Minimal 6 karakter"
                        />
                    </div>

                    <div className="form-group-modal">
                        <label>Konfirmasi Sandi Baru</label>
                        <input 
                            type="password" 
                            name="confirmPass" 
                            value={passData.confirmPass} 
                            onChange={handlePassChange} 
                            placeholder="Ulangi sandi baru"
                        />
                    </div>

                    <button type="submit" className="btn-save-modal">Simpan Kata Sandi</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}

export default AkunSaya;