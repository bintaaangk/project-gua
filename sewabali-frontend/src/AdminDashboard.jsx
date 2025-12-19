import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// --- DATA DUMMY AWAL ---
const USERS_DATA = [
    { id: 1, name: 'Budi Santoso', email: 'budi@gmail.com', role: 'Penyewa', status: 'Aktif' },
    { id: 2, name: 'Siti Aminah', email: 'siti@rental.com', role: 'Perental', status: 'Aktif' },
    { id: 3, name: 'Joko Anwar', email: 'joko@gmail.com', role: 'Penyewa', status: 'Diblokir' },
];

const VEHICLES_DATA = [
    { id: 1, name: 'Toyota Avanza Zenix', owner: 'Siti Aminah', plat: 'DK 1122 AB', status: 'Tersedia', price: '350.000' },
    { id: 2, name: 'Honda Brio RS', owner: 'Siti Aminah', plat: 'DK 3344 CC', status: 'Disewa', price: '300.000' },
    { id: 3, name: 'Yamaha NMAX', owner: 'Agus Rental', plat: 'DK 8899 ZZ', status: 'Servis', price: '120.000' },
];

const DOCS_DATA = [
    { id: 101, user: 'Budi Santoso', type: 'KTP', img: 'https://placehold.co/600x400/png?text=KTP+Budi', status: 'Pending', note: '' },
    { id: 102, user: 'Rina Nose', type: 'SIM A', img: 'https://placehold.co/600x400/png?text=SIM+Rina', status: 'Pending', note: '' },
    { id: 103, user: 'Doni Tata', type: 'KTP', img: 'https://placehold.co/600x400/png?text=KTP+Doni', status: 'Valid', note: '' },
];

