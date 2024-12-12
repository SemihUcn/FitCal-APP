import React, { useState, useEffect } from 'react';
import './DailyPage.css';
import MealSearchPage from './MealSearchPage';

const DailyPage = () => {
  const [showMealSearch, setShowMealSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false); // Takvim popup kontrolü
  const [selectedDate, setSelectedDate] = useState(''); // Seçilen tarih

  useEffect(() => {
    // Sayfa yüklendiğinde bugünün tarihini al
    const today = new Date();
    const formattedDate = today.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
  }, []);

  // Tarih seçme işlemi
  const handleDateChange = (event) => {
    const formattedDate = new Date(event.target.value).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
    setShowCalendar(false); // Takvimi kapat
  };

  if (showMealSearch) {
    return <MealSearchPage onClose={() => setShowMealSearch(false)} />;
  }

  return (
    <div className="daily-page">
      <header className="header">
        <h1 className="fitcal-title">
          Günlük Takip <span className="current-date"> - {selectedDate}</span>
        </h1>

        {/* Takvim Butonu */}
        <button className="calendar-button" onClick={() => setShowCalendar(true)}>
          📅
        </button>
      </header>

      {/* Takvim Popup */}
      {showCalendar && (
        <div className="calendar-overlay">
          <div className="calendar-container">
            <h3>Tarih Seç</h3>
            <input
              type="date"
              className="calendar-input"
              onChange={handleDateChange}
            />
            <button className="close-calendar" onClick={() => setShowCalendar(false)}>
              X
            </button>
          </div>
        </div>
      )}

      <main className="meal-sections">
        <div className="meal-section-horizontal">
          <span className="meal-name">Kahvaltı</span>
          <button className="add-meal-button-horizontal" onClick={() => setShowMealSearch(true)}>
            +
          </button>
        </div>

        <div className="meal-section-horizontal">
          <span className="meal-name">Öğle Yemeği</span>
          <button className="add-meal-button-horizontal" onClick={() => setShowMealSearch(true)}>
            +
          </button>
        </div>

        <div className="meal-section-horizontal">
          <span className="meal-name">Akşam Yemeği</span>
          <button className="add-meal-button-horizontal" onClick={() => setShowMealSearch(true)}>
            +
          </button>
        </div>

        <div className="meal-section-horizontal">
          <span className="meal-name">Aperatifler</span>
          <button className="add-meal-button-horizontal" onClick={() => setShowMealSearch(true)}>
            +
          </button>
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
