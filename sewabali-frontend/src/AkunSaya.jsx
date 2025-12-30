import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AkunSaya.css'; 

function AkunSaya() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // --- STATE UTAMA ---
  const [user, setUser] = useState({
    nama: "",
    email: "",
    telepon: "",
    alamat: "",
    avatar: "https://placehold.co/120x120/ffffff/007bff?text=User"
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

  // --- 1. FETCH DATA REALTIME DARI DATABASE ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        setUser({
            id: data.id, // Simpan ID untuk update
            nama: data.name || data.nama,
            email: data.email,
            telepon: data.nomor_telepon || data.telepon || "",
            alamat: data.alamat || "",
            avatar: data.avatar_url || "https://placehold.co/120x120/ffffff/007bff?text=" + (data.name ? data.name.charAt(0).toUpperCase() : 'U')
        });

      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // --- HANDLERS PROFIL ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // --- 2. UPDATE DATA KE DATABASE ---
  const handleSave = async () => {
    setEditMode({ telepon: false, alamat: false });
    
    try {
        const token = localStorage.getItem('token');
        // Kirim data yang diubah ke API (Sesuaikan endpoint update di Laravel)
        // Biasanya endpoint update profile itu PUT /api/user atau POST /api/user/update
        await axios.put('http://127.0.0.1:8000/api/user/update', {
            name: user.nama,
            nomor_telepon: user.telepon,
            alamat: user.alamat
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Profil berhasil diperbarui di database!");
    } catch (error) {
        console.error("Gagal update profil:", error);
        alert("Gagal memperbarui profil. Cek koneksi internet.");
    }
  };

  // --- UPLOAD FOTO KE DATABASE ---
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        // Preview lokal
        const imageUrl = URL.createObjectURL(file);
        setUser(prev => ({ ...prev, avatar: imageUrl }));

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', file);

            // Endpoint khusus upload avatar
            await axios.post('http://127.0.0.1:8000/api/user/avatar', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Foto profil berhasil diupload!");
        } catch (error) {
            console.error("Gagal upload foto:", error);
            alert("Gagal mengupload foto ke server.");
        }
    }
  };

  // --- HANDLERS KEAMANAN ---
  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
    setPassError('');
  };

  const savePassword = async (e) => {
    e.preventDefault();
    
    if (!passData.currentPass || !passData.newPass || !passData.confirmPass) {
        setPassError("Semua kolom harus diisi.");
        return;
    }

    if (passData.newPass !== passData.confirmPass) {
        setPassError("Konfirmasi kata sandi tidak cocok.");
        return;
    }

    if (passData.newPass.length < 6) {
        setPassError("Kata sandi minimal 6 karakter.");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        // Panggil API Ganti Password Laravel
        await axios.post('http://127.0.0.1:8000/api/user/password', {
            current_password: passData.currentPass,
            new_password: passData.newPass,
            new_password_confirmation: passData.confirmPass
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setPassSuccess("Kata sandi berhasil diubah!");
        setPassError('');
        setPassData({ currentPass: '', newPass: '', confirmPass: '' });
        
        setTimeout(() => {
            setShowSecurityModal(false);
            setPassSuccess('');
        }, 1500);

    } catch (error) {
        console.error("Gagal ganti password:", error);
        if (error.response && error.response.data.message) {
            setPassError(error.response.data.message); // Tampilkan pesan dari Laravel (misal: Password lama salah)
        } else {
            setPassError("Gagal mengganti kata sandi.");
        }
    }
  };

  if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Memuat Data...</p>
        </div>
      );
  }

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
                    <input 
                        type="text" 
                        name="nama" 
                        value={user.nama} 
                        onChange={handleChange} 
                        className="input-inline" 
                        style={{borderBottom: '1px solid #ddd'}}
                    />
                    <span className="icon-lock">✏️</span>
                </div>
            </div>
            <div className="divider-thin"></div>

            {/* Email (READ ONLY & TANPA BADGE) */}
            <div className="info-item">
                <label>Email</label>
                <div className="info-value">
                    <span className="text-dark" style={{color: '#64748b'}}>{user.email}</span>
                    <span className="icon-lock">🔒</span>
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
                        <span className="text-dark">{user.telepon || "-"}</span>
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
                        <span className="text-dark">{user.alamat || "-"}</span>
                    )}
                    <button className="btn-text-edit" onClick={() => toggleEdit('alamat')}>
                        {editMode.alamat ? 'Batal' : 'Ubah'}
                    </button>
                </div>
            </div>
        </div>

        {/* Info Tambahan (KEAMANAN) */}
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
                        <input type="password" name="currentPass" value={passData.currentPass} onChange={handlePassChange} placeholder="Masukkan sandi lama" />
                    </div>

                    <div className="form-group-modal">
                        <label>Kata Sandi Baru</label>
                        <input type="password" name="newPass" value={passData.newPass} onChange={handlePassChange} placeholder="Minimal 6 karakter" />
                    </div>

                    <div className="form-group-modal">
                        <label>Konfirmasi Sandi Baru</label>
                        <input type="password" name="confirmPass" value={passData.confirmPass} onChange={handlePassChange} placeholder="Ulangi sandi baru" />
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