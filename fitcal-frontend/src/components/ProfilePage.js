// ProfilePage.js


import React, { useState, useEffect } from 'react';
import axios from 'axios';



const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch profile data from the server
    axios.get('http://localhost:5000/api/profile/1') // Replace '1' with dynamic user ID if needed
      .then(response => {
        setProfileData(response.data);
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'Hesap Detayları':
        return (
          <div style={styles.detailsContainer}>
            <h3 style={styles.sectionTitle}>Hesap Detayları</h3>
            {profileData ? (
              <>
                <p style={styles.detail}><strong>Email:</strong> {profileData.email}</p>
                <p style={styles.detail}><strong>İsim Soyisim:</strong> {profileData.full_name}</p>
                <p style={styles.detail}><strong>Boy:</strong> {profileData.height} cm</p>
                <p style={styles.detail}><strong>Kilo:</strong> {profileData.weight} kg</p>
                <p style={styles.detail}><strong>Cinsiyet:</strong> {profileData.gender}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        );
      case 'Benim Kilom':
        return (
          <div style={styles.weightContainer}>
            <h3 style={styles.sectionTitle}>Mevcut Ağırlığın</h3>
            <div style={styles.weightCard}>
              <h1 style={styles.currentWeight}>84,0 kg</h1>
              <p style={styles.weighingInfo}>En son Tartılma - 886 gün önce</p>
              <div style={styles.goalInfo}>
                <p><strong>Başlangıç ağırlığı:</strong> 84,0 kg</p>
                <p><strong>Hedef ağırlık:</strong> 74,0 kg</p>
              </div>
              <div style={styles.progressInfo}>
                <p><strong>Bugüne kadar kayıp:</strong> 0 kg</p>
                <p><strong>Geriye kalan:</strong> 10 kg</p>
              </div>
            </div>
            <div style={styles.chartPlaceholder}>Burada ağırlık değişimi grafiği olacak.</div>
          </div>
        );
      case 'Günlük Ayarları':
        return (
          <div style={styles.settingsContainer}>
            <h3 style={styles.sectionTitle}>Günlük Ayarları</h3>
            <div style={styles.settingItem}><strong>Enerji Birimi:</strong> Kalori</div>
            <div style={styles.settingItem}><strong>Ağırlık Birimi:</strong> Kilogram</div>
            <div style={styles.settingItem}><strong>TGD:</strong> 2900 kal</div>
            <div style={styles.settingItem}><strong>Öğünleri Özelleştir:</strong> <span role="img" aria-label="lock">🔒</span></div>
            <div style={styles.settingItem}><strong>Rozet Bildirimleri:</strong> ✅</div>
            <div style={styles.settingItem}><strong>Seri Gösterimi:</strong> ✅</div>
            <div style={styles.settingItem}><strong>Su İçme Takipçisi:</strong> <span role="img" aria-label="lock">🔒</span></div>
            <div style={styles.settingItem}><strong>Egzersiz Günlüğü:</strong> ✅</div>
            <div style={styles.settingItem}><strong>Uygulamalar & Cihazlar:</strong> fatsecret (Varsayılan)</div>
            <div style={styles.settingItem}><strong>Sağlık App:</strong> Verilerinizi Sağlık ile paylaş</div>
          </div>
        );
      default:
        return <p style={styles.infoText}>Bir seçenek seçiniz.</p>;
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.subHeader}>Profil</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.menuButton} onClick={() => setActiveSection('Hesap Detayları')}>Hesap Detayları</button>
        <button style={styles.menuButton} onClick={() => setActiveSection('Benim Kilom')}>Benim Kilom</button>
        <button style={styles.menuButton} onClick={() => setActiveSection('Genel Ayarlar')}>Genel Ayarlar</button>
        <button style={styles.menuButton} onClick={() => setActiveSection('Topluluk Ayarları')}>Topluluk Ayarları</button>
        <button style={styles.menuButton} onClick={() => setActiveSection('Günlük Ayarları')}>Günlük Ayarları</button>
      </div>
      <div style={styles.contentContainer}>{renderSection()}</div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    textAlign: 'left',
  },
  subHeader: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '20px',
    marginLeft: '20px',
    marginTop: '60px',
  },
  buttonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginLeft: '20px',
  },
  menuButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '15px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s',
    flex: '1 0 auto',
  },
  menuButtonHover: {
    backgroundColor: '#0056b3',
  },
  contentContainer: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    marginLeft: '20px',
  },
  detailsContainer: {
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '15px',
  },
  detail: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '10px',
  },
  infoText: {
    fontSize: '16px',
    color: '#777',
  },
};

export default ProfilePage;
