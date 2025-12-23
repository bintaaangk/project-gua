import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
  const [jadwal, setJadwal] = useState([
    { id: 1, unit: 'Toyota Avanza Zenix', plat_nomor: 'DK 1234 AB', peminjam: 'Rudi Hartono', kontak: '081234567890', mulai: '2024-12-25', selesai: '2024-12-28', status: 'Dikonfirmasi', harga_harian: 350000, catatan: 'Sopir hati-hati di jalanan utama' },
    { id: 2, unit: 'Honda Brio RS', plat_nomor: 'DK 5678 CD', peminjam: 'Siti Nurhaliza', kontak: '081987654321', mulai: '2024-12-26', selesai: '2024-12-29', status: 'Dikonfirmasi', harga_harian: 300000, catatan: 'Pengembalian tepat waktu' },
    { id: 3, unit: 'Yamaha NMAX', plat_nomor: 'DK 9999 XX', peminjam: 'Ahmad Pratama', kontak: '082111222333', mulai: '2024-12-27', selesai: '2024-12-30', status: 'Pending', harga_harian: 120000, catatan: 'Menunggu konfirmasi pembayaran' }
  ]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

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
        setLoading(false); 
        return;
    }

    // Siapkan FormData untuk upload gambar
    const formData = new FormData();
    formData.append('nama', newUnitData.nama);
    formData.append('tipe', newUnitData.tipe);
    formData.append('plat_nomor', newUnitData.plat);
    formData.append('harga_per_hari', parseInt(newUnitData.harga));
    formData.append('transmisi', newUnitData.transmisi);
    formData.append('kapasitas', newUnitData.kapasitas);
    
    // Tambahkan gambar jika ada
    if (newUnitData.img) {
        formData.append('gambar', newUnitData.img);
    }

    // Kirim ke backend API
    const token = localStorage.getItem('token'); // Pastikan token disimpan saat login
    
    axios.post('http://localhost:8000/api/kendaraan', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        setLoading(false);
        alert('✓ Unit berhasil ditambahkan dan tersimpan di database!');
        
        // Tambah ke list lokal juga
        setUnits([response.data.data, ...units]);
        
        // Reset form
        setActiveView('unit');
        setNewUnitData({ 
            nama: '', tipe: 'Mobil', plat: '', harga: '', 
            transmisi: 'Manual', kapasitas: '4', img: null, imgPreview: null 
        });
    })
    .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        alert('❌ Gagal menambahkan unit. Cek koneksi atau token Anda.');
    });
  };

  const handleLogout = () => {
    if(window.confirm("Logout?")) { localStorage.clear(); navigate('/login'); }
  };

  const handleLihatDetail = (id) => {
    const jadwalDetail = jadwal.find(j => j.id === id);
    if(jadwalDetail) {
      setSelectedJadwal(jadwalDetail);
      setShowDetailModal(true);
    }
  };

  const handleBatalJadwal = (id) => {
    if(window.confirm('Apakah Anda yakin ingin membatalkan jadwal ini?')) {
      setJadwal(jadwal.filter(j => j.id !== id));
      alert('✓ Jadwal berhasil dibatalkan. Pemberitahuan dikirim ke peminjam.');
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedJadwal(null);
  };

  const handleKonfirmasiJadwal = () => {
    if(selectedJadwal) {
      setJadwal(jadwal.map(j => 
        j.id === selectedJadwal.id ? {...j, status: 'Dikonfirmasi'} : j
      ));
      alert('✓ Jadwal dikonfirmasi. Pemberitahuan dikirim ke peminjam.');
      handleCloseModal();
    }
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (activeView === 'jadwal') {
        return (
            <div className="form-container">
                <div style={{marginBottom:20}}>
                    <h3 style={{margin:0}}>Jadwal Penyewaan</h3>
                    <p style={{margin:0, fontSize:'0.8rem', color:'#64748b'}}>Kelola jadwal rental unitmu.</p>
                </div>
                
                {jadwal.length === 0 ? (
                    <div style={{textAlign:'center', padding:'40px 20px', color:'#94a3b8'}}>
                        <p>📅 Belum ada jadwal penyewaan</p>
                    </div>
                ) : (
                    <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                        {jadwal.map(j => (
                            <div key={j.id} style={{
                                border:'1px solid #e2e8f0',
                                borderRadius:'8px',
                                padding:'15px',
                                display:'flex',
                                justifyContent:'space-between',
                                alignItems:'center',
                                backgroundColor:'#f8fafc'
                            }}>
                                <div style={{flex:1}}>
                                    <h4 style={{margin:'0 0 5px 0', fontSize:'0.95rem'}}>{j.unit}</h4>
                                    <p style={{margin:'5px 0', fontSize:'0.85rem', color:'#64748b'}}>
                                        👤 {j.peminjam}
                                    </p>
                                    <p style={{margin:'5px 0', fontSize:'0.85rem', color:'#64748b'}}>
                                        📅 {j.mulai} s/d {j.selesai}
                                    </p>
                                    <span style={{
                                        display:'inline-block',
                                        padding:'4px 8px',
                                        borderRadius:'4px',
                                        fontSize:'0.75rem',
                                        fontWeight:'600',
                                        backgroundColor: j.status === 'Dikonfirmasi' ? '#d1fae5' : '#fef3c7',
                                        color: j.status === 'Dikonfirmasi' ? '#065f46' : '#92400e'
                                    }}>
                                        {j.status}
                                    </span>
                                </div>
                                <div style={{display:'flex', gap:'8px', marginLeft:'10px'}}>
                                    <button 
                                        onClick={() => handleLihatDetail(j.id)}
                                        style={{
                                            padding:'8px 12px',
                                            backgroundColor:'#3b82f6',
                                            color:'white',
                                            border:'none',
                                            borderRadius:'4px',
                                            cursor:'pointer',
                                            fontSize:'0.8rem',
                                            fontWeight:'600'
                                        }}
                                    >
                                        Lihat
                                    </button>
                                    <button 
                                        onClick={() => handleBatalJadwal(j.id)}
                                        style={{
                                            padding:'8px 12px',
                                            backgroundColor:'#ef4444',
                                            color:'white',
                                            border:'none',
                                            borderRadius:'4px',
                                            cursor:'pointer',
                                            fontSize:'0.8rem',
                                            fontWeight:'600'
                                        }}
                                    >
                                        Batalkan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    
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
                    <Link key={unit.id} to={`/kendaraan/${unit.id}`} className="unit-card-new">
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
                    </Link>
                ))}
            </div>
        </div>
    );
  };

  // --- MODAL DETAIL JADWAL ---
  const ModalDetailJadwal = () => {
    if(!showDetailModal || !selectedJadwal) return null;
    
    const hariPeminjaman = Math.ceil((new Date(selectedJadwal.selesai) - new Date(selectedJadwal.mulai)) / (1000 * 60 * 60 * 24));
    const totalHarga = hariPeminjaman * selectedJadwal.harga_harian;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)'
        }}>
          {/* Header Modal */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #e2e8f0'}}>
            <h2 style={{margin: 0, fontSize: '1.3rem'}}>Detail Jadwal</h2>
            <button 
              onClick={handleCloseModal}
              style={{backgroundColor: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b'}}
            >
              ✕
            </button>
          </div>

          {/* Info Unit */}
          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderLeft: '4px solid #3b82f6', borderRadius: '4px'}}>
            <h3 style={{margin: '0 0 10px 0', color: '#1e3a8a'}}>{selectedJadwal.unit}</h3>
            <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#475569'}}>
              <strong>📍 Plat Nomor:</strong> {selectedJadwal.plat_nomor}
            </p>
            <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#475569'}}>
              <strong>💰 Harga/Hari:</strong> Rp {selectedJadwal.harga_harian.toLocaleString('id-ID')}
            </p>
          </div>

          {/* Info Peminjam */}
          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f5f3ff', borderLeft: '4px solid #8b5cf6', borderRadius: '4px'}}>
            <h4 style={{margin: '0 0 10px 0', color: '#4c1d95'}}>Informasi Peminjam</h4>
            <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#475569'}}>
              <strong>👤 Nama:</strong> {selectedJadwal.peminjam}
            </p>
            <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#475569'}}>
              <strong>📱 Kontak:</strong> {selectedJadwal.kontak}
            </p>
          </div>

          {/* Info Tanggal & Durasi */}
          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '4px'}}>
            <h4 style={{margin: '0 0 10px 0', color: '#78350f'}}>Periode Penyewaan</h4>
            <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#475569'}}>
              <strong>📅 Mulai:</strong> {selectedJadwal.mulai}
            </p>
            <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#475569'}}>
              <strong>📅 Selesai:</strong> {selectedJadwal.selesai}
            </p>
            <p style={{margin: '10px 0 5px 0', fontSize: '0.9rem', color: '#475569'}}>
              <strong>⏰ Durasi:</strong> {hariPeminjaman} hari
            </p>
          </div>

          {/* Perhitungan Harga */}
          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#e0f2fe', borderRadius: '8px'}}>
            <h4 style={{margin: '0 0 10px 0', color: '#0c4a6e'}}>Ringkasan Harga</h4>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem'}}>
              <span>Harga per hari × {hariPeminjaman} hari</span>
              <span>Rp {selectedJadwal.harga_harian.toLocaleString('id-ID')} × {hariPeminjaman}</span>
            </div>
            <div style={{borderTop: '1px solid #0284c7', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '600', color: '#0c4a6e'}}>
              <span>Total</span>
              <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Catatan */}
          {selectedJadwal.catatan && (
            <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#fecaca', borderLeft: '4px solid #ef4444', borderRadius: '4px'}}>
              <h4 style={{margin: '0 0 10px 0', color: '#7f1d1d'}}>Catatan</h4>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#475569'}}>{selectedJadwal.catatan}</p>
            </div>
          )}

          {/* Status Badge */}
          <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{fontSize: '0.85rem', color: '#64748b'}}>Status:</span>
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              backgroundColor: selectedJadwal.status === 'Dikonfirmasi' ? '#d1fae5' : '#fef3c7',
              color: selectedJadwal.status === 'Dikonfirmasi' ? '#065f46' : '#92400e'
            }}>
              {selectedJadwal.status}
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
            <button
              onClick={handleCloseModal}
              style={{
                padding: '10px 16px',
                backgroundColor: '#e2e8f0',
                color: '#334155',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              Tutup
            </button>
            {selectedJadwal.status === 'Pending' && (
              <button
                onClick={handleKonfirmasiJadwal}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                ✓ Konfirmasi
              </button>
            )}
          </div>
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

      {/* MODAL DETAIL JADWAL */}
      <ModalDetailJadwal />
    </div>
  );
}

export default DashboardPerental;