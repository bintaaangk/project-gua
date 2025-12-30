import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    // --- MAIN STATE DATA ---
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [docs, setDocs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- MODAL STATE ---
    const [modalType, setModalType] = useState(null); 
    const [selectedItem, setSelectedItem] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 
    const [note, setNote] = useState(''); 

    // --- 1. AMBIL DATA DARI DATABASE ---
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token'); 
            const headers = { Authorization: `Bearer ${token}` };

            const [resUsers, resVehicles, resDocs, resBookings] = await Promise.all([
                axios.get(`${API_BASE_URL}/admin/users`, { headers }),
                axios.get(`${API_BASE_URL}/admin/kendaraans`, { headers }),
                axios.get(`${API_BASE_URL}/admin/verifikasi-dokumen`, { headers }),
                axios.get(`${API_BASE_URL}/admin/transaksi`, { headers })
            ]);

            setUsers(resUsers.data);
            setVehicles(resVehicles.data);
            setDocs(resDocs.data);
            setBookings(resBookings.data);
        } catch (error) {
            console.error("Gagal sinkronisasi database:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS USER ---
    const handleAddUser = () => {
        setModalType('user');
        setIsEditing(false);
        setSelectedItem({ name: '', email: '', role: 'Penyewa', status: 'Aktif' });
    };

    const handleEditUser = (u) => {
        setModalType('user');
        setIsEditing(true);
        setSelectedItem(u);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/admin/users/save`, selectedItem, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Data user berhasil disimpan!");
            setModalType(null);
            fetchInitialData();
        } catch (err) {
            alert("Gagal menyimpan user");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Hapus pengguna ini secara permanen?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchInitialData();
            } catch (err) {
                alert("Gagal menghapus user");
            }
        }
    };

    // --- HANDLERS VERIFIKASI ---
    const openVerification = (doc) => {
        setModalType('verify');
        setSelectedItem(doc);
        setNote('');
    };

    const submitVerification = async (isValid) => {
        try {
            const token = localStorage.getItem('token');
            const status = isValid ? 'verified' : 'rejected';
            await axios.post(`${API_BASE_URL}/admin/verifikasi/${selectedItem.id}`, {
                status: status,
                catatan_verifikasi: note
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert(`Dokumen berhasil di-${status}`);
            fetchInitialData();
            setModalType(null);
        } catch (error) {
            alert("Gagal melakukan verifikasi");
        }
    };

    // --- HANDLERS TRANSAKSI ---
    const handleUpdateBookingStatus = async (id, newStatus) => {
        if(window.confirm(`Ubah status transaksi menjadi ${newStatus}?`)){
            try {
                const token = localStorage.getItem('token');
                await axios.post(`${API_BASE_URL}/admin/transaksi/${id}/status`, { status: newStatus }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchInitialData();
            } catch (err) {
                alert("Gagal update transaksi");
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm("Yakin ingin keluar?")) {
            localStorage.clear(); 
            navigate('/login');
        }
    };

    const renderStatus = (status) => {
        let color = 'green';
        const s = status?.toLowerCase();
        if (['pending', 'disewa', 'servis', 'menunggu bayar'].includes(s)) color = 'yellow';
        if (['diblokir', 'rejected', 'dibatalkan', 'invalid'].includes(s)) color = 'red';
        if (s === 'penyewa' || s === 'lunas') color = 'blue';
        if (s === 'perental') color = 'purple';
        return <span className={`badge ${color}`}>{status?.toUpperCase()}</span>;
    };

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
                                <div className="stat-info"><p>Transaksi Lunas</p><h3>{bookings.filter(b => b.status === 'Lunas').length}</h3></div>
                                <div className="stat-icon icon-purple">💳</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-info"><p>Perlu Verifikasi</p><h3>{docs.filter(d => d.status === 'pending').length}</h3></div>
                                <div className="stat-icon icon-purple">📑</div>
                            </div>
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
                                            <td>{renderStatus(u.status || 'Aktif')}</td>
                                            <td>
                                                <button className="btn-action" onClick={() => handleEditUser(u)}>Edit</button>
                                                <button className="btn-action danger" onClick={() => handleDeleteUser(u.id)}>Hapus</button>
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
                        <div className="card-header"><h3>Data Armada Kendaraan</h3></div>
                        <div className="table-responsive">
                            <table className="clean-table">
                                <thead><tr><th>Unit</th><th>Pemilik</th><th>Plat</th><th>Harga</th><th>Status</th></tr></thead>
                                <tbody>
                                    {vehicles.map(v => (
                                        <tr key={v.id}>
                                            <td><strong>{v.name}</strong></td>
                                            <td>{v.owner}</td>
                                            <td>{v.plat}</td>
                                            <td>Rp {v.price}</td>
                                            <td>{renderStatus(v.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'transaksi':
                return (
                    <div className="content-card">
                        <div className="card-header"><h3>Riwayat Transaksi</h3></div>
                        <div className="table-responsive">
                            <table className="clean-table">
                                <thead><tr><th>ID</th><th>Penyewa</th><th>Kendaraan</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.id}>
                                            <td>#{b.id}</td>
                                            <td>{b.user}</td>
                                            <td>{b.vehicle}</td>
                                            <td>Rp {b.total}</td>
                                            <td>{renderStatus(b.status)}</td>
                                            <td>
                                                {b.status === 'Menunggu Bayar' && (
                                                    <button className="btn-action check" onClick={() => handleUpdateBookingStatus(b.id, 'Lunas')}>Konfirmasi</button>
                                                )}
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
                        <div className="card-header"><h3>Antrean Verifikasi Dokumen</h3></div>
                        <div className="table-responsive">
                            <table className="clean-table">
                                <thead><tr><th>Penyewa</th><th>Status</th><th>Catatan</th><th>Aksi</th></tr></thead>
                                <tbody>
                                    {docs.map(d => (
                                        <tr key={d.id}>
                                            <td><strong>{d.user}</strong></td>
                                            <td>{renderStatus(d.status)}</td>
                                            <td>{d.note || '-'}</td>
                                            <td>
                                                {d.status === 'pending' ? (
                                                    <button className="btn-action check" onClick={() => openVerification(d)}>Periksa</button>
                                                ) : <span>Selesai</span>}
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

    if (loading) return <div className="loading-screen">Menghubungkan ke Database...</div>;

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="logo-area"><div className="logo-icon">S</div><span className="logo-text">SewaBali Admin</span></div>
                <div className="sidebar-menu">
                    {['dashboard', 'pengguna', 'kendaraan', 'transaksi', 'verifikasi'].map(menu => (
                        <div key={menu} className={`menu-item ${activeMenu === menu ? 'active' : ''}`} onClick={() => setActiveMenu(menu)}>
                            <span>{menu === 'dashboard' ? '📊' : menu === 'pengguna' ? '👥' : menu === 'kendaraan' ? '🚗' : menu === 'transaksi' ? '💳' : '📑'}</span>
                            {menu.charAt(0).toUpperCase() + menu.slice(1)}
                        </div>
                    ))}
                </div>
                <div className="logout-btn" onClick={handleLogout}>🚪 Keluar</div>
            </aside>

            <main className="main-content">
                <div className="header-wrapper">
                    <h1>{activeMenu.toUpperCase()}</h1>
                    <div className="admin-badge"><div className="badge-avatar">A</div><span>Superuser</span></div>
                </div>
                {renderContent()}
            </main>

            {/* MODAL FORM USER */}
            {modalType === 'user' && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <h2>{isEditing ? 'Edit User' : 'Tambah User'}</h2>
                        <form onSubmit={handleSaveUser}>
                            <input className="input-field" placeholder="Nama" value={selectedItem.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} required />
                            <input className="input-field" placeholder="Email" value={selectedItem.email} onChange={e => setSelectedItem({...selectedItem, email: e.target.value})} required />
                            <select className="input-field" value={selectedItem.role} onChange={e => setSelectedItem({...selectedItem, role: e.target.value})}>
                                <option value="Penyewa">Penyewa</option>
                                <option value="Perental">Perental</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalType(null)}>Batal</button>
                                <button type="submit" className="btn-action check">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL VERIFIKASI */}
            {modalType === 'verify' && selectedItem && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <h2>Verifikasi Dokumen</h2>
                        <img src={`http://127.0.0.1:8000/storage/${selectedItem.img}`} style={{width: '100%', borderRadius: 8}} alt="KTP" />
                        <textarea className="input-note" placeholder="Catatan penolakan..." value={note} onChange={e => setNote(e.target.value)} />
                        <div className="modal-footer">
                            <button onClick={() => setModalType(null)}>Batal</button>
                            <button className="btn-action danger" onClick={() => submitVerification(false)}>Tolak</button>
                            <button className="btn-action check" onClick={() => submitVerification(true)}>Terima</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;