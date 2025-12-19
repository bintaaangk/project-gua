import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

// --- IMPORT PETA (LEAFLET) ---
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- DATA WILAYAH BALI ---
const DATA_BALI = {
    "Denpasar": ["Denpasar Selatan", "Denpasar Barat", "Denpasar Timur", "Denpasar Utara"],
    "Badung": ["Kuta", "Kuta Utara", "Kuta Selatan", "Mengwi", "Abiansemal", "Petang"],
    "Gianyar": ["Ubud", "Gianyar", "Sukawati", "Blahbatuh", "Tampaksiring", "Tegallalang", "Payangan"],
    "Tabanan": ["Tabanan", "Kediri", "Kerambitan", "Selemadeg", "Pupuan", "Baturiti"],
    "Buleleng": ["Singaraja", "Sawan", "Seririt", "Banjar", "Sukasada"],
    "Bangli": ["Bangli", "Kintamani", "Susut", "Tembuku"],
    "Karangasem": ["Karangasem", "Manggis", "Rendang", "Selat", "Abang"],
    "Klungkung": ["Klungkung", "Nusa Penida", "Banjarangkan", "Dawan"],
    "Jembrana": ["Negara", "Melaya", "Mendoyo", "Pekutatan"]
};

function LocationMarker({ setPosition }) {
    useMapEvents({
        click(e) { setPosition(e.latlng); },
    });
    return null;
}