// DATA DUMMY TRANSAKSI (BARU)
const BOOKINGS_DATA = [
    { id: 'TRX-001', user: 'Budi Santoso', vehicle: 'Toyota Avanza Zenix', dates: '10 Okt - 12 Okt', total: '700.000', status: 'Menunggu Bayar' },
    { id: 'TRX-002', user: 'Joko Anwar', vehicle: 'Honda Brio RS', dates: '11 Okt - 13 Okt', total: '600.000', status: 'Lunas' },
    { id: 'TRX-003', user: 'Rina Nose', vehicle: 'Yamaha NMAX', dates: '15 Okt - 16 Okt', total: '120.000', status: 'Selesai' },
];

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard'); // Default menu dashboard

    // --- MAIN STATE DATA ---
    const [users, setUsers] = useState(USERS_DATA);
    const [vehicles, setVehicles] = useState(VEHICLES_DATA);
    const [docs, setDocs] = useState(DOCS_DATA);
    const [bookings, setBookings] = useState(BOOKINGS_DATA); // State Transaksi Baru

    // --- MODAL STATE ---
    // Type: 'user', 'vehicle', 'vehicleDetail', 'verify', null
    const [modalType, setModalType] = useState(null); 
    const [selectedItem, setSelectedItem] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 
    const [note, setNote] = useState(''); 

    // --- HANDLERS UMUM ---
    const handleLogout = () => {
        if (window.confirm("Yakin ingin keluar?")) {
            // localStorage.clear(); 
            navigate('/login');
        }
    };

    // --- LOGIC USER (PENGGUNA) ---
    const handleAddUser = () => {
        setModalType('user');
        setIsEditing(false);
        setSelectedItem({ name: '', email: '', role: 'Penyewa', status: 'Aktif' });
    };

    const handleEditUser = (user) => {
        setModalType('user');
        setIsEditing(true);
        setSelectedItem({ ...user });
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Hapus pengguna ini secara permanen?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const saveUser = (e) => {
        e.preventDefault();
        if (isEditing) {
            setUsers(users.map(u => u.id === selectedItem.id ? selectedItem : u));
        } else {
            setUsers([...users, { ...selectedItem, id: Date.now() }]);
        }
        setModalType(null);
    };

    // --- LOGIC KENDARAAN (ARMADA) ---
    const handleAddVehicle = () => {
        setModalType('vehicle');
        setIsEditing(false);
        setSelectedItem({ name: '', owner: '', plat: '', price: '', status: 'Tersedia' });
    };

    const handleEditVehicle = (vehicle) => {
        setModalType('vehicle');
        setIsEditing(true);
        setSelectedItem({ ...vehicle });
    };

    const handleDetailVehicle = (vehicle) => {
        setSelectedItem(vehicle);     
        setModalType('vehicleDetail'); // Membuka detail
    };

    const saveVehicle = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Logic Update
            setVehicles(vehicles.map(v => v.id === selectedItem.id ? selectedItem : v));
        } else {
            // Logic Add Baru
            setVehicles([...vehicles, { ...selectedItem, id: Date.now() }]);
        }
        setModalType(null);
    };

    const handleDeleteVehicle = (id) => {
        if (window.confirm("Hapus kendaraan ini?")) {
            setVehicles(vehicles.filter(v => v.id !== id));
        }
    };

    // --- LOGIC VERIFIKASI ---
    const openVerification = (doc) => {
        setModalType('verify');
        setSelectedItem(doc);
        setNote('');
    };

    const submitVerification = (isValid) => {
        const updatedDocs = docs.map(d =>
            d.id === selectedItem.id ? { ...d, status: isValid ? 'Valid' : 'Invalid', note: isValid ? '' : note } : d
        );
        setDocs(updatedDocs);
        setModalType(null);
    };

    // --- LOGIC TRANSAKSI (BARU) ---
    const handleUpdateBookingStatus = (id, newStatus) => {
        if(window.confirm(`Ubah status transaksi menjadi ${newStatus}?`)){
            setBookings(bookings.map(b => b.id === id ? {...b, status: newStatus} : b));
        }
    };

    // --- HELPER RENDER BADGE ---
    const renderStatus = (status) => {
        let color = 'green';
        if (['Pending', 'Disewa', 'Servis', 'Menunggu Bayar'].includes(status)) color = 'yellow';
        if (['Diblokir', 'Invalid', 'Dibatalkan'].includes(status)) color = 'red';
        if (status === 'Penyewa') color = 'blue';
        if (status === 'Perental') color = 'purple';
        // Status Transaksi
        if (status === 'Lunas') color = 'blue';
        if (status === 'Selesai') color = 'green';

        return <span className={`badge ${color}`}>{status}</span>;
    };

    // --- RENDER CONTENT ---
    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return (
                    <div>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-info"><p>Total Pengguna</p><h3>{users.length}</h3></div>
                                <div className="stat-icon icon-blue">👥</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-info"><p>Total Armada</p><h3>{vehicles.length}</h3></div>
                                <div className="stat-icon icon-green">🚗</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-info"><p>Transaksi Aktif</p><h3>{bookings.filter(b => b.status === 'Lunas').length}</h3></div>
                                <div className="stat-icon icon-purple">💳</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-info"><p>Perlu Verifikasi</p><h3>{docs.filter(d => d.status === 'Pending').length}</h3></div>
                                <div className="stat-icon icon-purple">📑</div>
                            </div>
                        </div>
                        <div className="content-card" style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                            <p>Selamat datang di Panel Admin SewaBali.</p>
                        </div>
                    </div>
                );

            case 'pengguna':
                return (
                    <div className="content-card">
                        <div className="card-header">
                            <h3>Manajemen Pengguna</h3>
                            <button className="btn-primary" onClick={handleAddUser}>+ Tambah User</button>
                        </div>
                        <div className="table-responsive">
                            <table className="clean-table">
                                <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.email}</td>
                                            <td>{renderStatus(u.role)}</td>
                                            <td>{renderStatus(u.status)}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button className="btn-action" onClick={() => handleEditUser(u)}>Edit</button>
                                                    <button className="btn-action danger" onClick={() => handleDeleteUser(u.id)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'kendaraan':
                return (
                    <div className="content-card">
                        <div className="card-header">
                            <h3>Data Kendaraan</h3>
                            <button className="btn-primary" onClick={handleAddVehicle}>+ Tambah Unit</button>
                        </div>
                        <div className="table-responsive">
                            <table className="clean-table">
                                <thead><tr><th>Unit</th><th>Pemilik</th><th>Plat</th><th>Harga/Hari</th><th>Status</th><th>Aksi</th></tr></thead>
                                <tbody>
                                    {vehicles.map(v => (
                                        <tr key={v.id}>
                                            <td><strong>{v.name}</strong></td>
                                            <td>{v.owner}</td>
                                            <td>{v.plat}</td>
                                            <td style={{ fontWeight: 'bold', color: '#2563EB' }}>{v.price}</td>
                                            <td>{renderStatus(v.status)}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button className="btn-action" onClick={() => handleEditVehicle(v)}>Edit</button>
                                                    <button className="btn-action" onClick={() => handleDetailVehicle(v)}>Detail</button>
                                                    <button className="btn-action danger" onClick={() => handleDeleteVehicle(v.id)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            // FITUR BARU: HALAMAN TRANSAKSI
            case 'transaksi':
                return (
                    <div className="content-card">
                        <div className="card-header">
                            <h3>Daftar Transaksi</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="clean-table">
                                <thead><tr><th>ID</th><th>Penyewa</th><th>Kendaraan</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.id}>
                                            <td><span style={{fontFamily:'monospace', color:'#64748B'}}>{b.id}</span></td>
                                            <td><strong>{b.user}</strong></td>
                                            <td>{b.vehicle}</td>
                                            <td>{b.dates}</td>
                                            <td style={{fontWeight:'bold'}}>Rp {b.total}</td>
                                            <td>{renderStatus(b.status)}</td>
                                            <td>
                                                <div className="table-actions">
                                                    {b.status === 'Menunggu Bayar' && (
                                                        <button className="btn-action check" onClick={() => handleUpdateBookingStatus(b.id, 'Lunas')}>Konfirmasi Bayar</button>
                                                    )}
                                                    {b.status === 'Lunas' && (
                                                        <button className="btn-action check" onClick={() => handleUpdateBookingStatus(b.id, 'Selesai')}>Selesaikan</button>
                                                    )}
                                                    {b.status === 'Selesai' && (
                                                        <span style={{fontSize:'0.8rem', color:'#64748B'}}>Arsip</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'verifikasi':
                return (
                    <div className="content-card">
                        <div className="card-header">
                            <h3>Verifikasi Dokumen</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="clean-table">
                                <thead><tr><th>Penyewa</th><th>Dokumen</th><th>Status</th><th>Catatan</th><th>Aksi</th></tr></thead>
                                <tbody>
                                    {docs.map(d => (
                                        <tr key={d.id}>
                                            <td><strong>{d.user}</strong></td>
                                            <td>{d.type}</td>
                                            <td>{renderStatus(d.status)}</td>
                                            <td style={{ color: '#64748B', fontStyle: 'italic' }}>{d.note || '-'}</td>
                                            <td>
                                                {d.status === 'Pending' ? (
                                                    <button className="btn-action check" onClick={() => openVerification(d)}>Periksa</button>
                                                ) : <span style={{ color: '#16A34A', fontSize: '0.8rem', fontWeight: 'bold' }}>Selesai</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="logo-area">
                    <div className="logo-icon">S</div>
                    <span className="logo-text">SewaBali Admin</span>
                </div>

                <div className="sidebar-menu">
                    {/* Tambahkan 'transaksi' ke menu */}
                    {['dashboard', 'pengguna', 'kendaraan', 'transaksi', 'verifikasi'].map(menu => (
                        <div key={menu} className={`menu-item ${activeMenu === menu ? 'active' : ''}`} onClick={() => setActiveMenu(menu)}>
                            <span className="menu-icon">
                                {menu === 'dashboard' ? '📊' : 
                                 menu === 'pengguna' ? '👥' : 
                                 menu === 'kendaraan' ? '🚗' : 
                                 menu === 'transaksi' ? '💳' : '📑'}
                            </span>
                            {menu.charAt(0).toUpperCase() + menu.slice(1)}
                        </div>
                    ))}
                </div>

                <div className="logout-btn" onClick={handleLogout}>
                    <span>🚪</span> Keluar
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                <div className="header-wrapper">
                    <div className="page-title">
                        <h1>{activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}</h1>
                        <p>Kelola sistem rental dengan mudah.</p>
                    </div>
                    <div className="admin-badge">
                        <div className="badge-avatar">A</div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Superuser</span>
                    </div>
                </div>

                {renderContent()}
            </main>

            {/* --- GLOBAL MODAL --- */}
            {modalType && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        
                        {/* MODAL FORM USER */}
                        {modalType === 'user' && (
                            <form onSubmit={saveUser}>
                                <h2>{isEditing ? 'Edit User' : 'Tambah User Baru'}</h2>
                                <div className="form-group">
                                    <label>Nama Lengkap</label>
                                    <input type="text" required value={selectedItem.name} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" required value={selectedItem.email} onChange={(e) => setSelectedItem({ ...selectedItem, email: e.target.value })} className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select value={selectedItem.role} onChange={(e) => setSelectedItem({ ...selectedItem, role: e.target.value })} className="input-field">
                                        <option value="Penyewa">Penyewa</option>
                                        <option value="Perental">Perental</option>
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-action" onClick={() => setModalType(null)}>Batal</button>
                                    <button type="submit" className="btn-action check">Simpan</button>
                                </div>
                            </form>
                        )}

                        {/* MODAL FORM KENDARAAN (Sekarang support EDIT) */}
                        {modalType === 'vehicle' && (
                            <form onSubmit={saveVehicle}>
                                {/* 4. UPDATE: Judul Dinamis */}
                                <h2>{isEditing ? 'Edit Kendaraan' : 'Tambah Kendaraan'}</h2>
                                <div className="form-group">
                                    <label>Nama Unit</label>
                                    <input type="text" required value={selectedItem.name} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} className="input-field" placeholder="Cth: Toyota Avanza" />
                                </div>
                                <div className="form-group">
                                    <label>Pemilik</label>
                                    <input type="text" required value={selectedItem.owner} onChange={(e) => setSelectedItem({ ...selectedItem, owner: e.target.value })} className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>Plat Nomor</label>
                                    <input type="text" required value={selectedItem.plat} onChange={(e) => setSelectedItem({ ...selectedItem, plat: e.target.value })} className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>Harga Sewa (Rp)</label>
                                    <input type="text" required value={selectedItem.price} onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })} className="input-field" />
                                </div>
                                {/* Tambahan: Edit Status jika sedang Mode Edit */}
                                {isEditing && (
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select value={selectedItem.status} onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })} className="input-field">
                                            <option value="Tersedia">Tersedia</option>
                                            <option value="Disewa">Disewa</option>
                                            <option value="Servis">Servis</option>
                                        </select>
                                    </div>
                                )}
                                <div className="modal-footer">
                                    <button type="button" className="btn-action" onClick={() => setModalType(null)}>Batal</button>
                                    <button type="submit" className="btn-action check">Simpan</button>
                                </div>
                            </form>
                        )}

                        {/* MODAL DETAIL KENDARAAN */}
                        {modalType === 'vehicleDetail' && selectedItem && (
                            <div className="detail-modal-content">
                                <div className="detail-header">
                                    <h3>Detail Kendaraan</h3>
                                    <p className="detail-subtitle">Informasi lengkap unit rental</p>
                                </div>

                                <div className="unit-title-section">
                                    <span className="label-sm">Nama Unit</span>
                                    <h2 className="unit-name">{selectedItem.name}</h2>
                                </div>

                                <div className="detail-grid">
                                    {/* Pemilik */}
                                    <div className="detail-item">
                                        <div className="label-with-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            <span>Pemilik</span>
                                        </div>
                                        <p className="value-text">{selectedItem.owner}</p>
                                    </div>

                                    {/* Plat Nomor */}
                                    <div className="detail-item">
                                        <div className="label-with-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                            <span>Plat Nomor</span>
                                        </div>
                                        <div className="plat-badge">{selectedItem.plat}</div>
                                    </div>

                                    {/* Harga */}
                                    <div className="detail-item">
                                        <div className="label-with-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                                            <span>Harga Sewa</span>
                                        </div>
                                        <p className="value-price">Rp {selectedItem.price} <span className="per-day">/ hari</span></p>
                                    </div>

                                    {/* Status */}
                                    <div className="detail-item">
                                        <div className="label-with-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                            <span>Status Saat Ini</span>
                                        </div>
                                        <div style={{marginTop: '4px'}}>
                                            {renderStatus(selectedItem.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer-full">
                                    <button className="btn-primary full-width" onClick={() => setModalType(null)}>
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* MODAL VERIFIKASI */}
                        {modalType === 'verify' && (
                            <div>
                                <h2 style={{ margin: '0 0 10px 0' }}>Cek {selectedItem.type}</h2>
                                <p style={{ margin: 0, color: '#64748B' }}>Pengirim: {selectedItem.user}</p>

                                <img src={selectedItem.img} className="doc-img" alt="Bukti" style={{ width: '100%', borderRadius: 8, marginTop: 10, marginBottom: 10 }} />

                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Catatan (Jika Ditolak)</label>
                                <textarea className="input-note" rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Alasan penolakan..." style={{ width: '100%', padding: 8 }} />

                                <div className="modal-footer" style={{ marginTop: 20 }}>
                                    <button className="btn-action" onClick={() => setModalType(null)}>Batal</button>
                                    <button className="btn-action danger" onClick={() => submitVerification(false)}>Tolak</button>
                                    <button className="btn-action check" onClick={() => submitVerification(true)}>Terima Valid</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;