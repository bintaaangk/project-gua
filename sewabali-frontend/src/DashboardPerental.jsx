import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './DashboardPerental.css';

function DashboardPerental() {
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('unit');
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);

    const mobilScrollRef = useRef(null);
    const motorScrollRef = useRef(null);

    const scroll = (ref, direction) => {
        if (ref.current) {
            const { current } = ref;
            const scrollAmount = 160;
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    const userName = localStorage.getItem('userName') || "Perental";

    const fetchUnits = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/kendaraan/saya', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const dataMentah = response.data;
            const listMobil = dataMentah.mobil || [];
            const listMotor = dataMentah.motor || [];
            setUnits([...listMobil, ...listMotor]);
        } catch (error) {
            console.error("Gagal mengambil data unit:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const [newUnitData, setNewUnitData] = useState({
        nama: '', tipe: 'Mobil', plat: '', harga: '',
        transmisi: 'Manual', kapasitas: '4', no_rekening: '', jaminan: '',
        img: null, imgPreview: null
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

        if (!newUnitData.nama || !newUnitData.plat || !newUnitData.harga || !newUnitData.jaminan) {
            alert("Mohon lengkapi semua data termasuk Syarat Jaminan!");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('nama', newUnitData.nama);
        formData.append('tipe', newUnitData.tipe);
        formData.append('plat_nomor', newUnitData.plat);
        formData.append('harga_per_hari', parseInt(newUnitData.harga));
        formData.append('transmisi', newUnitData.transmisi);
        formData.append('kapasitas', newUnitData.kapasitas);
        formData.append('no_rekening', newUnitData.no_rekening);
        formData.append('jaminan', newUnitData.jaminan);

        if (newUnitData.img) {
            formData.append('gambar', newUnitData.img);
        }

        const token = localStorage.getItem('token');

        axios.post('http://localhost:8000/api/kendaraan', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setLoading(false);
                alert('✓ Unit berhasil ditambahkan!');
                setActiveView('unit');
                setNewUnitData({
                    nama: '', tipe: 'Mobil', plat: '', harga: '',
                    transmisi: 'Manual', kapasitas: '4', no_rekening: '', jaminan: '', img: null, imgPreview: null
                });
                fetchUnits();
            })
            .catch(error => {
                setLoading(false);
                console.error('Error:', error);
                alert('❌ Gagal menambahkan unit.');
            });
    };

    const handleLogout = () => {
        if (window.confirm("Logout?")) { localStorage.clear(); navigate('/login'); }
    };

    const handleDeleteUnit = async (id, namaUnit) => {
        if (!window.confirm(`Yakin ingin menghapus "${namaUnit}"?`)) return;
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/kendaraan/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUnits(units.filter(unit => unit.id !== id));
            alert('✓ Unit berhasil dihapus!');
        } catch (error) {
            console.error("Gagal menghapus unit:", error);
            alert('❌ Gagal menghapus unit.');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (activeView === 'tambah-unit') {
            return (
                <div className="form-container">
                    <div style={{ marginBottom: 15 }}>
                        <h3 style={{ margin: 0 }}>Tambah Unit Baru</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Isi detail kendaraanmu di sini.</p>
                    </div>

                    <form onSubmit={handleSubmitUnit} noValidate>
                        <div className="form-group">
                            <label>Foto Unit</label>
                            <div className="upload-area">
                                <input type="file" id="u-img" accept="image/*" onChange={handleImageUpload} hidden />
                                <label htmlFor="u-img" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {newUnitData.imgPreview ? <img src={newUnitData.imgPreview} className="upload-preview" alt="preview" /> : <span style={{ color: '#94a3b8' }}>📸 Ketuk untuk Upload</span>}
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nama Kendaraan</label>
                            <input className="input-modern" type="text" name="nama" value={newUnitData.nama} onChange={handleInputChange} placeholder="Contoh: Avanza Veloz" />
                        </div>

                        <div className="form-group">
                            <label>Syarat Dokumen Jaminan</label>
                            <textarea
                                className="input-modern"
                                name="jaminan"
                                value={newUnitData.jaminan}
                                onChange={handleInputChange}
                                placeholder="Sebutkan jaminan yang diperlukan"
                                rows="3"
                                style={{ resize: 'none', paddingTop: '10px' }}
                            />
                        </div>

                        <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                            <div className="form-col" style={{ flex: 1 }}>
                                <div className="form-group">
                                    <label>Plat Nomor</label>
                                    <input className="input-modern" type="text" name="plat" value={newUnitData.plat} onChange={handleInputChange} placeholder="DK 1234 XX" />
                                </div>
                            </div>
                            <div className="form-col" style={{ flex: 1 }}>
                                <div className="form-group">
                                    <label>Harga /Hari</label>
                                    <input className="input-modern" type="number" name="harga" value={newUnitData.harga} onChange={handleInputChange} placeholder="350000" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nomor Rekening</label>
                            <input className="input-modern" type="text" name="no_rekening" value={newUnitData.no_rekening} onChange={handleInputChange} placeholder="Cth: BCA 1234567890 a.n Budi" />
                        </div>

                        <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                            <div className="form-col" style={{ flex: 1 }}>
                                <div className="form-group">
                                    <label>Tipe Kendaraan</label>
                                    <select className="input-modern" name="tipe" value={newUnitData.tipe} onChange={handleInputChange}>
                                        <option value="Mobil">Mobil</option>
                                        <option value="Motor">Motor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-col" style={{ flex: 1 }}>
                                <div className="form-group">
                                    <label>Transmisi</label>
                                    <select className="input-modern" name="transmisi" value={newUnitData.transmisi} onChange={handleInputChange}>
                                        <option value="Manual">Manual</option>
                                        <option value="Matic">Matic</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-col" style={{ flex: 1 }}>
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

        const listMobil = units.filter(u => u.tipe?.toLowerCase() === 'mobil');
        const listMotor = units.filter(u => u.tipe?.toLowerCase() === 'motor');

        return (
            <div style={{ paddingBottom: '80px' }}>
                <div className="section-title-row">
                    <h3>Unit Tersedia ({units.length})</h3>
                    <button className="btn-text-action" onClick={() => setActiveView('tambah-unit')}>+ Tambah</button>
                </div>

                {/* --- SLIDER MOBIL --- */}
                {listMobil.length > 0 && (
                    <>
                        <div className="unit-section-title"><span>🚙 Mobil ({listMobil.length})</span></div>
                        <div className="slider-container">
                            <button className="scroll-btn left" onClick={() => scroll(mobilScrollRef, 'left')}>‹</button>
                            <div className="unit-scroll-row" ref={mobilScrollRef}>
                                {listMobil.map(unit => (
                                    <div key={unit.id} className="unit-card-new">
                                        <Link to={`/perental/kendaraan/${unit.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                            <div className="unit-img-top">
                                                <img src={unit.gambar_url} alt={unit.nama} onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }} />
                                                <span className="badge-avail" style={{ color: unit.status === 'Tersedia' ? '#059669' : '#DC2626' }}>{unit.status}</span>
                                            </div>
                                            <div className="unit-info-body">
                                                <div className="unit-name-row"><h4>{unit.nama}</h4><span className="plat-badge">{unit.plat_nomor}</span></div>
                                                <div className="price-row">Rp {unit.harga_per_hari.toLocaleString('id-ID')}<span>/hr</span></div>
                                            </div>
                                        </Link>
                                        <button className="btn-delete-overlay" onClick={(e) => { e.preventDefault(); handleDeleteUnit(unit.id, unit.nama); }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button className="scroll-btn right" onClick={() => scroll(mobilScrollRef, 'right')}>›</button>
                        </div>
                    </>
                )}

                {/* --- SLIDER MOTOR --- */}
                {listMotor.length > 0 && (
                    <>
                        <div className="unit-section-title" style={{ marginTop: '20px' }}><span>🏍️ Motor ({listMotor.length})</span></div>
                        <div className="slider-container">
                            <button className="scroll-btn left" onClick={() => scroll(motorScrollRef, 'left')}>‹</button>
                            <div className="unit-scroll-row" ref={motorScrollRef}>
                                {listMotor.map(unit => (
                                    <div key={unit.id} className="unit-card-new">
                                        <Link to={`/perental/kendaraan/${unit.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                            <div className="unit-img-top">
                                                <img src={unit.gambar_url} alt={unit.nama} onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }} />
                                                <span className="badge-avail" style={{ color: unit.status === 'Tersedia' ? '#059669' : '#DC2626' }}>{unit.status}</span>
                                            </div>
                                            <div className="unit-info-body">
                                                <div className="unit-name-row"><h4>{unit.nama}</h4><span className="plat-badge">{unit.plat_nomor}</span></div>
                                                <div className="price-row">Rp {unit.harga_per_hari.toLocaleString('id-ID')}<span>/hr</span></div>
                                            </div>
                                        </Link>
                                        <button className="btn-delete-overlay" onClick={(e) => { e.preventDefault(); handleDeleteUnit(unit.id, unit.nama); }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button className="scroll-btn right" onClick={() => scroll(motorScrollRef, 'right')}>›</button>
                        </div>
                    </>
                )}

                {units.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: 50, color: '#94a3b8' }}>
                        <p>Belum ada unit kendaraan.</p>
                    </div>
                )}
            </div>
        );
    };

    if (hasError) {
        return (
            <div style={{ padding: 40, color: 'red', background: '#fff0f0' }}>
                <h2>Terjadi Error</h2>
                <p>{errorMsg}</p>
                <button onClick={() => window.location.reload()}>Muat Ulang Halaman</button>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
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

            <div className="dashboard-content">
                {activeView === 'unit' && (
                    <div className="hero-banner">
                        <h2>Kelola Rentalmu 🚀</h2>
                        <p>Pantau performa unit dan pesanan secara real-time di sini.</p>
                    </div>
                )}

                <div className="menu-container">
                    <div className={`menu-card ${activeView === 'unit' ? 'active' : ''}`} onClick={() => setActiveView('unit')}>
                        <div className="icon-box blue">🚗</div>
                        <span className="menu-text">Unit Saya</span>
                    </div>
                    <div className="menu-card" onClick={() => navigate('/pesanan-masuk')}>
                        <div className="icon-box orange">📦</div>
                        <span className="menu-text">Pesanan</span>
                    </div>
                </div>

                {renderContent()}
            </div>

            <div className="nav-container-fixed">
                <nav className="bottom-nav-perental">
                    <button className={`nav-btn ${activeView === 'unit' ? 'active' : ''}`} onClick={() => setActiveView('unit')}>
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
        </div>
    );
}

export default DashboardPerental;