// ReportPage.js
import React, { useState } from 'react';
import './ReportPage.css';

const ReportPage = () => {
  const [activeSection, setActiveSection] = useState('none');

  const renderSection = () => {
    switch (activeSection) {
      case 'kaloriler':
        return (
          <div className="report-content">
            <h2 className="section-title">Kaloriler</h2>
            <div className="calorie-overview">
              <p className="calorie-text">Günlük Ortalama: 0 | Hedef: 2900 kcal</p>
              <div className="calorie-chart">
                {/* Replace with an actual chart component if needed */}
                <div className="chart-placeholder">Kalori Grafiği Burada</div>
              </div>
              <ul className="meal-summary">
                <li><span className="meal-color breakfast"></span>Kahvaltı (0%) - 0 kcal</li>
                <li><span className="meal-color lunch"></span>Öğle Yemeği (0%) - 0 kcal</li>
                <li><span className="meal-color dinner"></span>Akşam Yemeği (0%) - 0 kcal</li>
                <li><span className="meal-color snacks"></span>Aperatifler/Diğer (0%) - 0 kcal</li>
              </ul>
            </div>
          </div>
        );
      case 'makrolar':
        return (
          <div className="report-content">
            <h2 className="section-title">Makrolar</h2>
            <div className="macro-chart">
              {/* Replace with an actual chart component if needed */}
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
                  <td>-</td>
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