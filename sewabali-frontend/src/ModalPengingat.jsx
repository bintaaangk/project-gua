import React from 'react';
import './ModalPengingat.css';

function ModalPengingat({ show, onClose, data }) {
  if (!show || !data) return null;

  const isKembali = data.tipe === 'kembali';

  return (
    <div className="modal-overlay">
      <div className={`modal-content-alert ${isKembali ? 'warning-theme' : ''}`}>
        <span className="icon-alarm">{isKembali ? '⚠️' : '🔔'}</span>
        <div className="modal-header-alert">
          <h3>{isKembali ? 'Pengembalian Unit' : 'Pengambilan Unit'}</h3>
        </div>
        <div className="modal-body-alert">
          <p>{data.pesan}</p>
 
<div className="unit-info-box">
  {/* Menggunakan Optional Chaining (?.) agar tidak error jika data.detail null */}
  <strong>{data.detail?.unit || 'Unit Tidak Diketahui'}</strong>
  <span>{data.detail?.plat || 'Tanpa Plat'}</span>
  
  {/* Menampilkan jam atau batas tanggal */}
  {(data.detail?.jam || data.detail?.batas) && (
    <p className="jam-kembali">
      Batas: {data.detail.jam || data.detail.batas}
    </p>
  )}
</div>
        </div>
        <button className="btn-paham" onClick={onClose}>
          Saya Mengerti
        </button>
      </div>
    </div>
  );
}
export default ModalPengingat;