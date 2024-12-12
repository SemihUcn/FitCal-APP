import React, { useState } from 'react';
import './MealSearchPage.css';

const MealSearchPage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('yemek'); // Varsayılan sekme "Yemek"
  const [searchQuery, setSearchQuery] = useState('');
  const [recentMeals, setRecentMeals] = useState([]);
  const meals = [
    { name: 'Yulaf Ezmesi', protein: 5, carbs: 27, fat: 3, calories: 150 },
    { name: 'Avokado Tost', protein: 4, carbs: 15, fat: 10, calories: 180 },
    { name: 'Yoğurt', protein: 10, carbs: 12, fat: 2, calories: 100 },
    { name: 'Tavuklu Salata', protein: 25, carbs: 10, fat: 5, calories: 200 },
    { name: 'Makarna', protein: 8, carbs: 40, fat: 1, calories: 220 },
  ];

  const recipes = [
    { name: 'Sebzeli Omlet', description: 'Yumurta, biber, mantar ve ıspanak ile yapılan sağlıklı bir kahvaltı.' },
    { name: 'Avokadolu Sandviç', description: 'Tam tahıllı ekmek ve avokado ile hızlı bir atıştırmalık.' },
    { name: 'Izgara Tavuk', description: 'Marinelenmiş tavuk göğsü ile yapılan lezzetli bir akşam yemeği.' },
  ];

  const addMeal = (meal) => {
    setRecentMeals([...recentMeals, meal]);
  };

  const renderContent = () => {
    if (activeTab === 'yemek') {
      return (
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
            {meals.map((meal, index) => (
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
      );
    } else if (activeTab === 'tarifler') {
      return (
        <div className="recipe-section">
          {recipes.map((recipe, index) => (
            <div key={index} className="recipe-item">
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
            </div>
          ))}
        </div>
      );
    } else if (activeTab === 'enSonYenen') {
      return (
        <div className="recent-meals">
          <h3>Son Yenenler</h3>
          <ul>
            {recentMeals.map((meal, index) => (
              <li key={index}>{meal.name}</li>
            ))}
          </ul>
        </div>
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
          <button
            className={activeTab === 'tarifler' ? 'active' : ''}
            onClick={() => setActiveTab('tarifler')}
          >
            Tarifler
          </button>
          <button
            className={activeTab === 'enSonYenen' ? 'active' : ''}
            onClick={() => setActiveTab('enSonYenen')}
          >
            En Son Yenen
          </button>
        </div>
        <button className="back-button" onClick={onClose}>
          Geri Dön
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default MealSearchPage;
