import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

// Mengimpor file CSS yang sama dengan Register
import './Register.css'; 

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // LOGIKA LOGIN ANDA AKAN ADA DI SINI NANTI
      // Pada aplikasi nyata, Anda akan memanggil POST /api/login di sini
      console.log('Login data:', formData);
      setMessage('Login berhasil! Mengarahkan ke Beranda...');
      
      setTimeout(() => {
        navigate('/beranda'); // Redirect ke Beranda setelah login sukses
      }, 1500);

    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="register-page-container"> 
      {/* Tombol kembali ke Landing Page */}
      <Link to="/" className="back-arrow-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="white"/>
        </svg>
      </Link>
      
      <div className="register-form-wrapper"> 
        <h1 className="register-logo">SewaBali.id</h1>
        <div className="register-card">
              <h2>Login</h2> 

              {message && <div className="register-message success">{message}</div>}
              {error && <div className="register-message error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email/Username</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                    <input type="checkbox" name="remember" style={{ marginRight: '5px' }} />
                    Ingat saya
                  </label>
                  <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>Lupa Password?</a>
                </div>

                <button type="submit" className="daftar-btn">Login</button>
              </form>
              
              <p className="login-link-text">
                Belum punya akun? <Link to="/register">Daftar disini</Link>
              </p>
            </div>
          </div>
        </div>
      );
    }

export default Login;
