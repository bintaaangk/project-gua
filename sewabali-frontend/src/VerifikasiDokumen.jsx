import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifikasiDokumen.css';

function VerifikasiDokumen() {
  const navigate = useNavigate();
  const [dokumenList, setDokumenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDokumen, setSelectedDokumen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchDokumen();
  }, []);

  const fetchDokumen = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/dokumen-verifikasi', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setDokumenList(response.data);
    } catch (error) {
      console.error('Gagal fetch dokumen:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDokumen = (dokumen) => {
    setSelectedDokumen(dokumen);
    setShowModal(true);
    setRejectReason('');
  };

  const handleVerify = async (dokumenId) => {
    setProcessingId(dokumenId);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/dokumen-verifikasi/${dokumenId}/verify`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Refresh data
      await fetchDokumen();
      setShowModal(false);
      setSelectedDokumen(null);
      alert('Dokumen berhasil diverifikasi!');
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memverifikasi dokumen');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (dokumenId) => {
    if (!rejectReason.trim()) {
      alert('Mohon berikan alasan penolakan');
      return;
    }

    setProcessingId(dokumenId);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/dokumen-verifikasi/${dokumenId}/reject`, 
        { catatan: rejectReason },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      // Refresh data
      await fetchDokumen();
      setShowModal(false);
      setSelectedDokumen(null);
      setRejectReason('');
      alert('Dokumen ditolak dan penyewa telah diberitahu');
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menolak dokumen');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="badge-pending">⏳ Menunggu</span>;
    if (status === 'verified') return <span className="badge-verified">✅ Disetujui</span>;
    if (status === 'rejected') return <span className="badge-rejected">❌ Ditolak</span>;
  };

  if (loading) {
    return (
      <div className="mobile-page-container loading-state">
        <div className="spinner"></div>
        <p>Memuat dokumen...</p>
      </div>
    );
  }

  return (
    <div className="mobile-page-container">
      {/* Header Sticky */}
      <header className="page-header">
        <Link to="/dashboard-perental" className="btn-back-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <span className="header-title">Verifikasi Dokumen</span>
        <div style={{width: 40}}></div>
      </header>

      {/* Konten Scrollable */}
      <div className="scroll-content">
        
        {dokumenList.length > 0 ? (
          <div className="dokumen-list">
            {dokumenList.map((dokumen) => (
              <div key={dokumen.id_dokumen} className="dokumen-card">
                <div className="card-header">
                  <div className="card-info">
                    <h4>{dokumen.penyewa?.name || 'Penyewa'}</h4>
                    <p className="card-email">{dokumen.penyewa?.email}</p>
                  </div>
                  {getStatusBadge(dokumen.status)}
                </div>

                <div className="card-body">
                  <p className="card-desc">Dokumen verifikasi dari penyewa</p>
                  
                  <div className="dokumen-files">
                    {dokumen.path_ktp && (
                      <a href={`http://127.0.0.1:8000/storage/${dokumen.path_ktp}`} target="_blank" rel="noopener noreferrer" className="file-link">
                        📄 KTP
                      </a>
                    )}
                    {dokumen.path_sim_c && (
                      <a href={`http://127.0.0.1:8000/storage/${dokumen.path_sim_c}`} target="_blank" rel="noopener noreferrer" className="file-link">
                        📄 SIM C
                      </a>
                    )}
                    {dokumen.path_jaminan && (
                      <a href={`http://127.0.0.1:8000/storage/${dokumen.path_jaminan}`} target="_blank" rel="noopener noreferrer" className="file-link">
                        📄 Jaminan
                      </a>
                    )}
                    {dokumen.path_bukti_transfer && (
                      <a href={`http://127.0.0.1:8000/storage/${dokumen.path_bukti_transfer}`} target="_blank" rel="noopener noreferrer" className="file-link">
                        📄 Bukti Transfer
                      </a>
                    )}
                  </div>
                </div>

                {dokumen.status === 'pending' && (
                  <div className="card-actions">
                    <button 
                      className="btn-lihat-detail"
                      onClick={() => handleOpenDokumen(dokumen)}
                    >
                      Lihat Detail
                    </button>
                  </div>
                )}

                {dokumen.status === 'verified' && (
                  <div className="card-verified-badge">✅ Sudah Diverifikasi</div>
                )}

                {dokumen.status === 'rejected' && (
                  <div className="card-rejected-info">
                    <p className="rejected-label">❌ Alasan Penolakan:</p>
                    <p className="rejected-reason">{dokumen.catatan_verifikasi}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration">📭</div>
            <h3>Belum ada dokumen</h3>
            <p>Semua dokumen penyewa akan muncul di sini</p>
          </div>
        )}

        <div style={{height: 50}}></div>
      </div>

      {/* Modal Detail & Action */}
      {showModal && selectedDokumen && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verifikasi Dokumen</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="dokumen-info">
                <p><strong>Nama Penyewa:</strong> {selectedDokumen.penyewa?.name}</p>
                <p><strong>Email:</strong> {selectedDokumen.penyewa?.email}</p>
                <p><strong>No. Telepon:</strong> {selectedDokumen.penyewa?.nomor_telepon}</p>
              </div>

              <div className="dokumen-preview">
                <h4>Dokumen yang Diunggah:</h4>
                <div className="preview-files">
                  {selectedDokumen.path_ktp && (
                    <a href={`http://127.0.0.1:8000/storage/${selectedDokumen.path_ktp}`} target="_blank" rel="noopener noreferrer" className="preview-file">
                      <span>📄</span> KTP
                    </a>
                  )}
                  {selectedDokumen.path_sim_c && (
                    <a href={`http://127.0.0.1:8000/storage/${selectedDokumen.path_sim_c}`} target="_blank" rel="noopener noreferrer" className="preview-file">
                      <span>📄</span> SIM C
                    </a>
                  )}
                  {selectedDokumen.path_jaminan && (
                    <a href={`http://127.0.0.1:8000/storage/${selectedDokumen.path_jaminan}`} target="_blank" rel="noopener noreferrer" className="preview-file">
                      <span>📄</span> Jaminan
                    </a>
                  )}
                  {selectedDokumen.path_bukti_transfer && (
                    <a href={`http://127.0.0.1:8000/storage/${selectedDokumen.path_bukti_transfer}`} target="_blank" rel="noopener noreferrer" className="preview-file">
                      <span>📄</span> Bukti Transfer
                    </a>
                  )}
                </div>
              </div>

              <div className="reject-reason-form">
                <label>Jika ditolak, berikan alasan:</label>
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Dokumen kurang jelas, mohon upload ulang dengan foto yang lebih baik"
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-reject"
                onClick={() => handleReject(selectedDokumen.id_dokumen)}
                disabled={processingId === selectedDokumen.id_dokumen}
              >
                {processingId === selectedDokumen.id_dokumen ? 'Memproses...' : 'Tolak'}
              </button>
              <button 
                className="btn-approve"
                onClick={() => handleVerify(selectedDokumen.id_dokumen)}
                disabled={processingId === selectedDokumen.id_dokumen}
              >
                {processingId === selectedDokumen.id_dokumen ? 'Memproses...' : 'Setujui'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifikasiDokumen;
