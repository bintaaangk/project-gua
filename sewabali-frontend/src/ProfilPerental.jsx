import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilPerental.css';

function ProfilPerental() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref untuk input file tersembunyi
  const [loading, setLoading] = useState(true);

  // --- 1. STATE DATA USER (Real Time dari DB) ---
  const [userData, setUserData] = useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      avatar: null // URL foto profil
  });

  // --- STATE MODAL ---
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  // --- STATE FORM EDIT ---
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  // --- 2. FETCH DATA DARI API ---
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const user = response.data;
      setUserData({
        name: user.name,
        email: user.email,
        phone: user.nomor_telepon || "", // Mapping dari backend 'nomor_telepon'
        address: user.alamat || "",      // Mapping dari backend 'alamat'
        avatar: user.avatar_url          // Mapping dari backend 'avatar_url'
      });
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
      if (error.response && error.response.status === 401) {
          navigate('/login'); // Redirect jika token expired
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // --- BUKA MODAL EDIT ---
  const openEditProfile = () => {
      setEditForm({ 
          name: userData.name, 
          email: userData.email,
          phone: userData.phone,
          address: userData.address
      });
      setShowEditProfile(true);
  };

  // --- 3. SIMPAN PROFIL KE DATABASE ---
  const saveProfile = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        // Kirim data ke API AuthController@updateProfile
        await axios.put('http://localhost:8000/api/profile', {
            name: editForm.name,
            nomor_telepon: editForm.phone, // Sesuaikan nama kolom DB
            alamat: editForm.address       // Sesuaikan nama kolom DB
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Profil berhasil diperbarui!");
        fetchUserProfile(); // Refresh data tampilan
        setShowEditProfile(false);
      } catch (error) {
        console.error("Gagal update profil:", error);
        alert("Gagal memperbarui profil. Cek koneksi atau inputan.");
      }
  };

  // --- 4. GANTI PASSWORD ---
  const savePassword = async (e) => {
      e.preventDefault();
      if(passForm.newPass !== passForm.confirmPass) {
          alert("Konfirmasi password tidak cocok!");
          return;
      }

      try {
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:8000/api/password', {
            current_password: passForm.oldPass,
            new_password: passForm.newPass,
            new_password_confirmation: passForm.confirmPass
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Password berhasil diubah!");
        setShowChangePass(false);
        setPassForm({ oldPass: '', newPass: '', confirmPass: '' });
      } catch (error) {
        console.error("Gagal ganti password:", error);
        alert(error.response?.data?.message || "Password lama salah atau terjadi kesalahan.");
      }
  };

  // --- 5. UPLOAD FOTO PROFIL (AVATAR) ---
  const handleAvatarClick = () => {
    fileInputRef.current.click(); // Memicu klik pada input file tersembunyi
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8000/api/avatar', formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        // Update tampilan avatar langsung
        setUserData(prev => ({ ...prev, avatar: response.data.avatar_url }));
        alert("Foto profil berhasil diganti!");
    } catch (error) {
        console.error("Gagal upload avatar:", error);
        alert("Gagal mengupload foto. Pastikan ukuran < 2MB.");
    }
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    if(window.confirm("Yakin ingin keluar dari akun?")) {
        localStorage.clear();
        navigate('/login');
    }
  };

  if (loading) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', // Memastikan tinggi full layar
      flexDirection: 'column',
      backgroundColor: '#f3f4f6' // Warna background abu-abu muda (opsional)
    }}>
      {/* Tambahkan Spinner biar keren dikit */}
      <div className="spinner" style={{ marginBottom: '10px' }}></div>
      <p style={{ color: '#6b7280', fontSize: '1rem' }}>Memuat Profil...</p>
    </div>
  );
}
  return (
    <div className="mobile-wrapper">
      
      {/* HEADER BACKGROUND */}
      <div className="profile-header-bg">
          <div className="header-title-center">Profil Saya</div>
      </div>

      {/* CARD PROFIL UTAMA */}
      <div className="profile-card-floating">
          <div className="avatar-large">
              {/* Tampilkan Gambar dari Server atau Inisial */}
              {userData.avatar ? (
                  <img src={userData.avatar} alt="Profile" className="avatar-img-real" />
              ) : (
                  userData.name.charAt(0).toUpperCase()
              )}
              
              {/* Tombol Edit Avatar */}
              <div className="edit-avatar-badge" onClick={handleAvatarClick}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              {/* Input File Tersembunyi */}
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{display:'none'}} 
                  accept="image/*"
                  onChange={handleFileChange}
              />
          </div>
          <h2 className="profile-name">{userData.name}</h2>
          <p className="profile-role">{userData.email}</p>
          <p className="profile-role" style={{fontSize:'0.8rem', marginTop:'4px'}}>
              {userData.phone ? `📞 ${userData.phone}` : 'No. HP belum diatur'}
          </p>
          
          <button className="btn-edit-profile" onClick={openEditProfile}>Edit Profil</button>
      </div>

      {/* MENU SETTINGS */}
      <div className="content-scroll">
          <div className="menu-section">
              <div className="section-label">Akun</div>
              <div className="menu-group">
                  <div className="menu-item" onClick={openEditProfile}>
                      <div className="menu-left">
                          <div className="menu-icon blue">👤</div>
                          <span className="menu-label">Informasi & Alamat</span>
                      </div>
                      <div className="menu-arrow">›</div>
                  </div>
                  <div className="menu-item" onClick={() => setShowChangePass(true)}>
                      <div className="menu-left">
                          <div className="menu-icon green">🔒</div>
                          <span className="menu-label">Keamanan & Password</span>
                      </div>
                      <div className="menu-arrow">›</div>
                  </div>
              </div>
          </div>

          <div className="menu-section">
              <div className="menu-group">
                  <div className="menu-item" onClick={() => navigate('/perental/notifikasi')}>
                      <div className="menu-left">
                          <div className="menu-icon orange">🔔</div>
                          <span className="menu-label">Notifikasi</span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="logout-container">
              <button className="btn-logout-block" onClick={handleLogout}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Keluar
              </button>
          </div>
      </div>

      {/* --- MODAL EDIT PROFIL --- */}
      {showEditProfile && (
          <div className="modal-overlay">
              <div className="modal-box slide-up">
                  <h3>Edit Identitas</h3>
                  <form onSubmit={saveProfile}>
                      <div className="form-group">
                          <label>Nama Lengkap</label>
                          <input type="text" className="input-modern" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                      </div>
                      <div className="form-group">
                          <label>Email (Tidak dapat diubah)</label>
                          <input type="email" className="input-modern" value={editForm.email} disabled style={{backgroundColor:'#f1f5f9', color:'#94a3b8'}} />
                      </div>
                      <div className="form-group">
                          <label>No. Telepon / WhatsApp</label>
                          <input type="tel" className="input-modern" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder="0812..." />
                      </div>
                      <div className="form-group">
                          <label>Alamat Garasi / Rumah</label>
                          <textarea 
                            className="input-modern" 
                            rows="3"
                            value={editForm.address} 
                            onChange={(e) => setEditForm({...editForm, address: e.target.value})} 
                            placeholder="Alamat lengkap..."
                            style={{resize:'none'}}
                          />
                      </div>
                      <div className="modal-actions">
                          <button type="button" className="btn-secondary" onClick={() => setShowEditProfile(false)}>Batal</button>
                          <button type="submit" className="btn-primary-full" style={{marginTop:0}}>Simpan</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* --- MODAL GANTI PASSWORD --- */}
      {showChangePass && (
          <div className="modal-overlay">
              <div className="modal-box slide-up">
                  <h3>Ganti Password</h3>
                  <form onSubmit={savePassword}>
                      <div className="form-group">
                          <label>Password Lama</label>
                          <input type="password" className="input-modern" value={passForm.oldPass} onChange={(e) => setPassForm({...passForm, oldPass: e.target.value})} />
                      </div>
                      <div className="form-group">
                          <label>Password Baru</label>
                          <input type="password" className="input-modern" value={passForm.newPass} onChange={(e) => setPassForm({...passForm, newPass: e.target.value})} />
                      </div>
                      <div className="form-group">
                          <label>Konfirmasi Password</label>
                          <input type="password" className="input-modern" value={passForm.confirmPass} onChange={(e) => setPassForm({...passForm, confirmPass: e.target.value})} />
                      </div>
                      <div className="modal-actions">
                          <button type="button" className="btn-secondary" onClick={() => setShowChangePass(false)}>Batal</button>
                          <button type="submit" className="btn-primary-full" style={{marginTop:0}}>Simpan</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* --- BOTTOM NAV (FIXED) --- */}
      <div className="nav-container-fixed">
          <nav className="bottom-nav-perental">
              <button className="nav-btn" onClick={() => navigate('/perental/dashboard')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  <span>Home</span>
              </button>
              
              <button className="nav-btn" onClick={() => navigate('/pesanan-masuk')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  <span>Pesanan</span>
              </button>

              <button className="nav-btn active" onClick={() => navigate('/perental/profil')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>Profil</span>
              </button>
          </nav>
      </div>
    </div>
  );
}

export default ProfilPerental;