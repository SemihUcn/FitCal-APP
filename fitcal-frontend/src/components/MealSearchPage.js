import React, { useState } from 'react';
import './MealSearchPage.css';

const MealSearchPage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('yemek'); // Aktif sekme
  const [searchQuery, setSearchQuery] = useState(''); // Arama sorgusu
  const [addedMeals, setAddedMeals] = useState([]); // Eklenen yemekler

  const meals = [
    { name: 'Yulaf Ezmesi', protein: 5, carbs: 27, fat: 3, calories: 150 },
    { name: 'Avokado Tost', protein: 4, carbs: 15, fat: 10, calories: 180 },
    { name: 'Yoğurt', protein: 10, carbs: 12, fat: 2, calories: 100 },
    { name: 'Tavuklu Salata', protein: 25, carbs: 10, fat: 5, calories: 200 },
    { name: 'Makarna', protein: 8, carbs: 40, fat: 1, calories: 220 },
  ];

  const recipes = [
    {
      name: 'Sebzeli Omlet',
      description: 'Sağlıklı ve doyurucu bir kahvaltı tarifi.',
      ingredients: ['2 yumurta', '1 küçük biber', '2 dilim mantar', 'Bir avuç ıspanak'],
    },
    {
      name: 'Avokadolu Sandviç',
      description: 'Hızlı ve besleyici bir atıştırmalık.',
      ingredients: ['1 avokado', '2 dilim tam tahıllı ekmek', '1 tutam tuz', 'Biraz limon suyu'],
    },
    {
      name: 'Izgara Tavuk',
      description: 'Lezzetli ve sağlıklı bir ana yemek.',
      ingredients: ['200g tavuk göğsü', '1 yemek kaşığı zeytinyağı', 'Tuz, karabiber, kekik'],
    },
  ];

  const addMeal = (meal) => {
    setAddedMeals([...addedMeals, meal]);
  };



  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="meal-search-page">
      <div className="meal-search-header">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'yemek' ? 'active' : ''}`}
            onClick={() => setActiveTab('yemek')}
          >
            Yemekler
          </button>
          <button
            className={`tab-button ${activeTab === 'tarifler' ? 'active' : ''}`}
            onClick={() => setActiveTab('tarifler')}
          >
            Tarifler
          </button>
          <button
            className={`tab-button ${activeTab === 'enSonYenenler' ? 'active' : ''}`}
            onClick={() => setActiveTab('enSonYenenler')}
          >
            En Son Yenenler
          </button>
        </div>
        <button className="back-button" onClick={onClose}>
          Geri Dön
        </button>
      </div>

      {/* Yemekler Sekmesi */}
      {activeTab === 'yemek' && (
        <>
          <div className="meal-search-container">
            <input
              type="text"
              placeholder="Yemek ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="meal-search-input"
            />
          </div>
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

          {/* Eklenen Yemekler Listesi */}
          {addedMeals.length > 0 && (
            <div className="added-meals-section">
              <h3>Eklenen Yemekler</h3>
              <ul className="added-meals-list">
                {addedMeals.map((meal, index) => (
                  <li key={index} className="added-meal-item">
                    {meal.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Tarifler Sekmesi */}
      {activeTab === 'tarifler' && (
        <div className="recipe-section">
          <h3>Tarifler</h3>
          {recipes.map((recipe, index) => (
            <div key={index} className="recipe-item">
              <h4>{recipe.name}</h4>
              <p>{recipe.description}</p>
              <ul>
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* En Son Yenenler Sekmesi */}
      {activeTab === 'enSonYenenler' && (
        <div className="recent-meals-section">
          <h3>En Son Yenenler</h3>
          {addedMeals.length > 0 ? (
            <ul>
              {addedMeals.map((meal, index) => (
                <li key={index}>
                  {meal.name} - {meal.calories} kcal
                </li>
              ))}
            </ul>
          ) : (
            <p>Henüz yemek eklenmedi.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MealSearchPage;
