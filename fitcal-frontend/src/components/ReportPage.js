// ReportPage.js
import React, { useState, useEffect, useContext } from 'react';
import './ReportPage.css';
import { UserContext } from '../context/UserContext';

const ReportPage = () => {
  const { userId } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState('none');
  const [calorieData, setCalorieData] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [error, setError] = useState('');

  // API'den veri çekme fonksiyonu
  const fetchCalorieSummary = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/calorie_summary/${userId}`);
      if (!response.ok) throw new Error('Veri alınırken bir hata oluştu.');
      const data = await response.json();

      setCalorieData(data.calorie_summary);
      setTotalCalories(data.total_calories);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (activeSection === 'kaloriler') {
      fetchCalorieSummary();
    }
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'kaloriler':
        return (
          <div className="report-content">
            <h2 className="section-title">Kaloriler</h2>
            {error && <p className="error-message">{error}</p>}
            {!error && (
              <>
                <div className="calorie-overview">
                  <p className="calorie-text">
                    Günlük Toplam: {totalCalories} kcal | Hedef: 2900 kcal
                  </p>
                  <div className="calorie-chart">
                    <div className="chart-placeholder">Kalori Grafiği Burada</div>
                  </div>
                  <ul className="meal-summary">
                    {calorieData.map((meal) => (
                      <li key={meal.meal_type}>
                        <span className={`meal-color ${meal.meal_type}`}></span>
                        {meal.meal_type} ({meal.percentage}%) - {meal.calories} kcal
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        );
      case 'makrolar':
        return (
          <div className="report-content">
            <h2 className="section-title">Makrolar</h2>
            <div className="macro-chart">
              <div className="chart-placeholder">Makro Grafiği Burada</div>
            </div>
            <ul className="macro-summary">
              <li><span className="macro-color carbs"></span>Karbonhidrat: 0% / 50%</li>
              <li><span className="macro-color fats"></span>Yağ: 0% / 30%</li>
              <li><span className="macro-color proteins"></span>Protein: 0% / 20%</li>
            </ul>
          </div>
        );
      case 'besinler':
        return (
          <div className="report-content">
            <h2 className="section-title">Besinler</h2>
            <table className="nutrition-table">
              <thead>
                <tr>
                  <th>Besin</th>
                  <th>Toplam</th>
                  <th>Hedef</th>
                  <th>+/-</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kaloriler (kcal)</td>
                  <td>{totalCalories}</td>
                  <td>20300</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Protein (g)</td>
                  <td>-</td>
                  <td>700</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Karbonhidrat (g)</td>
                  <td>-</td>
                  <td>1750</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Yağ (g)</td>
                  <td>-</td>
                  <td>469</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return <p className="report-text">Bir kategori seçerek detayları görüntüleyin.</p>;
    }
  };

  return (
    <div className="report-page">
      <div className="report-header">
        <h1 className="fitcal-title">FitCal</h1>
        <h2 className="report-title">Raporlar</h2>
        <div className="button-group">
          <button
            className={`section-button ${activeSection === 'kaloriler' ? 'active' : ''}`}
            onClick={() => setActiveSection('kaloriler')}
          >
            Kaloriler
          </button>
          <button
            className={`section-button ${activeSection === 'makrolar' ? 'active' : ''}`}
            onClick={() => setActiveSection('makrolar')}
          >
            Makrolar
          </button>
          <button
            className={`section-button ${activeSection === 'besinler' ? 'active' : ''}`}
            onClick={() => setActiveSection('besinler')}
          >
            Besinler
          </button>
        </div>
      </div>
      {renderSection()}
    </div>
  );
};

export default ReportPage;
