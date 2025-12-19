import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import './Login.css'; // Pastikan file CSS ada

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    
    // --- 1. CEK KHUSUS ADMIN (HARDCODED) ---
    // PERBAIKAN: Gunakan formData.email dan formData.password
    if (formData.email === 'admin@gmail.com' && formData.password === 'admin123') {
        // Simpan token dummy biar tidak ditendang oleh useEffect di halaman admin
        localStorage.setItem('token', 'admin-token-rahasia'); 
        localStorage.setItem('userRole', 'admin'); // PERBAIKAN: Konsisten pakai 'userRole'
        localStorage.setItem('userName', 'Super Admin');
        
        alert("Login Berhasil sebagai Admin! 🚀");
        setLoading(false);
        navigate('/admin-dashboard'); // Arahkan ke Dashboard Admin
        return; // Berhenti di sini, jangan lanjut ke API
    }

    // 2. CONFIG HEADER (Sangat Penting agar Laravel menerima request)
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    try {
      // 3. TEMBAK API LARAVEL
      // Pastikan backend Laravel sudah jalan (php artisan serve)
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData, config);
      
      // 4. AMBIL DATA DARI RESPONSE
      const { token, user } = response.data;
      
      console.log("Login Sukses:", user);

      // 5. SIMPAN TOKEN KE BROWSER (LocalStorage)
      // Ini kuncinya agar user dianggap "sedang login"
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role); // Pastikan backend kirim field 'role'
      localStorage.setItem('userName', user.name);

      // 6. REDIRECT SESUAI ROLE
      // Beri sedikit jeda biar user lihat tombol sukses sebentar
      setTimeout(() => {
        if (user.role === 'perental') {
            // Jika Perental -> Masuk Dashboard
            navigate('/perental/dashboard');
        } else {
            // Jika Penyewa -> Masuk Beranda
            navigate('/beranda'); 
        }
      }, 500);

    } catch (err) {
      console.error("Login Error:", err);
      
      // Tampilkan pesan error dari Backend jika ada
      if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message); // Misal: "Email atau Password salah"
      } else {
          setError('Gagal terhubung ke server. Cek koneksi internet/backend.');
      }
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
            {error && <div className="alert-message error">{error}</div>}

            <form onSubmit={handleSubmit}>
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