import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilPerental.css';

function ProfilPerental() {
  const navigate = useNavigate();
  
  // --- 1. STATE DATA USER (Ditambah No HP & Alamat) ---
  const [userData, setUserData] = useState({
      name: "Fikri",
      email: "fikri@rental.com",
      phone: "0812-3456-7890",
      address: "Jl. Raya Kuta No. 88, Bali"
  });

  // --- STATE MODAL ---
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  // --- STATE FORM EDIT ---
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  // --- 2. LOAD DATA DARI LOCAL STORAGE ---
  useEffect(() => {
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const storedPhone = localStorage.getItem('userPhone');
      const storedAddress = localStorage.getItem('userAddress');
      
      setUserData(prev => ({
          ...prev,
          name: storedName || prev.name,
          email: storedEmail || prev.email,
          phone: storedPhone || prev.phone,
          address: storedAddress || prev.address
      }));
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

  // --- 3. SIMPAN PROFIL BARU ---
  const saveProfile = (e) => {
      e.preventDefault();
      // Validasi sederhana
      if(!editForm.name || !editForm.email || !editForm.phone) {
          alert("Nama, Email, dan No. Telepon wajib diisi!");
          return;
      }
      
      // Update State
      setUserData(editForm);
      
      // Simpan ke LocalStorage agar permanen
      localStorage.setItem('userName', editForm.name);
      localStorage.setItem('userEmail', editForm.email);
      localStorage.setItem('userPhone', editForm.phone);
      localStorage.setItem('userAddress', editForm.address);
      
      alert("Profil berhasil diperbarui!");
      setShowEditProfile(false);
  };

  // --- SIMPAN PASSWORD (Simulasi) ---
  const savePassword = (e) => {
      e.preventDefault();
      if(!passForm.oldPass || !passForm.newPass) {
          alert("Mohon lengkapi semua kolom password.");
          return;
      }
      if(passForm.newPass !== passForm.confirmPass) {
          alert("Password baru dan konfirmasi tidak cocok!");
          return;
      }
      alert("Password berhasil diubah!");
      setShowChangePass(false);
      setPassForm({ oldPass: '', newPass: '', confirmPass: '' });
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    if(window.confirm("Yakin ingin keluar dari akun?")) {
        localStorage.clear();
        navigate('/login');
    }
  };

  return (
    <div className="mobile-wrapper">
      
      {/* HEADER BACKGROUND */}
      <div className="profile-header-bg">
          <div className="header-title-center">Profil Saya</div>
      </div>

      {/* CARD PROFIL UTAMA */}
      <div className="profile-card-floating">
          <div className="avatar-large">
              {userData.name.charAt(0).toUpperCase()}
              <div className="edit-avatar-badge" onClick={() => alert("Fitur upload foto butuh Backend")}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
          </div>
          <h2 className="profile-name">{userData.name}</h2>
          <p className="profile-role">{userData.email}</p>
          {/* Tampilkan No HP di sini juga */}
          <p className="profile-role" style={{fontSize:'0.8rem', marginTop:'4px'}}>📞 {userData.phone}</p>
          
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

      {/* --- MODAL EDIT PROFIL (UPDATE TERBARU) --- */}
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
                          <label>Email</label>
                          <input type="email" className="input-modern" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                      </div>

                      {/* Input Baru: No HP */}
                      <div className="form-group">
                          <label>No. Telepon / WhatsApp</label>
                          <input type="tel" className="input-modern" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder="Contoh: 0812..." />
                      </div>

                      {/* Input Baru: Alamat (Textarea) */}
                      <div className="form-group">
                          <label>Alamat Garasi / Rumah</label>
                          <textarea 
                            className="input-modern" 
                            rows="3"
                            value={editForm.address} 
                            onChange={(e) => setEditForm({...editForm, address: e.target.value})} 
                            placeholder="Alamat lengkap untuk penjemputan unit..."
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

      {/* --- BOTTOM NAVBAR --- */}
      <nav className="bottom-nav-float">
          <button className="nav-btn" onClick={() => navigate('/perental/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span>Home</span>
          </button>
          
          <button className="nav-btn" onClick={() => navigate('/pesanan-masuk')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <span>Pesanan</span>
          </button>
          
          <button className="nav-btn active">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Profil</span>
          </button>
      </nav>
    </div>
  );
}

export default ProfilPerental;