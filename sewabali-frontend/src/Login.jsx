import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    role: 'penyewa' // Default role untuk UI
  }); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Config header agar Laravel mengenali request sebagai JSON
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    try {
      // 1. TEMBAK API LARAVEL
      // Data yang dikirim: email, password, dan role
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData, config);
      
      // 2. AMBIL DATA DARI RESPONSE
      const { token, user } = response.data;
      
      console.log("Login Sukses:", user);

      // 3. SIMPAN DATA KE LOCALSTORAGE
      // Gunakan nama key yang konsisten agar DashboardAdmin bisa membacanya
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role); 
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userId', user.id);

      // 4. REDIRECT BERDASARKAN ROLE DARI DATABASE
      // Ini jauh lebih aman daripada hardcoded di frontend
      if (user.role === 'admin') {
          alert("Login Berhasil sebagai Admin! 🛡️");
          navigate('/admin/dashboard'); 
      } else if (user.role === 'perental') {
          alert(`Selamat Datang Perental, ${user.name}! 🚗`);
          navigate('/perental/dashboard');
      } else {
          alert(`Selamat Datang, ${user.name}! ✨`);
          navigate('/beranda'); 
      }

    } catch (err) {
      console.error("Login Error:", err);
      
      // Ambil pesan error spesifik dari Laravel (misal: "Email atau Password salah")
      if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
      } else {
          setError('Gagal terhubung ke server. Pastikan Backend (Laravel) sudah jalan.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-page-container login-bg">
      <header className="login-header">
        <Link to="/" className="btn-back-transparent">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
      </header>

      <div className="login-content">
        <div className="login-branding">
            <h1 className="brand-title">SewaBali.id</h1>
            <p className="brand-subtitle">Masuk untuk mulai petualangan Anda di Bali.</p>
        </div>

        <div className="login-card">
            <h2 className="card-heading">Selamat Datang Kembali! 👋</h2>
            
            {/* Tampilkan Error jika ada */}
            {error && (
              <div className="alert-message error" style={{ 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                padding: '10px', 
                borderRadius: '8px', 
                marginBottom: '15px',
                fontSize: '0.9rem',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* PILIHAN ROLE - Admin tidak perlu ada di sini karena dideteksi otomatis dari email */}
                <div className="input-field">
                    <label>Login Sebagai</label>
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange}
                        className="input-modern"
                        style={{
                          width: '100%', 
                          padding: '12px', 
                          borderRadius: '8px', 
                          border: '1px solid #ddd', 
                          fontSize: '1rem',
                          appearance: 'none',
                          backgroundColor: 'white'
                        }}
                    >
                        <option value="penyewa">Penyewa (Cari Kendaraan)</option>
                        <option value="perental">Perental (Kelola Kendaraan)</option>
                    </select>
                </div>

                <div className="input-field">
                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="email@contoh.com" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="input-field">
                    <label>Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="••••••••" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <button type="submit" className="btn-login-full" disabled={loading}>
                    {loading ? 'Memproses...' : 'Masuk Sekarang'}
                </button>
            </form>

            <p className="register-link">
                Belum punya akun? <Link to="/register">Daftar Sekarang</Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Login;