import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './VerifikasiBayar.css';

function VerifikasiBayar() {
  const [buktiBayarList, setBuktiBayarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBukti, setSelectedBukti] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [verifying, setVerifying] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBuktiBayar();
  }, []);

  const fetchBuktiBayar = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bukti-bayar', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBuktiBayarList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bukti bayar:', error);
      setLoading(false);
    }
  };

  const handleVerify = async (buktiId) => {
    if (!window.confirm('Verifikasi bukti pembayaran ini?')) return;
    
    setVerifying(true);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/bukti-bayar/${buktiId}/verify`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      alert('Bukti pembayaran berhasil diverifikasi!');
      setSelectedBukti(null);
      fetchBuktiBayar();
    } catch (error) {
      alert('Gagal verifikasi: ' + (error.response?.data?.error || error.message));
    } finally {
      setVerifying(false);
    }
  };

  const handleReject = async (buktiId) => {
    if (!rejectReason.trim()) {
      alert('Mohon isi alasan penolakan');
      return;
    }
    
    if (!window.confirm('Tolak bukti pembayaran ini?')) return;

    setVerifying(true);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/bukti-bayar/${buktiId}/reject`,
        { catatan: rejectReason },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      alert('Bukti pembayaran ditolak!');
      setSelectedBukti(null);
      setRejectReason('');
      fetchBuktiBayar();
    } catch (error) {
      alert('Gagal tolak: ' + (error.response?.data?.error || error.message));
    } finally {
      setVerifying(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: '#FFA500',
      verified: '#4CAF50',
      rejected: '#f44336'
    };
    const labels = {
      pending: 'Menunggu',
      verified: 'Diverifikasi',
      rejected: 'Ditolak'
    };
    return (
      <span className="status-badge" style={{ backgroundColor: colors[status] }}>
        {labels[status]}
      </span>
    );
  };

  if (loading) return <div className="loading-screen">Memuat data...</div>;

  const pendingBukti = buktiBayarList.filter(b => b.status === 'pending');
  const verifiedBukti = buktiBayarList.filter(b => b.status === 'verified');
  const rejectedBukti = buktiBayarList.filter(b => b.status === 'rejected');

  return (
    <div className="mobile-page-container">
      {/* Header */}
      <header className="page-header">
        <Link to="/dashboard-perental" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <span className="header-title">Verifikasi Pembayaran</span>
        <div style={{width: 40}}></div>
      </header>

      {/* Scroll Content */}
      <div className="scroll-content">
        {/* Pending Section */}
        <div className="verification-section">
          <h3 className="section-title">
            Menunggu Verifikasi ({pendingBukti.length})
          </h3>
          
          {pendingBukti.length === 0 ? (
            <p className="no-data">Tidak ada bukti pembayaran menunggu</p>
          ) : (
            pendingBukti.map(bukti => (
              <div key={bukti.id} className="bukti-card pending">
                <div className="bukti-header">
                  <div className="bukti-info">
                    <p className="penyewa-name">
                      {bukti.pemesanan?.penyewa?.nama || 'Penyewa'}
                    </p>
                    <p className="bukti-date">
                      {new Date(bukti.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {getStatusBadge(bukti.status)}
                </div>

                <div className="bukti-detail">
                  <p><strong>Pemesanan:</strong> #{bukti.id_pemesanan}</p>
                  <p><strong>Kendaraan:</strong> {bukti.pemesanan?.kendaraan?.nama}</p>
                  <p><strong>Total:</strong> Rp {bukti.pemesanan?.total_harga?.toLocaleString('id-ID')}</p>
                </div>

                <button 
                  className="btn-lihat-bukti"
                  onClick={() => setSelectedBukti(bukti)}
                >
                  Lihat Bukti
                </button>
              </div>
            ))
          )}
        </div>

        {/* Verified Section */}
        {verifiedBukti.length > 0 && (
          <div className="verification-section">
            <h3 className="section-title">Terverifikasi ({verifiedBukti.length})</h3>
            {verifiedBukti.map(bukti => (
              <div key={bukti.id} className="bukti-card verified">
                <div className="bukti-header">
                  <div className="bukti-info">
                    <p className="penyewa-name">{bukti.pemesanan?.penyewa?.nama}</p>
                    <p className="bukti-date">
                      {new Date(bukti.tanggal_verifikasi).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {getStatusBadge(bukti.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejected Section */}
        {rejectedBukti.length > 0 && (
          <div className="verification-section">
            <h3 className="section-title">Ditolak ({rejectedBukti.length})</h3>
            {rejectedBukti.map(bukti => (
              <div key={bukti.id} className="bukti-card rejected">
                <div className="bukti-header">
                  <div className="bukti-info">
                    <p className="penyewa-name">{bukti.pemesanan?.penyewa?.nama}</p>
                    <p className="bukti-date">
                      {new Date(bukti.tanggal_verifikasi).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {getStatusBadge(bukti.status)}
                </div>
                {bukti.catatan && (
                  <p className="rejection-reason"><strong>Alasan:</strong> {bukti.catatan}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Bukti */}
      {selectedBukti && (
        <div className="modal-overlay" onClick={() => setSelectedBukti(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Bukti Pembayaran</h3>
              <button className="btn-close" onClick={() => setSelectedBukti(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="bukti-preview">
                <p className="preview-label">Foto Bukti Transfer:</p>
                <img 
                  src={`http://127.0.0.1:8000/storage/${selectedBukti.path_bukti}`} 
                  alt="Bukti" 
                  className="preview-image"
                />
              </div>

              <div className="bukti-info-detail">
                <p><strong>Penyewa:</strong> {selectedBukti.pemesanan?.penyewa?.nama}</p>
                <p><strong>No. HP:</strong> {selectedBukti.pemesanan?.penyewa?.no_hp}</p>
                <p><strong>Total Pembayaran:</strong> Rp {selectedBukti.pemesanan?.total_harga?.toLocaleString('id-ID')}</p>
                <p><strong>Upload pada:</strong> {new Date(selectedBukti.created_at).toLocaleString('id-ID')}</p>
              </div>

              {selectedBukti.status === 'pending' && (
                <div className="modal-actions">
                  <button 
                    className="btn-verify"
                    onClick={() => handleVerify(selectedBukti.id)}
                    disabled={verifying}
                  >
                    {verifying ? 'Memproses...' : '✓ Verifikasi'}
                  </button>
                  
                  <div className="rejection-form">
                    <textarea
                      className="reject-input"
                      placeholder="Alasan penolakan (jika ditolak)..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button 
                      className="btn-reject"
                      onClick={() => handleReject(selectedBukti.id)}
                      disabled={verifying}
                    >
                      {verifying ? 'Memproses...' : '✕ Tolak'}
                    </button>
                  </div>
                </div>
              )}

              {selectedBukti.status === 'rejected' && (
                <div className="rejection-info">
                  <p><strong>Alasan Penolakan:</strong></p>
                  <p className="catatan">{selectedBukti.catatan}</p>
                </div>
              )}

              {selectedBukti.status === 'verified' && (
                <div className="verified-info">
                  <p className="verified-text">✓ Pembayaran telah diverifikasi</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifikasiBayar;
