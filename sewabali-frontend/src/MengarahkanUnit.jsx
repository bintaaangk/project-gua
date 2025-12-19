import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './MengarahkanUnit.css';

// --- DATA DUMMY (UNTUK PREVIEW DESAIN) ---
const DUMMY_UNITS = [
    {
        id: 1,
        nama: 'Toyota Avanza Zenix',
        tipe: 'Mobil',
        plat_nomor: 'DK 1234 AB',
        harga_per_hari: 350000,
        transmisi: 'Matic',
        kapasitas: 7,
        gambar_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500&q=80',
        status: 'Tersedia',
        lokasi: 'Kuta'
    },
    {
        id: 2,
        nama: 'Honda Brio RS',
        tipe: 'Mobil',
        plat_nomor: 'DK 5678 CD',
        harga_per_hari: 300000,
        transmisi: 'Manual',
        kapasitas: 5,
        gambar_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80',
        status: 'Disewa',
        lokasi: 'Ubud'
    },
    {
        id: 3,
        nama: 'Yamaha NMAX',
        tipe: 'Motor',
        plat_nomor: 'DK 9999 XX',
        harga_per_hari: 120000,
        transmisi: 'Matic',
        kapasitas: 2,
        gambar_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80',
        status: 'Tersedia',
        lokasi: 'Seminyak'
    },
    {
        id: 4,
        nama: 'Daihatsu Xenia',
        tipe: 'Mobil',
        plat_nomor: 'DK 2468 EF',
        harga_per_hari: 280000,
        transmisi: 'Manual',
        kapasitas: 7,
        gambar_url: 'https://images.unsplash.com/photo-1533473359331-35a81fc6f571?auto=format&fit=crop&w=500&q=80',
        status: 'Tersedia',
        lokasi: 'Denpasar'
    },
    {
        id: 5,
        nama: 'Honda Vario 150',
        tipe: 'Motor',
        plat_nomor: 'DK 3579 GH',
        harga_per_hari: 100000,
        transmisi: 'Matic',
        kapasitas: 2,
        gambar_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',
        status: 'Tersedia',
        lokasi: 'Canggu'
    }
];

function MengarahkanUnit() {
    const navigate = useNavigate();
    const [units, setUnits] = useState(DUMMY_UNITS);
    const [filteredUnits, setFilteredUnits] = useState(DUMMY_UNITS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('Semua');
    const [selectedStatus, setSelectedStatus] = useState('Semua');

    // Filter units berdasarkan pencarian dan filter
    useEffect(() => {
        let result = units;

        // Filter berdasarkan tipe
        if (selectedType !== 'Semua') {
            result = result.filter(unit => unit.tipe === selectedType);
        }

        // Filter berdasarkan status
        if (selectedStatus !== 'Semua') {
            result = result.filter(unit => unit.status === selectedStatus);
        }

        // Filter berdasarkan pencarian
        if (searchQuery.trim()) {
            result = result.filter(unit =>
                unit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                unit.plat_nomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                unit.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredUnits(result);
    }, [searchQuery, selectedType, selectedStatus, units]);

    const handleGoToDetail = (id) => {
        navigate(`/kendaraan/${id}`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const getStatusBadgeClass = (status) => {
        return status === 'Tersedia' ? 'status-tersedia' : 'status-disewa';
    };

    const getStatusLabel = (status) => {
        return status === 'Tersedia' ? '✓ Tersedia' : '✗ Disewa';
    };

    return (
        <div className="mengarahkan-unit-page">
            {/* Header */}
            <header className="mh-header">
                <button className="btn-back" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="header-title">Pilih Unit</h1>
                <div className="header-spacer"></div>
            </header>

            {/* Search Bar */}
            <div className="search-section">
                <div className="search-input-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari unit, plat, lokasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button
                            className="btn-clear-search"
                            onClick={() => setSearchQuery('')}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-section">
                <div className="filter-group">
                    <label>Tipe:</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="Semua">Semua</option>
                        <option value="Mobil">Mobil</option>
                        <option value="Motor">Motor</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Status:</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="Semua">Semua</option>
                        <option value="Tersedia">Tersedia</option>
                        <option value="Disewa">Disewa</option>
                    </select>
                </div>
            </div>

            {/* Unit List */}
            <div className="units-container">
                {filteredUnits.length > 0 ? (
                    <div className="units-grid">
                        {filteredUnits.map(unit => (
                            <div
                                key={unit.id}
                                className="unit-card"
                                onClick={() => handleGoToDetail(unit.id)}
                            >
                                {/* Gambar Unit */}
                                <div className="unit-image-wrapper">
                                    <img
                                        src={unit.gambar_url}
                                        alt={unit.nama}
                                        className="unit-image"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/300x200/e0e0e0/777?text=No+Image';
                                        }}
                                    />
                                    <div className={`status-badge ${getStatusBadgeClass(unit.status)}`}>
                                        {getStatusLabel(unit.status)}
                                    </div>
                                    <div className="type-badge">{unit.tipe}</div>
                                </div>

                                {/* Info Unit */}
                                <div className="unit-info">
                                    <h3 className="unit-name">{unit.nama}</h3>

                                    <div className="unit-specs">
                                        <span className="spec-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                            {unit.kapasitas} penumpang
                                        </span>
                                        <span className="spec-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                                            </svg>
                                            {unit.transmisi}
                                        </span>
                                    </div>

                                    <div className="unit-footer">
                                        <div className="unit-location">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            {unit.lokasi}
                                        </div>

                                        <div className="unit-price">
                                            <span className="price">
                                                Rp {unit.harga_per_hari.toLocaleString('id-ID')}
                                            </span>
                                            <span className="price-period">/hari</span>
                                        </div>
                                    </div>

                                    <div className="unit-plat">
                                        <span className="plat-badge">{unit.plat_nomor}</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button className="btn-pilih">
                                    Lihat Detail →
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <p className="empty-text">Tidak ada unit yang sesuai</p>
                        <p className="empty-subtext">Coba ubah filter atau pencarian Anda</p>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="units-footer-info">
                <p>Total: {filteredUnits.length} unit tersedia</p>
            </div>
        </div>
    );
}

export default MengarahkanUnit;
