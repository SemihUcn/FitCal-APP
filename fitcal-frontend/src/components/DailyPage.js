import React, { useState, useEffect } from 'react';
import './DailyPage.css';
import MealSearchPage from './MealSearchPage';
import ExercisePage from './ExercisePage';
import WaterPage from './WaterPage'; // Su takipçisi sayfası

const DailyPage = () => {
  const [showMealSearch, setShowMealSearch] = useState(false);
  const [showExercisePage, setShowExercisePage] = useState(false);
  const [showWaterPage, setShowWaterPage] = useState(false); // Su takipçisi sayfası kontrolü
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeMealType, setActiveMealType] = useState(""); // Aktif öğün tipi

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
  }, []);

  const handleDateChange = (event) => {
    const formattedDate = new Date(event.target.value).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
    setShowCalendar(false);
  };

  const handleOpenMealSearch = (mealType) => {
    setActiveMealType(mealType);
    setShowMealSearch(true);
  };

  const openExercisePage = () => {
    setShowExercisePage(true);
  };

  const openWaterPage = () => {
    setShowWaterPage(true);
  };

  // Page rendering logic
  if (showExercisePage) {
    return <ExercisePage onClose={() => setShowExercisePage(false)} />;
  }

  if (showMealSearch) {
    return <MealSearchPage mealType={activeMealType} onClose={() => setShowMealSearch(false)} />;
  }

  if (showWaterPage) {
    return <WaterPage onClose={() => setShowWaterPage(false)} />;
  }

  return (
    <div className="daily-page">
      <header className="header">
        <h1 className="fitcal-title">
          Günlük Takip <span className="current-date">- {selectedDate}</span>
        </h1>
        <button className="calendar-button" onClick={() => setShowCalendar(true)}>📅</button>
      </header>

      {showCalendar && (
        <div className="calendar-overlay">
          <div className="calendar-container">
            <h3>Tarih Seç</h3>
            <input type="date" className="calendar-input" onChange={handleDateChange} />
            <button className="close-calendar" onClick={() => setShowCalendar(false)}>X</button>
          </div>
        </div>
      )}

      <main className="meal-sections">
        {[
          { name: "Kahvaltı", type: "kahvaltı" },
          { name: "Öğle Yemeği", type: "öğle" },
          { name: "Akşam Yemeği", type: "akşam" },
          { name: "Aperatifler", type: "aperatifler" },
        ].map((meal) => (
          <div className="meal-section-horizontal" key={meal.type}>
            <span className="meal-name">{meal.name}</span>
            <button
              className="add-button"
              onClick={() => handleOpenMealSearch(meal.type)}
            >
              +
            </button>
          </div>
        ))}

        {/* Egzersiz Ekle Butonu */}
        <div className="meal-section-horizontal">
          <span className="meal-name">Egzersizler</span>
          <button className="add-meal-button-horizontal" onClick={openExercisePage}>+</button>
        </div>

        {/* Su İçme Takipçisi Butonu */}
        <div className="meal-section-horizontal">
          <span className="meal-name">Su Seviyesi Ekleme</span>
          <button className="add-meal-button-horizontal" onClick={openWaterPage}>+</button>
        </div>
      </main>

      <footer className="bottom-nav">
        {['Daily', 'Report', 'add', 'Community', 'Profile'].map((page) => (
          <button key={page} className="nav-button">
            {page[0].toUpperCase()}<br />{page}
          </button>
        ))}
      </footer>
    </div>
  );
};

export default DailyPage;
