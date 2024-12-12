import React, { useState } from 'react';
import './MealSearchPage.css';

const MealSearchPage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('yemek'); // Varsayılan sekme "Yemek"
  const [searchQuery, setSearchQuery] = useState(''); // Arama sorgusu
  const [addedMeals, setAddedMeals] = useState([]); // Eklenen yemekler için state

  const meals = [
    { name: 'Yulaf Ezmesi', protein: 5, carbs: 27, fat: 3, calories: 150 },
    { name: 'Avokado Tost', protein: 4, carbs: 15, fat: 10, calories: 180 },
    { name: 'Yoğurt', protein: 10, carbs: 12, fat: 2, calories: 100 },
    { name: 'Tavuklu Salata', protein: 25, carbs: 10, fat: 5, calories: 200 },
    { name: 'Makarna', protein: 8, carbs: 40, fat: 1, calories: 220 },
  ];

  const addMeal = (meal) => {
    setAddedMeals([...addedMeals, meal]);
  };

  // Filtrelenmiş yemekler
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (activeTab === 'yemek') {
      return (
        <>
          {/* Arama Kutusu ve Buton */}
          <div className="meal-search-container">
            <input
              type="text"
              placeholder="Yemek ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="meal-search-input"
            />
            <button className="meal-search-button">Ara</button>
          </div>
  
          {/* Yemek Tablosu */}
          <table className="meal-table">
            <thead>
              <tr>
                <th>Yemek</th>
                <th>Protein (g)</th>
                <th>Karbonhidrat (g)</th>
                <th>Yağ (g)</th>
                <th>Kalori (kcal)</th>
                <th>Ekle</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.name}</td>
                  <td>{meal.protein}</td>
                  <td>{meal.carbs}</td>
                  <td>{meal.fat}</td>
                  <td>{meal.calories}</td>
                  <td>
                    <button className="add-button" onClick={() => addMeal(meal)}>
                      Ekle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {/* Eklenen Yemekler */}
          {addedMeals.length > 0 && (
            <div className="added-meals">
              <h3>Eklenen Yemekler</h3>
              <ul>
                {addedMeals.map((meal, index) => (
                  <li key={index} className="added-meal-item">
                    {meal.name} - {meal.calories} kcal
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="meal-search-page">
      <div className="meal-search-header">
        <div className="tab-buttons">
          <button
            className={activeTab === 'yemek' ? 'active' : ''}
            onClick={() => setActiveTab('yemek')}
          >
            Yemek
          </button>
        </div>
        <button className="back-button" onClick={onClose}>
          Geri Dön
        </button>
      </div>

      {/* İçeriği Render Et */}
      {renderContent()}
    </div>
  );
};

export default MealSearchPage;
