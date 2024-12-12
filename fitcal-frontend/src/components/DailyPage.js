import React, { useState } from 'react';
import './DailyPage.css';
import MealSearchPage from './MealSearchPage';

const DailyPage = () => {
  const [showMealSearch, setShowMealSearch] = useState(false);

  if (showMealSearch) {
    return <MealSearchPage onClose={() => setShowMealSearch(false)} />;
  }

  return (
    <div className="daily-page">
      <header className="header">
        <h1 className="fitcal-title">Günlük Takip</h1>
      </header>

      <main className="meal-sections">
        <div className="meal-section-horizontal">
          <span className="meal-name">Kahvaltı</span>
          <button className="add-meal-button-horizontal" onClick={() => setShowMealSearch(true)}>+</button>
        </div>

        <div className="meal-section-horizontal">
          <span className="meal-name">Öğle Yemeği</span>
          <button className="add-meal-button-horizontal" onClick={() => setShowMealSearch(true)}>+</button>
        </div>

        <div className="meal-section-horizontal">
          <span className="meal-name">Akşam Yemeği</span>
          <button className="add-meal-button-horizontal" onClick={() => setShowMealSearch(true)}>+</button>
        </div>

        <div className="meal-section-horizontal">
          <span className="meal-name">Aperatifler</span>
          <button className="add-meal-button-horizontal" onClick={() => setShowMealSearch(true)}>+</button>
        </div>
      </main>

      <footer className="bottom-nav">
        {['Daily', 'Report', 'add', 'Community', 'Profile'].map((page) => (
          <button
            key={page}
            className="nav-button"
          >
            {page[0].toUpperCase()}<br />{page}
          </button>
        ))}
      </footer>
    </div>
  );
};

export default DailyPage;