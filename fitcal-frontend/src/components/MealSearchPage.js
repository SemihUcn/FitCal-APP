import React, { useState } from 'react';
import './MealSearchPage.css';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const MealSearchPage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('yemek'); // Active tab state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [apiResults, setApiResults] = useState([]); // API results
  const [addedMeals, setAddedMeals] = useState([]); // Added meals state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [mealGrams, setMealGrams] = useState({}); // Meal grams state
  const { userId } = useContext(UserContext);
  

  const staticMeals = [
    { name: 'Yulaf Ezmesi', protein: 5, carb: 27, fat: 3, calorie: 150 },
    { name: 'Avokado Tost', protein: 4, carb: 15, fat: 10, calorie: 180 },
    { name: 'Yoğurt', protein: 10, carb: 12, fat: 2, calorie: 100 },
    { name: 'Tavuklu Salata', protein: 25, carb: 10, fat: 5, calorie: 200 },
    { name: 'Makarna', protein: 8, carb: 40, fat: 1, calorie: 220 },
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

  const handleSearch = async () => {
    setApiResults([]); // Clear previous results
    setIsLoading(true);
    setErrorMessage('');
  
    try {
      const translatedQuery = await translateToEnglish(searchQuery);
  
      const response = await fetch('http://localhost:5000/api/food_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: translatedQuery, user_id: userId }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        if (data.results && data.results.length > 0) {
          const processedResults = data.results.map((result) => {
            const description = result.food_description || '';
            const match = description.match(
              /Calories:\s*(\d+\.?\d*)kcal\s*\|\s*Fat:\s*(\d+\.?\d*)g\s*\|\s*Carbs:\s*(\d+\.?\d*)g\s*\|\s*Protein:\s*(\d+\.?\d*)g/
            );
  
            return {
              name: result.food_name,
              protein: match ? parseFloat(match[4]) : 0,
              carb: match ? parseFloat(match[3]) : 0,
              fat: match ? parseFloat(match[2]) : 0,
              calorie: match ? parseFloat(match[1]) : 0,
            };
          });
  
          setApiResults(processedResults);
        } else {
          setErrorMessage('Sonuç bulunamadı.');
        }
      } else {
        setErrorMessage('Arama başarısız. Lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Arama hatası:', error);
      setErrorMessage('Sunucu hatası: Arama yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  // Function to translate Turkish to English
  const translateToEnglish = async (query) => {
    try {
      const response = await fetch('https://api.mymemory.translated.net/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // API for translation
        query: { q: query, langpair: 'tr|en' },
      });
  
      const data = await response.json();
      return data.responseData.translatedText || query; // Fallback to the original query
    } catch (error) {
      console.error('Translation error:', error);
      return query; // Fallback to original query on failure
    }
  };
  
  
  

  const handleGramChange = (mealName, grams) => {
    const validGrams = Math.max(grams, 1);
    setMealGrams({ ...mealGrams, [mealName]: validGrams });
  };

  const calculateValues = (meal) => {
    const grams = parseFloat(mealGrams[meal.name] || 100);
    const factor = grams / 100;
    return {
      protein: (meal.protein * factor).toFixed(1),
      carb: (meal.carb * factor).toFixed(1),
      fat: (meal.fat * factor).toFixed(1),
      calorie: (meal.calorie * factor).toFixed(1),
    };
  };

  const addMeal = async (meal) => {
    const calculatedValues = calculateValues(meal);
    try {
      const response = await fetch("http://localhost:5000/api/save_food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          meal_type: "kahvaltı",
          food_name: meal.name,
          food_description: meal.description || "", // Optional: keep it for display purposes
          protein: Number(calculatedValues.protein),
          carb: Number(calculatedValues.carb),
          fat: Number(calculatedValues.fat),
          calorie: Number(calculatedValues.calorie),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setAddedMeals([...addedMeals, meal]);
      } else {
        const error = await response.json();
        alert("Hata: " + error.message || "Ekleme başarısız.");
      }
    } catch (error) {
      console.error("Ekleme hatası:", error);
      alert("Sunucu hatası, lütfen tekrar deneyiniz.");
    }
  };

  const combinedMeals = [...staticMeals, ...apiResults];
  const filteredMeals = combinedMeals.filter((meal) =>
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
        <button className="back-button" onClick={onClose}>Geri Dön</button>
      </div>

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
      <button onClick={handleSearch} className="search-button">Ara</button>
    </div>

    {isLoading && <p>Arama yapılıyor...</p>}
    {errorMessage && <p className="error-message">{errorMessage}</p>}

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
        {apiResults.map((meal) => {
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
                <button className="add-button" onClick={() => addMeal(meal)}>Ekle</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </>
)}


      {activeTab === 'tarifler' && (
        <div className="recipe-section">
          <h3>Tarifler</h3>
          <div className="recipe-container">
            {recipes.map((recipe, index) => (
              <div key={index} className="recipe-card">
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
        </div>
      )}

      {activeTab === 'enSonYenenler' && (
        <div className="recent-meals-section">
          <h3>En Son Yenenler</h3>
          {addedMeals.length > 0 ? (
            <ul>
              {addedMeals.map((meal, index) => (
                <li key={index}>
                  {meal.name || meal.food_name} - {meal.calories || meal.calorie || 0} kcal
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
