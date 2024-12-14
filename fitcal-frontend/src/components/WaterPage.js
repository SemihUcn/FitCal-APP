import React, { useState, useEffect } from 'react';
import './WaterPage.css';
import { UserContext } from '../context/UserContext'
import { useContext } from 'react';

const WaterPage = ({ onClose }) => {
  const [totalWater, setTotalWater] = useState(0); // Toplam içilen su (litre cinsinden)
  const dailyGoal = 3; // Günlük hedef litre
  const progressPercentage = Math.min((totalWater / dailyGoal) * 100, 100); // İlerleme yüzdesi
  const { userId } = useContext(UserContext);

  const [selectedLitre, setSelectedLitre] = useState(0); // Seçilen litre
  const [selectedMillilitre, setSelectedMillilitre] = useState(0); // Seçilen mililitre

  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get_water", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }), // Replace with dynamic user_id
        });
  
        if (response.ok) {
          const data = await response.json();
          setTotalWater(data.total_water || 0);
        }
      } catch (error) {
        console.error("Su verileri alınamadı:", error);
      }
    };
  
    fetchWaterData();
  }, []);




  // Su ekleme işlevi
  const addWater = async () => {
    const waterToAdd = parseFloat(selectedLitre) + parseFloat(selectedMillilitre) / 1000; // Convert to liters
  
    try {
      const response = await fetch("http://localhost:5000/api/add_water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId, // Replace with dynamic user_id if available
          water_to_add: waterToAdd,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setTotalWater(data.new_total); // Update the total water state
      } else {
        const error = await response.json();
        alert(`Hata: ${error.message || "Su eklenemedi"}`);
      }
    } catch (error) {
      console.error("Sunucu hatası:", error);
      alert("Sunucu hatası, lütfen tekrar deneyiniz.");
    }
  
    setSelectedLitre(0);
    setSelectedMillilitre(0);
  };

  
  
  

  return (
    <div className="water-page">
      <h2 className="water-title">Su İçme Takipçisi</h2>
      <button className="back-button" onClick={onClose}>
        Geri Dön
      </button>

      <p className="water-goal">Günlük Hedef: {dailyGoal} litre</p>

      {/* Litre ve Mililitre Seçenekleri */}
      <div className="add-water-container">
        <select
          className="water-input"
          value={selectedLitre}
          onChange={(e) => setSelectedLitre(e.target.value)}
        >
          <option value="0">Litre</option>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <span>:</span>

        <select
          className="water-input"
          value={selectedMillilitre}
          onChange={(e) => setSelectedMillilitre(e.target.value)}
        >
          <option value="0">Mililitre</option>
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 100).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <button className="add-water-button" onClick={addWater}>
          Ekle
        </button>
      </div>

      {/* İlerleme Çubuğu */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage.toFixed(0)}%
        </div>
      </div>

      {/* Toplam İçilen Su */}
      <p className="current-water">
        Toplam İçilen Su: {totalWater.toFixed(2)} litre
      </p>
    </div>
  );
};

export default WaterPage;
