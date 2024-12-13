import React, { useState } from 'react';
import './MealSearchPage.css';

const MealSearchPage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('yemek'); // Aktif sekme
  const [searchQuery, setSearchQuery] = useState(''); // Arama sorgusu
  const [addedMeals, setAddedMeals] = useState([]); // Eklenen yemekler
  const [mealGrams, setMealGrams] = useState({}); // Gramajlar

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

  const meals = [
    { name: 'Yulaf Ezmesi', protein: 5, carb: 27, fat: 3, calorie: 150 },
    { name: 'Avokado Tost', protein: 4, carb: 15, fat: 10, calorie: 180 },
    { name: 'Yoğurt', protein: 10, carb: 12, fat: 2, calorie: 100 },
    { name: 'Tavuklu Salata', protein: 25, carb: 10, fat: 5, calorie: 200 },
    { name: 'Makarna', protein: 8, carb: 40, fat: 1, calorie: 220 },
  ];

  // Gramaj değiştiğinde değerleri güncelle
  const handleGramChange = (mealName, grams) => {
    const validGrams = Math.max(grams, 1); // En düşük değer 1 olacak
    setMealGrams({ ...mealGrams, [mealName]: validGrams });
  };

  // Hesaplanan değerler
  const calculateValues = (meal) => {
    const grams = parseFloat(mealGrams[meal.name] || 100); // Default gramaj 100
    const factor = grams / 100;

    return {
      protein: meal.protein ? (meal.protein * factor).toFixed(1) : 0,
      carb: meal.carb ? (meal.carb * factor).toFixed(1) : 0,
      fat: meal.fat ? (meal.fat * factor).toFixed(1) : 0,
      calorie: meal.calorie ? (meal.calorie * factor).toFixed(1) : 0,
    };
  };

  // Yemek ekleme işlemi
  const handleAddMeal = (meal) => {
    const grams = mealGrams[meal.name] || 100;
    const updatedMeal = {
      ...meal,
      grams,
      protein: ((meal.protein * grams) / 100).toFixed(1),
      carb: ((meal.carb * grams) / 100).toFixed(1),
      fat: ((meal.fat * grams) / 100).toFixed(1),
      calorie: ((meal.calorie * grams) / 100).toFixed(1),
    };

    setAddedMeals([...addedMeals, updatedMeal]);
    setMealGrams({ ...mealGrams, [meal.name]: '' }); // Gramajı sıfırla
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="meal-search-page">
    {/* Header */}
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
  
          {/* Yemek Tablosu */}
          <table className="meal-table">
            <thead>
              <tr>
                <th>Yemek</th>
                <th>Gramaj</th>
                <th>Protein (g)</th>
                <th>Karbonhidrat (g)</th>
                <th>Yağ (g)</th>
                <th>Kalori (kcal)</th>
                <th>Ekle</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeals.map((meal) => {
                const calculated = calculateValues(meal);
                return (
                  <tr key={meal.name}>
                    <td>{meal.name}</td>
                    <td>
                      <input
                        type="number"
                        placeholder="Gramaj"
                        value={mealGrams[meal.name] || ''}
                        onChange={(e) => handleGramChange(meal.name, e.target.value)}
                        min="1"
                      />
                    </td>
                    <td>{calculated.protein}</td>
                    <td>{calculated.carb}</td>
                    <td>{calculated.fat}</td>
                    <td>{calculated.calorie}</td>
                    <td>
                      <button className="add-button" onClick={() => handleAddMeal(meal)}>
                        Ekle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
  
          {/* Eklenen Yemekler Listesi */}
          {addedMeals.length > 0 && (
            <div className="added-meals-section">
              <h3>Eklenen Yemekler</h3>
              <ul className="added-meals-list">
                {addedMeals.map((meal, index) => (
                  <li key={index} className="added-meal-item">
                    {meal.name} - {meal.grams} g ({meal.calorie} kcal)
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
          <h3 className="recipe-title">Tarifler</h3>
          <div className="recipe-container">
            {recipes.map((recipe, index) => (
              <div key={index} className="recipe-card">
                <h4 className="recipe-name">{recipe.name}</h4>
                <p className="recipe-description">{recipe.description}</p>
                <ul className="recipe-ingredients">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default MealSearchPage;
