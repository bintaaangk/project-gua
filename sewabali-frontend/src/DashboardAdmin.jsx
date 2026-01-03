import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Tambahkan ini untuk navigasi
import './DashboardAdmin.css';

function DashboardAdmin() {
    // 1. STATE UNTUK DATA
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [report, setReport] = useState([]);
    const [stats, setStats] = useState({ 
        total_users: 0, 
        total_vehicles: 0, 
        total_transactions: 0, 
        total_revenue: 0 
    });

    // 2. STATE UNTUK UI
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('users'); 
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [animate, setAnimate] = useState(false);

    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // Inisialisasi navigasi

    // 3. FUNGSI AMBIL DATA
    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' 
            };

            const [resUsers, resVehicles, resStats, resTrans, resReport] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/admin/users/pending', { headers }),
                axios.get('http://127.0.0.1:8000/api/admin/vehicles', { headers }),
                axios.get('http://127.0.0.1:8000/api/admin/stats', { headers }),
                axios.get('http://127.0.0.1:8000/api/admin/transactions', { headers }),
                axios.get('http://127.0.0.1:8000/api/admin/revenue-report', { headers })
            ]);

            setUsers(resUsers.data);
            setVehicles(resVehicles.data);
            setStats(resStats.data);
            setTransactions(resTrans.data);
            setReport(resReport.data);

        } catch (err) {
            console.error("Gagal mengambil data admin:", err.response?.data || err.message);
            // Jika token tidak valid, arahkan ke login
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
            setAnimate(true);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Proteksi halaman jika tidak ada token
        } else {
            fetchData();
        }
    }, [token]);

    // Handle perpindahan tab dengan animasi
    const switchTab = (tabName) => {
        setAnimate(false);
        setTimeout(() => {
            setTab(tabName);
            setAnimate(true);
        }, 50);
    };

    // 4. HANDLERS
    const handleApproveUser = async (id) => {
        if (!window.confirm("Verifikasi user ini?")) return;
        try {
            await axios.post(`http://127.0.0.1:8000/api/admin/users/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("User berhasil diverifikasi!");
            fetchData();
        } catch (err) { alert("Gagal verifikasi"); }
    };

  // GANTI FUNGSI handleToggleVehicle LAMA DENGAN INI:
    const handleDeleteVehicle = async (id, name) => {
        // Konfirmasi keamanan biar gak kepencet
        const confirmDelete = window.confirm(`⚠️ PERINGATAN ADMIN ⚠️\n\nApakah Anda yakin ingin MENGHAPUS PERMANEN unit "${name}"?\nUnit akan hilang dari halaman Perental dan Penyewa.`);
        
        if (!confirmDelete) return;

        try {
            // Panggil route delete yang baru kita buat
            await axios.delete(`http://127.0.0.1:8000/api/admin/vehicles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Unit berhasil dihapus.");
            fetchData(true); // Refresh data tabel otomatis
        } catch (err) { 
            console.error(err);
            alert("Gagal menghapus unit."); 
        }
    };

    const handleVerifyPayment = async (id, status) => {
        if (!window.confirm(`Konfirmasi pembayaran ${status}?`)) return;
        try {
            await axios.post(`http://127.0.0.1:8000/api/admin/transactions/verify/${id}`, 
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Berhasil di-${status}`);
            fetchData();
        } catch (err) { alert("Gagal proses pembayaran"); }
    };

    // FUNGSI KELUAR (LOGOUT)
    const handleLogout = () => {
        if (window.confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem('token'); // Hapus token dari storage
            localStorage.removeItem('role');  // Hapus role jika ada
            navigate('/login'); // Kembali ke halaman login
        }
    };

    if (loading) return (
        <div className="admin-loading-screen">
            <div className="spinner"></div>
            <p>Menyiapkan Dashboard Strategis...</p>
        </div>
    );

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="admin-sidebar fade-in-left">
                <div className="sidebar-logo">
                    <h2>Sewa<span>Bali</span></h2>
                </div>
                <nav className="sidebar-menu">
                    <button className={tab === 'users' ? 'active' : ''} onClick={() => switchTab('users')}>
                         Pengguna
                    </button>
                    <button className={tab === 'vehicles' ? 'active' : ''} onClick={() => switchTab('vehicles')}>
                         Daftar Unit
                    </button>
                    <button className={tab === 'trans' ? 'active' : ''} onClick={() => switchTab('trans')}>
                         Transaksi
                    </button>
                    <button className={tab === 'report' ? 'active' : ''} onClick={() => switchTab('report')}>
                         Laporan Omzet
                    </button>
                </nav>
                <div className="sidebar-bottom">
                    {/* HUBUNGKAN FUNGSI LOGOUT DISINI */}
                    <button className="logout-btn" onClick={handleLogout}>Keluar</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-main-content">
                <header className="main-header fade-in">
                    <div className="header-titles">
                        <h1>Panel Pengawas</h1>
                        <p>Monitoring sistem SewaBali.id</p>
                    </div>
                </header>

                <section className="stats-container">
                    {[
                        { label: 'Total User', val: stats.total_users },
                        { label: 'Unit Tersedia', val: stats.total_vehicles },
                        { label: 'Total Transaksi', val: stats.total_transactions },
                        { label: 'Total Omzet', val: `Rp ${Number(stats.total_revenue).toLocaleString('id-ID')}`, class: 'blue' }
                    ].map((s, i) => (
                        <div key={i} className={`stat-box slide-up ${s.class || ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
                            <label>{s.label}</label>
                            <h3>{s.val}</h3>
                        </div>
                    ))}
                </section>

                <div className={`content-card ${animate ? 'tab-animate-in' : 'tab-animate-out'}`}>
                    {tab === 'users' && (
                        <div className="table-wrapper">
                            <div className="table-header">
                                <h2>Verifikasi User Baru</h2>
                            </div>
                            {users.length === 0 ? <p className="empty-state">Belum ada user menunggu verifikasi.</p> : (
                                <table className="minimal-table">
                                    <thead>
                                        <tr><th>Nama</th><th>Email</th><th>Telepon</th><th>Aksi</th></tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.name}</td><td>{u.email}</td><td>{u.nomor_telepon}</td>
                                                <td><button className="action-btn verify" onClick={() => handleApproveUser(u.id)}>Verifikasi</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {tab === 'vehicles' && (
                        <div className="table-wrapper">
                            <div className="table-header">
                                <h2>Monitoring Unit</h2>
                            </div>
                            <table className="minimal-table">
                                <thead>
                                    <tr><th>Unit</th><th>Pemilik</th><th>Status</th><th>Aksi</th></tr>
                                </thead>
                                <tbody>
                                    {vehicles.map(v => (
                                        <tr key={v.id}>
                                            <td><strong>{v.nama}</strong><br/><span>{v.plat_nomor}</span></td>
                                            <td>{v.user?.name}</td>
                                            <td><span className={`status-tag ${v.status?.toLowerCase()}`}>{v.status}</span></td>
                                          <td>
                            <button 
                                className="action-btn reject-sm" 
                                onClick={() => handleDeleteVehicle(v.id, v.nama)}
                                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                            >
                                Hapus Unit
                            </button>
                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {tab === 'trans' && (
                        <div className="table-wrapper">
                            <div className="table-header">
                                <h2>Transaksi Berjalan</h2>
                            </div>
                            <table className="minimal-table">
                                <thead>
                                    <tr><th>Penyewa</th><th>Unit</th><th>Total</th><th>Bukti</th><th>Aksi</th></tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t.id}>
                                            <td>{t.user?.name}</td><td>{t.kendaraan?.nama}</td>
                                            <td>Rp {Number(t.total_harga).toLocaleString('id-ID')}</td>
                                            <td>
                                                {t.bukti_transfer ? (
                                                    <button className="btn-icon-animate" onClick={() => {
                                                        setSelectedImage(`http://127.0.0.1:8000/storage/${t.bukti_transfer}`);
                                                        setShowModal(true);
                                                    }}>👁️ Lihat</button>
                                                ) : <span className="no-data">Belum Bayar</span>}
                                            </td>
                                            <td>
                                                {t.status === 'menunggu_verifikasi' ? (
                                                    <div className="flex-btns">
                                                        <button className="action-btn verify-sm pulse" onClick={() => handleVerifyPayment(t.id, 'disetujui')}>Setuju</button>
                                                        <button className="action-btn reject-sm" onClick={() => handleVerifyPayment(t.id, 'ditolak')}>Tolak</button>
                                                    </div>
                                                ) : <span className={`status-tag ${t.status?.toLowerCase()}`}>{t.status?.replace('_', ' ')}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {tab === 'report' && (
                        <div className="table-wrapper">
                            <div className="table-header">
                                <h2>Laporan Omzet Bulanan</h2>
                            </div>
                            <table className="minimal-table">
                                <thead>
                                    <tr><th>Bulan</th><th>Jumlah Pesanan</th><th>Total Pendapatan</th></tr>
                                </thead>
                                <tbody>
                                    {report.length === 0 ? <tr><td colSpan="3" className="empty-state">Belum ada data.</td></tr> : 
                                     report.map((item, index) => (
                                        <tr key={index}>
                                            <td><strong>{item.bulan}</strong></td>
                                            <td>{item.jumlah_transaksi} Transaksi</td>
                                            <td className="revenue-text">Rp {Number(item.total).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL ANIMASI */}
            {showModal && (
                <div className="modal-overlay modal-fade-in" onClick={() => setShowModal(false)}>
                    <div className="modal-content modal-zoom-in" onClick={e => e.stopPropagation()}>
                        <button className="close-x" onClick={() => setShowModal(false)}>&times;</button>
                        <img src={selectedImage} alt="Bukti Transfer" className="img-animated" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardAdmin;