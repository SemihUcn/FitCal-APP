import React, { useState, useEffect, useContext } from 'react';
import './ReportPage.css';
import { UserContext } from '../context/UserContext';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportPage = () => {
  const { userId } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState('none');
  const [calorieData, setCalorieData] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [calorieError, setCalorieError] = useState('');
  const [macroData, setMacroData] = useState(null);
  const [macroError, setMacroError] = useState('');
  const [totalMacros, setTotalMacros] = useState(null);
  const [targetCalories, setTargetCalories] = useState(null);

  const fetchTargetCalories = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/calculate_target_calories/${userId}`);
      if (!response.ok) throw new Error('Hedef kalori alınırken bir hata oluştu.');
      const data = await response.json();
      setTargetCalories(data.tdee);
    } catch (err) {
      console.error("Target calorie fetch error:", err);
    }
  };
  
  // Fetch Calorie Summary
   const fetchCalorieSummary = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/calorie_summary/${userId}`);
      if (!response.ok) throw new Error('Veri alınırken bir hata oluştu.');
      const data = await response.json();

      setCalorieData(data.calorie_summary);
      setTotalCalories(data.total_calories);
    } catch (err) {
      setCalorieError(err.message);
    }
  };

  const fetchTotalMacros = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/total_macros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });
        if (!response.ok) throw new Error("Error fetching total macros.");
        const data = await response.json();
        setTotalMacros(data);
    } catch (err) {
        setMacroError(err.message);
    }
};


  // Fetch Macro Summary
  const fetchMacroSummary = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/macro_summary/${userId}`);
      if (!response.ok) throw new Error('Error fetching macro data.');
      const data = await response.json();
      setMacroData(data);
    } catch (err) {
      setMacroError(err.message);
    }
  };

  // Trigger API calls based on the active section
  useEffect(() => {
    fetchTargetCalories();
    if (activeSection === "kaloriler") {
      fetchCalorieSummary();
    } else if (activeSection === "makrolar") {
      fetchMacroSummary();
    } else if (activeSection === "besinler") {
      fetchTotalMacros();
    }
  }, [activeSection]);
  
  // Render the active section
  const renderSection = () => {
    switch (activeSection) {
      case "kaloriler":
        const chartData = {
          labels: calorieData.map((meal) => meal.meal_type),
          datasets: [
            {
              data: calorieData.map((meal) => meal.calories),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
              ],
            },
          ],
        };

        return (
          <div className="report-content">
            <h2 className="section-title">Kaloriler</h2>
            {calorieError && <p className="error-message">{calorieError}</p>}
            {!calorieError && (
              <>
                <div className="calorie-overview">
                  <p className="calorie-text">
                    Günlük Toplam: {totalCalories} kcal | Hedef: {targetCalories || 'Hedef belirlenmedi'} kcal
                  </p>
                  <div
                    className="calorie-chart"
                    style={{
                      width: "300px",
                      height: "300px",
                      margin: "0 auto",
                    }}
                  >
                    <Doughnut
                      data={chartData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </div>

                  <ul className="meal-summary">
                    {calorieData.map((meal, index) => (
                      <li key={meal.meal_type} className="meal-summary-item">
                        <span
                          className="color-box"
                          style={{
                            backgroundColor:
                              chartData.datasets[0].backgroundColor[index],
                          }}
                        ></span>
                        {meal.meal_type} ({meal.percentage}%) - {meal.calories}{" "}
                        kcal
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        );

      case "makrolar":
        const macroChartData = macroData
          ? {
              labels: ["Karbonhidrat", "Yağ", "Protein"],
              datasets: [
                {
                  data: [
                    macroData.carbs.consumed,
                    macroData.fats.consumed,
                    macroData.proteins.consumed,
                  ],
                  backgroundColor: ["#FFCE56", "#FF6384", "#36A2EB"],
                  hoverBackgroundColor: ["#FFCE56", "#FF6384", "#36A2EB"],
                },
              ],
            }
          : null;

        return (
          <div className="report-content">
            <h2 className="section-title">Makrolar</h2>
            {macroError && <p className="error-message">{macroError}</p>}
            {macroData && (
              <>
                <p className="calorie-text">Günlük Toplam Makro Yüzdesi</p>
                <div
                  className="macro-chart"
                  style={{
                    width: "300px",
                    height: "300px",
                    margin: "0 auto",
                  }}
                >
                  <Doughnut
                    data={macroChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
                <ul className="macro-summary">
                  <li>
                    <span className="macro-color carbs"></span>
                    Karbonhidrat: {macroData.carbs.consumed.toFixed(2)} %
                  </li>
                  <li>
                    <span className="macro-color fats"></span>
                    Yağ: {macroData.fats.consumed.toFixed(2)} %
                  </li>
                  <li>
                    <span className="macro-color proteins"></span>
                    Protein: {macroData.proteins.consumed.toFixed(2)} %
                  </li>
                </ul>
              </>
            )}
          </div>
        );
          case "besinler":
            return (
                <div className="report-content">
                    <h2 className="section-title">Besin Gramajları</h2>
                    {macroError && <p className="error-message">{macroError}</p>}
                    {totalMacros && (
                        <table className="nutrition-table">
                            <thead>
                                <tr>
                                    <th>Besinler</th>
                                    <th>Toplam Gramaj ve Kalori</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Kaloriler (kcal)</td>
                                    <td>{totalMacros.total_calories.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Protein (g)</td>
                                    <td>{totalMacros.total_protein.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Karbonhidrat (g)</td>
                                    <td>{totalMacros.total_carbs.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Yağ (g)</td>
                                    <td>{totalMacros.total_fat.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
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