function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 16);
    }, [center, map]);
    return null;
}

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', nomor_telepon: '', role: 'penyewa', password: '', password_confirmation: '',
    });

    // State Alamat
    const [jalan, setJalan] = useState('');
    const [kabupaten, setKabupaten] = useState('');
    const [kecamatan, setKecamatan] = useState('');
    const [listKecamatan, setListKecamatan] = useState([]);
    
    // State Peta
    const [mapPosition, setMapPosition] = useState({ lat: -8.650000, lng: 115.216667 });

    // State Autocomplete
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // State Status
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    // UBAHAN: State Error dibuat Object agar bisa spesifik per kolom
    const [errors, setErrors] = useState({}); 

    useEffect(() => {
        const timer = setTimeout(() => {
            if (jalan && jalan.length > 3 && showSuggestions) {
                fetchSuggestions(jalan);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [jalan, showSuggestions]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Hapus error saat user mengetik ulang
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleKabupatenChange = (e) => {
        const val = e.target.value;
        setKabupaten(val);
        setKecamatan('');
        if (val && DATA_BALI[val]) {
            setListKecamatan(DATA_BALI[val]);
        } else {
            setListKecamatan([]);
        }
    };

    const fetchSuggestions = async (query) => {
        setIsSearching(true);
        try {
            const searchQuery = `${query}, Bali`; 
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: { q: searchQuery, format: 'json', addressdetails: 1, limit: 5 }
            });
            setSuggestions(response.data);
        } catch (error) {
            console.error("Gagal mengambil saran lokasi:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSuggestion = (item) => {
        const newLat = parseFloat(item.lat);
        const newLng = parseFloat(item.lon);
        setMapPosition({ lat: newLat, lng: newLng });
        const placeName = item.address.amenity || item.address.building || item.address.shop || item.display_name.split(',')[0];
        setJalan(item.display_name);
        setShowSuggestions(false);
    };

    const handleInputJalanChange = (e) => {
        setJalan(e.target.value);
        setShowSuggestions(true);
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role: role });
        setErrors({}); // Reset error saat ganti role
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrors({}); // Reset semua error
        setLoading(true);

        // Validasi Frontend Sederhana
        let tempErrors = {};
        if (formData.password !== formData.password_confirmation) {
            tempErrors.password_confirmation = 'Konfirmasi password tidak cocok.';
        }
        if (!jalan || !kabupaten || !kecamatan) {
            tempErrors.alamat = 'Mohon lengkapi detail alamat.';
        }

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            setLoading(false);
            return;
        }

        const googleMapsLink = `https://www.google.com/maps?q=${mapPosition.lat},${mapPosition.lng}`;
        const alamatLengkap = `${jalan}, Kec. ${kecamatan}, Kab. ${kabupaten}, Bali. (Titik: ${googleMapsLink})`;

        const dataToSubmit = { ...formData, alamat: alamatLengkap };

        try {
            const config = { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } };
            
            // Kirim ke Laravel
            await axios.post('http://127.0.0.1:8000/api/register', dataToSubmit, config);
            
            setMessage("Registrasi Berhasil! Silakan Login.");
            setTimeout(() => { navigate('/login'); }, 1500);

        } catch (err) {
            console.error("Register Error:", err.response);
            
            if (err.response && err.response.data && err.response.data.errors) {
                // Laravel mengembalikan error dalam bentuk object, misal: { email: ["Email sudah dipakai"], nomor_telepon: ["No HP dipakai"] }
                // Kita set ke state errors agar muncul di bawah input masing-masing
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Registrasi gagal. Cek koneksi backend.' });
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper untuk menampilkan pesan error di bawah input
    const renderError = (field) => {
        if (errors[field]) {
            return <span className="error-text" style={{color: 'red', fontSize: '0.75rem', marginTop: '5px', display: 'block'}}>
                {errors[field][0] || errors[field]} {/* Ambil pesan pertama array error Laravel */}
            </span>;
        }
        return null;
    };

    return (
        <div className="mobile-page-container register-bg">
            <header className="register-header">
                <Link to="/" className="btn-back-transparent">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                </Link>
            </header>
            
            <div className="register-content">
                <div className="register-branding">
                    <h1 className="brand-title">Buat Akun</h1>
                    <p className="brand-subtitle">Daftar sebagai Penyewa atau Perental</p>
                </div>

                <div className="register-card">
                    {message && <div className="alert-message success">{message}</div>}
                    {errors.general && <div className="alert-message error">{errors.general}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <label>Nama Lengkap</label>
                            <input type="text" name="name" placeholder="Nama Anda" value={formData.name} onChange={handleChange} required />
                            {renderError('name')}
                        </div>

                        <div className="input-field">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="email@contoh.com" value={formData.email} onChange={handleChange} required />
                            {/* ERROR EMAIL AKAN MUNCUL DISINI JIKA SUDAH TERDAFTAR DI ROLE YG SAMA */}
                            {renderError('email')}
                        </div>

                        <div className="input-field">
                            <label>Nomor Telepon</label>
                            <input type="tel" name="nomor_telepon" placeholder="08..." value={formData.nomor_telepon} onChange={handleChange} required />
                            {/* ERROR NO TELP AKAN MUNCUL DISINI */}
                            {renderError('nomor_telepon')}
                        </div>

                        {/* --- BAGIAN ALAMAT --- */}
                        <div className="address-section" style={{marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                            <label style={{fontWeight: 'bold', color: '#333', marginBottom: '12px', display:'block', fontSize:'1rem'}}>Lokasi Usaha / Rumah</label>
                            
                            <div className="input-field" style={{marginBottom: '10px'}}>
                                <select value={kabupaten} onChange={handleKabupatenChange} required style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background:'white'}}>
                                    <option value="">-- Pilih Kabupaten --</option>
                                    {Object.keys(DATA_BALI).map((kab) => (<option key={kab} value={kab}>{kab}</option>))}
                                </select>
                            </div>

                            <div className="input-field" style={{marginBottom: '10px'}}>
                                <select value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} required disabled={!kabupaten} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: !kabupaten ? '#e9ecef' : 'white'}}>
                                    <option value="">-- Pilih Kecamatan --</option>
                                    {listKecamatan.map((kec) => (<option key={kec} value={kec}>{kec}</option>))}
                                </select>
                            </div>

                            <div className="input-field autocomplete-wrapper" style={{marginBottom: '5px', position:'relative'}}>
                                <label style={{fontSize:'0.85rem'}}>Cari Lokasi (Ketik Nama Usaha / Jalan)</label>
                                <input type="text" placeholder="Cth: Bintang Makmur / Jl. Karya Makmur" value={jalan} onChange={handleInputJalanChange} required autoComplete="off" />
                                {isSearching && <span style={{fontSize:'0.7rem', color:'#666', position:'absolute', right:'10px', top:'38px'}}>Mencari...</span>}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="suggestions-list">
                                        {suggestions.map((item, index) => (
                                            <div key={index} className="suggestion-item" onClick={() => handleSelectSuggestion(item)}>
                                                <span style={{fontSize:'1.2rem'}}>📍</span>
                                                <div style={{display:'flex', flexDirection:'column'}}>
                                                    <span style={{fontWeight:'bold'}}>{item.address.amenity || item.address.building || item.address.shop || item.display_name.split(',')[0]}</span>
                                                    <span style={{fontSize:'0.75rem', color:'#666'}}>{item.display_name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p style={{fontSize: '0.7rem', color: '#f59e0b', marginBottom: '15px', fontStyle: 'italic'}}>*Tips: Jika nama usaha tidak muncul, ketik <b>Nama Jalan</b> lalu geser pin peta secara manual.</p>
                            {renderError('alamat')}

                            <div className="map-container" style={{height: '220px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e2e8f0'}}>
                                <MapContainer center={mapPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <ChangeView center={mapPosition} /> 
                                    <TileLayer attribution='© OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={mapPosition} />
                                    <LocationMarker setPosition={setMapPosition} />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="role-section">
                            <label className="field-label">Daftar Sebagai:</label>
                            <div className="role-cards">
                                <div className={`role-card ${formData.role === 'penyewa' ? 'active' : ''}`} onClick={() => handleRoleSelect('penyewa')}>
                                    <span className="role-icon">👤</span><span>Penyewa</span>
                                </div>
                                <div className={`role-card ${formData.role === 'perental' ? 'active' : ''}`} onClick={() => handleRoleSelect('perental')}>
                                    <span className="role-icon">🔑</span><span>Perental</span>
                                </div>
                            </div>
                        </div>

                        <div className="input-field">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="input-field">
                            <label>Konfirmasi Password</label>
                            <input type="password" name="password_confirmation" placeholder="••••••••" value={formData.password_confirmation} onChange={handleChange} required />
                            {renderError('password_confirmation')}
                        </div>

                        <button type="submit" className="btn-register-full" disabled={loading}>{loading ? 'Memproses...' : 'Daftar Sekarang'}</button>
                    </form>
                    <p className="login-link">Sudah punya akun? <Link to="/login">Masuk</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;