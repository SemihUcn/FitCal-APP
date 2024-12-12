import React from 'react';

const AddPage = () => {
  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>FitCal</h1>
      <div style={styles.container}>
        <h2 style={styles.title}>Mevcut Ağırlığın</h2>
        <div style={styles.weightCard}>
          <div style={styles.weightRow}>
            <div style={styles.weightInfo}>
              <h3 style={styles.currentWeight}>84,0 kg</h3>
              <p style={styles.lastWeighing}>En son Tartılma - 886 gün önce</p>
            </div>
            <div style={styles.goalInfo}>
              <p><strong>Başlangıç ağırlığı:</strong> 84,0 kg</p>
              <p><strong>Hedef ağırlık:</strong> 74,0 kg</p>
            </div>
          </div>
          <div style={styles.progressRow}>
            <p><strong>Bugüne kadar kayıp:</strong> 0 kg</p>
            <p><strong>Geriye kalan:</strong> 10 kg</p>
          </div>
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.subtitle}>Ağırlık Değişimi</h3>
          <div style={styles.chartPlaceholder}>Burada ağırlık değişimi grafiği olacak.</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '20px',
  },
  header: {
    fontSize: '32px',
    color: '#007bff',
    marginBottom: '20px',
  },
  container: {
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
  },
  title: {
    color: '#007bff',
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  weightCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  weightRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightInfo: {
    textAlign: 'center',
  },
  currentWeight: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
  },
  lastWeighing: {
    fontSize: '14px',
    color: '#666',
  },
  goalInfo: {
    textAlign: 'right',
    fontSize: '14px',
    color: '#333',
  },
  progressRow: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: '200px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
    fontSize: '16px',
  },
};

export default AddPage;