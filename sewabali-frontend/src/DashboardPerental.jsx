import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPerental.css';

// --- DATA DUMMY (UNTUK PREVIEW DESAIN) ---
const DUMMY_UNITS = [
    {
        id: 1,
        nama: 'Toyota Avanza Zenix',
        tipe: 'Mobil',
        plat_nomor: 'DK 1234 AB',
        harga_per_hari: 350000,
        transmisi: 'Matic',
        kapasitas: 7,
        gambar_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500&q=80',
        status: 'Tersedia'
    },
    {
        id: 2,
        nama: 'Honda Brio RS',
        tipe: 'Mobil',
        plat_nomor: 'DK 5678 CD',
        harga_per_hari: 300000,
        transmisi: 'Manual',
        kapasitas: 5,
        gambar_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80',
        status: 'Disewa'
    },
    {
        id: 3,
        nama: 'Yamaha NMAX',
        tipe: 'Motor',
        plat_nomor: 'DK 9999 XX',
        harga_per_hari: 120000,
        transmisi: 'Matic',
        kapasitas: 2,
        gambar_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80',
        status: 'Tersedia'
    }
];

function DashboardPerental() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('unit'); // Default view
  const [units, setUnits] = useState(DUMMY_UNITS); // Pakai data dummy
  const [loading, setLoading] = useState(false);

  // Ambil Token (Simulasi Login)
  const userName = localStorage.getItem('userName') || "Fikri";

  // --- STATE FORM ---
  const [newUnitData, setNewUnitData] = useState({
    nama: '', tipe: 'Mobil', plat: '', harga: '', 
    transmisi: 'Manual', kapasitas: '4', img: null, imgPreview: null
  });

  const handleInputChange = (e) => {
    setNewUnitData({ ...newUnitData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        setNewUnitData({ ...newUnitData, img: file, imgPreview: URL.createObjectURL(file) });
    }
  };

  const handleSubmitUnit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!newUnitData.nama || !newUnitData.plat || !newUnitData.harga) {
        alert("Mohon lengkapi semua data!");
        setLoading(false); return;
    }

    // Simulasi Tambah Unit ke List
    setTimeout(() => {
        const newUnit = {
            id: units.length + 1,
            nama: newUnitData.nama,
            tipe: newUnitData.tipe,
            plat_nomor: newUnitData.plat,
            harga_per_hari: parseInt(newUnitData.harga),
            transmisi: newUnitData.transmisi,
            kapasitas: newUnitData.kapasitas,
            gambar_url: newUnitData.imgPreview || 'https://placehold.co/400x300?text=Unit+Baru',
            status: 'Tersedia'
        };

        setUnits([newUnit, ...units]); // Tambah ke atas list
        setLoading(false);
        setActiveView('unit'); // Kembali ke list
        setNewUnitData({ nama: '', tipe: 'Mobil', plat: '', harga: '', transmisi: 'Manual', kapasitas: '4', img: null, imgPreview: null });
        alert("Sukses! Unit tersimpan (Mode Preview).");
    }, 1000);
  };

  const handleLogout = () => {
    if(window.confirm("Logout?")) { localStorage.clear(); navigate('/login'); }
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (activeView === 'tambah-unit') {
        return (
            <div className="form-container">
                <div style={{marginBottom:15}}>
                    <h3 style={{margin:0}}>Tambah Unit Baru</h3>
                    <p style={{margin:0, fontSize:'0.8rem', color:'#64748b'}}>Isi detail kendaraanmu di sini.</p>
                </div>

                <form onSubmit={handleSubmitUnit} noValidate>
                    <div className="form-group">
                        <label>Foto Unit</label>
                        <div className="upload-area">
                            <input type="file" id="u-img" accept="image/*" onChange={handleImageUpload} hidden />
                            <label htmlFor="u-img" style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                {newUnitData.imgPreview ? <img src={newUnitData.imgPreview} className="upload-preview" alt="preview"/> : <span style={{color:'#94a3b8'}}>📸 Ketuk untuk Upload</span>}
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nama Kendaraan</label>
                        <input className="input-modern" type="text" name="nama" value={newUnitData.nama} onChange={handleInputChange} placeholder="Contoh: Avanza Veloz" />
                    </div>

                    <div className="form-row" style={{display:'flex', gap:'10px'}}>
                        <div className="form-col" style={{flex:1}}>
                            <div className="form-group">
                                <label>Plat Nomor</label>
                                <input className="input-modern" type="text" name="plat" value={newUnitData.plat} onChange={handleInputChange} placeholder="DK 1234 XX" />
                            </div>
                        </div>
                        <div className="form-col" style={{flex:1}}>
                            <div className="form-group">
                                <label>Harga /Hari</label>
                                <input className="input-modern" type="number" name="harga" value={newUnitData.harga} onChange={handleInputChange} placeholder="350000" />
                            </div>
                        </div>
                    </div>

                    <div className="form-row" style={{display:'flex', gap:'10px'}}>
                         <div className="form-col" style={{flex:1}}>
                            <div className="form-group">
                                <label>Transmisi</label>
                                <select className="input-modern" name="transmisi" value={newUnitData.transmisi} onChange={handleInputChange}>
                                    <option value="Manual">Manual</option>
                                    <option value="Matic">Matic</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-col" style={{flex:1}}>
                            <div className="form-group">
                                <label>Kapasitas</label>
                                <input className="input-modern" type="number" name="kapasitas" value={newUnitData.kapasitas} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    <button type="button" className="btn-secondary" onClick={() => setActiveView('unit')}>Batal</button>
                    <button type="submit" className="btn-primary-full" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Unit'}</button>
                </form>
            </div>
        );
    }

    // Default View: List Unit
    return (
        <div>
            <div className="section-title-row">
                <h3>Unit Tersedia ({units.length})</h3>
                <button className="btn-text-action" onClick={() => setActiveView('tambah-unit')}>+ Tambah</button>
            </div>
            
            <div className="unit-list">
                {units.map(unit => (
                    <div key={unit.id} className="unit-card-new">
                        <div className="unit-img-top">
                            <img src={unit.gambar_url} alt={unit.nama} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                            <span className="badge-avail" style={{
                                backgroundColor: unit.status === 'Tersedia' ? 'rgba(255,255,255,0.9)' : 'rgba(254, 226, 226, 0.9)',
                                color: unit.status === 'Tersedia' ? '#059669' : '#DC2626'
                            }}>
                                {unit.status}
                            </span>
                        </div>
                        <div className="unit-info-body">
                            <div className="unit-name-row">
                                <h4>{unit.nama}</h4>
                                <span className="plat-badge">{unit.plat_nomor}</span>
                            </div>
                            <div className="price-row">
                                Rp {unit.harga_per_hari.toLocaleString('id-ID')}<span>/hari</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="user-profile">
            <div className="avatar-circle">{userName.charAt(0)}</div>
            <div className="user-text">
                <h4>Hi, {userName}</h4>
                <span className="status-badge">Online</span>
            </div>
        </div>
        <button className="btn-logout-mini" onClick={handleLogout}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </header>

      {/* CONTENT */}
      <div className="dashboard-content">
        {/* Banner */}
        {activeView === 'unit' && (
            <div className="hero-banner">
                <h2>Kelola Rentalmu 🚀</h2>
                <p>Pantau performa unit dan pesanan secara real-time di sini.</p>
            </div>
        )}

        {/* Menu Grid */}
        <div className="menu-container">
            <div className={`menu-card ${activeView === 'unit' ? 'active' : ''}`} onClick={() => setActiveView('unit')}>
                <div className="icon-box blue">🚗</div>
                <span className="menu-text">Unit Saya</span>
            </div>
            <div className="menu-card" onClick={() => navigate('/pesanan-masuk')}>
                <div className="icon-box orange">📦</div>
                <span className="menu-text">Pesanan</span>
            </div>
            <div className={`menu-card ${activeView === 'jadwal' ? 'active' : ''}`} onClick={() => setActiveView('jadwal')}>
                <div className="icon-box purple">📅</div>
                <span className="menu-text">Jadwal</span>
            </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav-float">
         <button className="nav-btn active">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
             <span>Home</span>
         </button>
         <button className="nav-btn" onClick={() => navigate('/pesanan-masuk')}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
             <span>Pesanan</span>
         </button>
         <button className="nav-btn" onClick={() => navigate('/perental/profil')}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
             <span>Profil</span>
         </button>
      </nav>
    </div>
  );
}

export default DashboardPerental;