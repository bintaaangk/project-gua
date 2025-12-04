import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Mengimpor file CSS yang sama untuk Login dan Register
import './Register.css'; 

function Register() {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nomor_telepon: '',
    alamat: '',
    password: '',
    password_confirmation: '',
    role: 'penyewa', // Default role untuk radio button
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    // Menangani input teks dan radio button (role)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);
      
      // 1. Tampilkan pesan sukses
      setMessage(response.data.message + " Anda akan diarahkan ke Login...");

      // 2. Kosongkan form
      setFormData({
        name: '', email: '', nomor_telepon: '', alamat: '', password: '', password_confirmation: '', role: 'penyewa'
      });

      // 3. Pindah ke halaman /login setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000); 

    } catch (err) {
      if (err.response && err.response.data.errors) {
        // Tampilkan error validasi dari Laravel
        const errorMessages = Object.values(err.response.data.errors).map(e => e.join(', ')).join(' \n');
        setError(errorMessages);
      } else {
        // Tampilkan error umum
        setError('Registrasi gagal. Silakan coba lagi. ' + (err.message || ''));
      }
    }
  };

  return (
    <div className="register-page-container"> 
      <Link to="/" className="back-arrow-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="white"/>
        </svg>
      </Link>
      
      <div className="register-form-wrapper"> 
        <h1 className="register-logo">SewaBali.id</h1>
        <div className="register-card">
              <h2>Registrasi</h2>

              {message && <div className="register-message success">{message}</div>}
              {error && <div className="register-message error" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
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
                  <label htmlFor="nomor_telepon">Nomor Telepon/wa</label>
                  <input
                    type="text"
                    id="nomor_telepon"
                    name="nomor_telepon"
                    value={formData.nomor_telepon}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="alamat">Alamat</label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Input Role */}
                <div className="form-group role-group">
                  <label>Saya mendaftar sebagai:</label>
                  <div className="role-options">
                    <label>
                      <input 
                        type="radio" 
                        name="role" 
                        value="penyewa" 
                        checked={formData.role === 'penyewa'}
                        onChange={handleChange} 
                      />
                      Penyewa (Saya ingin menyewa)
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="role" 
                        value="perental" 
                        checked={formData.role === 'perental'}
                        onChange={handleChange} 
                      />
                      Perental (Saya ingin merentalkan)
                    </label>
                  </div>
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
                <div className="form-group">
                  <label htmlFor="password_confirmation">Konfirmasi Password</label>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button type="submit" className="daftar-btn">Daftar</button>
              </form>
              <p className="login-link-text">Sudah punya akun? <Link to="/login">Login disini</Link></p>
            </div>
          </div>
        </div>
      );
    }

export default Register;