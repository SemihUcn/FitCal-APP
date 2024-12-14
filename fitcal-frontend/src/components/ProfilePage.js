import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('');
  const [profileData, setProfileData] = useState(null);
  const { userId } = useContext(UserContext);

  // State for weight data
  const [currentWeight, setCurrentWeight] = useState(0);
  const [targetWeight, setTargetWeight] = useState(0);
  const [startingWeight, setStartingWeight] = useState(0);
  const [newWeight, setNewWeight] = useState('');

  // Fetch general profile data
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/profile/${userId}`)
      .then((response) => {
        console.log("DEBUG - Fetched Profile Data:", response.data);
        setProfileData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });
  }, [userId]);

  // Fetch weight data
  useEffect(() => {
    if (activeSection === 'Benim Kilom') {
      axios
        .get(`http://localhost:5000/api/weight/${userId}`)
        .then((response) => {
          console.log("DEBUG - Fetched Weight Data:", response.data); // Debugging response
          const { current_weight, starting_weight, target_weight } = response.data;
          setCurrentWeight(current_weight);
          setStartingWeight(starting_weight);
          setTargetWeight(target_weight);
        })
        .catch((error) => {
          console.error('Error fetching weight data:', error);
        });
    }
  }, [userId, activeSection]);
  
  const handleUpdateWeight = () => {
    console.log("DEBUG - Sending Weight Data:", newWeight); // Add this line
  
    axios
      .post(`http://localhost:5000/api/weight/${userId}`, { current_weight: newWeight })
      .then((response) => {
        console.log("DEBUG - Response:", response.data); // Add this line
        alert('Weight updated successfully');
        setCurrentWeight(newWeight); // Update UI with new weight
        setNewWeight(''); // Clear input
      })
      .catch((error) => {
        console.error('Error updating weight:', error);
        alert('Failed to update weight');
      });
  };
  
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
            <h3 style={styles.sectionTitle}>Benim Kilom</h3>
            <p style={styles.detail}><strong>Başlangıç Kilo:</strong> {startingWeight} kg</p>
            <p style={styles.detail}><strong>Mevcut Kilo:</strong> {currentWeight} kg</p>
            <p style={styles.detail}><strong>Hedef Kilo:</strong> {targetWeight} kg</p>

            <div style={styles.updateWeightContainer}>
              <input
                type="number"
                placeholder="Yeni Kilo Girin"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                style={styles.weightInput}
              />
              <button onClick={handleUpdateWeight} style={styles.updateButton}>
                Güncelle
              </button>
            </div>
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
  weightContainer: {
    padding: '20px',
  },
  updateWeightContainer: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  weightInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '150px',
  },
  updateButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  infoText: {
    fontSize: '16px',
    color: '#777',
  },
};

export default ProfilePage;
