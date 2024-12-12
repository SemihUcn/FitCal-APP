// src/components/Header.js
import React from 'react';
import fitcalImage from '../assets/ana_giris_foto.jpg';

const Header = () => (
  <div style={{
    width: '100%',
    padding: '15px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
  }}>
    <img src={fitcalImage} alt="FitCal Logo" style={{ width: '40px', height: '40px', marginRight: '15px' }} />
    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>FITCAL</h1>
  </div>
);

export default Header;