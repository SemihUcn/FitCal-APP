import React, { useState, useEffect, useContext } from 'react';
import './DailyPage.css';
import MealSearchPage from './MealSearchPage';
import ExercisePage from './ExercisePage';
import WaterPage from './WaterPage';
import { UserContext } from '../context/UserContext';

const DailyPage = () => {
  const { userId } = useContext(UserContext);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [mealItems, setMealItems] = useState({});
  const [error, setError] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [targetCalories ,setTargetCalories] = useState(null); // Hedef kalori değeri
  const [showPage, setShowPage] = useState({ type: null, mealType: null });

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
    fetchAllMeals();
    fetchTargetCalories();
  }, []);

  useEffect(() => {
    const total = Object.values(mealItems)
      .flat()
      .reduce((sum, item) => sum + item.calories, 0);
    setTotalCalories(total);
  }, [mealItems]);

  const fetchMealItems = async (mealType) => {
    try {
      const response = await fetch('http://localhost:5000/api/get_meals_by_type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, meal_type: mealType }),
      });
      if (response.ok) {
        const data = await response.json();
        setMealItems((prevItems) => ({ ...prevItems, [mealType]: data.meals || [] }));
      }
    } catch (error) {
      console.error(`Fetch error for ${mealType}:`, error);
      setError('Yemekler yüklenirken hata oluştu!');
    }
  };

  const fetchAllMeals = () => {
    const mealTypes = ['kahvaltı', 'öğle yemeği', 'akşam yemeği', 'aperatifler'];
    mealTypes.forEach((mealType) => fetchMealItems(mealType));
  };

  const fetchTargetCalories = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/calculate_target_calories/${userId}`);
      if (!response.ok) throw new Error('Hedef kalori alınırken bir hata oluştu.');
      const data = await response.json();
      setTargetCalories(data.tdee); // Set TDEE as target calorie
    } catch (error) {
      console.error("Target calorie fetch error:", error);
    }
  };

  const openPage = (type, mealType = null) => {
    setShowPage({ type, mealType });
  };

  const closePage = () => {
    setShowPage({ type: null, mealType: null });
    fetchAllMeals(); // Verileri yenile
  };

  const openExercisePage = () => openPage('exercise');
  const openWaterPage = () => openPage('water');

  const handleDateChange = (event) => {
    const formattedDate = new Date(event.target.value).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
    setShowCalendar(false);
  };

  const renderMealItems = (mealType) => {
    return mealItems[mealType] && mealItems[mealType].length > 0 ? (
      <ul className="meal-list">
        {mealItems[mealType].map((item, index) => (
          <li key={index} className="meal-item">
            <span>{item.food_name}</span>
            <span className="calories">{item.calories} kcal</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="no-meal-message">Henüz eklenen yemek yok.</p>
    );
  };

  const renderCalorieProgressBar = () => {
    const percentage = Math.min((totalCalories / targetCalories) * 100, 100);
    return (
      <div className="calorie-progress-container">
        <div className="calorie-progress-label">
          Hedef Kalori: {targetCalories} kcal | Alınan Kalori: {totalCalories} kcal
        </div>
        <div className="calorie-progress-bar">
          <div
            className="calorie-progress-fill"
            style={{ width: `${percentage}%` }}
          >
            {Math.round(percentage)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="daily-page">
      <header className="header">
        <h1>Günlük Takip - {selectedDate}</h1>
        {renderCalorieProgressBar()}
        <button onClick={() => setShowCalendar(false)}></button>
      </header>

      {showCalendar && (
        <div className="calendar-overlay">
          <div className="calendar-container">
            <h3>Tarih Seç</h3>
            <input type="date" className="calendar-input" onChange={handleDateChange} />
            <button className="close-calendar" onClick={() => setShowCalendar(false)}>
              X
            </button>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {showPage.type === 'meal' && (
        <MealSearchPage mealType={showPage.mealType} onClose={closePage} />
      )}

      {showPage.type === 'exercise' && <ExercisePage onClose={closePage} />}
      {showPage.type === 'water' && <WaterPage onClose={closePage} />}

      {!showPage.type && (
        <main className="meal-sections">
          {['kahvaltı', 'öğle yemeği', 'akşam yemeği', 'aperatifler'].map((mealType) => (
            <div key={mealType} className="meal-section-horizontal">
              <div className="meal-header">
                <span className="meal-name">{mealType.toUpperCase()}</span>
                <button
                  className="add-meal-button-horizontal"
                  onClick={() => openPage('meal', mealType)}
                >
                  +
                </button>
              </div>
              {renderMealItems(mealType)}
            </div>
          ))}

<div className="meal-section-horizontal exercise-section">
  <span className="meal-name">Egzersizler</span>
  <button className="add-meal-button-horizontal" onClick={openExercisePage}>
    +
  </button>
</div>

<div className="meal-section-horizontal water-section">
  <span className="meal-name">Su Seviyesi Ekleme</span>
  <button className="add-meal-button-horizontal" onClick={openWaterPage}>
    +
  </button>
</div>

        </main>
      )}

      <footer className="bottom-nav">
        {['Daily', 'Report', 'Add', 'Community', 'Profile'].map((page) => (
          <button key={page} className="nav-button">
            {page[0].toUpperCase()}<br />{page}
          </button>
        ))}
      </footer>
    </div>
  );
};

export default DailyPage;
