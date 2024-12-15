import React, { useState } from 'react';
import './MealSearchPage.css';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const MealSearchPage = ({ mealType, onClose }) => {
  const recipes = {
    kahvaltı: [
      {
        name: "Pankekli Yumurta",
        description: "Protein açısından zengin, enerji verici bir kahvaltı seçeneği.",
        ingredients: [
          "2 yumurta",
          "2 yemek kaşığı yulaf ezmesi",
          "1 dilim muz",
          "1 tutam tarçın",
        ],
        nutrition: {
          protein: "18g",
          carb: "20g",
          fat: "8g",
          calorie: "280 kcal",
        },
      },
      {
        name: "Avokadolu Tam Buğday Tostu",
        description: "Sağlıklı yağlar ve tam tahıl içeren bir kahvaltı.",
        ingredients: [
          "2 dilim tam buğday ekmeği",
          "Yarım avokado",
          "1 haşlanmış yumurta",
          "1 tutam çörek otu",
        ],
        nutrition: {
          protein: "12g",
          carb: "22g",
          fat: "10g",
          calorie: "290 kcal",
        },
      },
      {
        name: "Smoothie Bowl",
        description: "Renkli ve besleyici bir kahvaltı alternatifi.",
        ingredients: [
          "1 dondurulmuş muz",
          "1 avuç yaban mersini",
          "1 yemek kaşığı chia tohumu",
          "Yarım su bardağı süt (badem veya yulaf sütü)",
        ],
        nutrition: {
          protein: "8g",
          carb: "30g",
          fat: "5g",
          calorie: "240 kcal",
        },
      },
    ],
  
    öğle: [
      {
        name: "Izgara Tavuklu Kinoa Salatası",
        description: "Düşük yağlı, yüksek proteinli ve doyurucu bir öğle yemeği.",
        ingredients: [
          "100g ızgara tavuk",
          "1 su bardağı haşlanmış kinoa",
          "Salatalık, domates, marul",
          "1 yemek kaşığı zeytinyağı",
        ],
        nutrition: {
          protein: "35g",
          carb: "40g",
          fat: "8g",
          calorie: "400 kcal",
        },
      },
      {
        name: "Ton Balıklı Nohut Salatası",
        description: "Yüksek protein ve lif içeriği ile doyurucu bir seçenek.",
        ingredients: [
          "1 kutu ton balığı (suda)",
          "Yarım su bardağı haşlanmış nohut",
          "Marul, roka, kırmızı soğan",
          "Yarım limon suyu",
        ],
        nutrition: {
          protein: "30g",
          carb: "25g",
          fat: "5g",
          calorie: "350 kcal",
        },
      },
      {
        name: "Hindi Köfte ve Sebze Tabağı",
        description: "Düşük yağlı, sağlıklı bir protein kaynağı.",
        ingredients: [
          "150g hindi köfte",
          "Buharda pişirilmiş brokoli, havuç, kabak",
          "1 yemek kaşığı zeytinyağı",
        ],
        nutrition: {
          protein: "32g",
          carb: "20g",
          fat: "7g",
          calorie: "370 kcal",
        },
      },
    ],
  
    akşam: [
      {
        name: "Fırında Somon ve Kuşkonmaz",
        description: "Omega-3 yağ asitleri bakımından zengin sağlıklı bir akşam yemeği.",
        ingredients: [
          "150g somon fileto",
          "5-6 dal kuşkonmaz",
          "1 yemek kaşığı zeytinyağı",
          "Tuz ve karabiber",
        ],
        nutrition: {
          protein: "32g",
          carb: "10g",
          fat: "15g",
          calorie: "400 kcal",
        },
      },
      {
        name: "Fırında Tavuk ve Tatlı Patates",
        description: "Düşük yağlı, karbonhidrat ve protein dengesi mükemmel bir akşam yemeği.",
        ingredients: [
          "150g tavuk göğsü",
          "1 orta boy tatlı patates",
          "1 tutam kekik",
          "1 yemek kaşığı zeytinyağı",
        ],
        nutrition: {
          protein: "35g",
          carb: "30g",
          fat: "8g",
          calorie: "410 kcal",
        },
      },
      {
        name: "Sebzeli Mercimek Yemeği",
        description: "Bitkisel protein kaynağı olan doyurucu bir seçenek.",
        ingredients: [
          "1 su bardağı yeşil mercimek",
          "1 havuç",
          "1 kabak",
          "1 yemek kaşığı zeytinyağı",
        ],
        nutrition: {
          protein: "18g",
          carb: "35g",
          fat: "6g",
          calorie: "320 kcal",
        },
      },
    ],
  
  
    aperatifler: [
      {
        name: "Protein Bar",
        description: "Hızlı bir enerji ve protein kaynağı olarak ideal bir atıştırmalık.",
        ingredients: [
          "1 su bardağı yulaf ezmesi",
          "2 yemek kaşığı fıstık ezmesi",
          "1 yemek kaşığı bal",
          "1 ölçek protein tozu",
        ],
        nutrition: {
          protein: "20g",
          carb: "15g",
          fat: "6g",
          calorie: "200 kcal",
        },
      },
      {
        name: "Yoğurt ve Badem Karışımı",
        description: "Protein ve sağlıklı yağ içeren hafif bir atıştırmalık.",
        ingredients: [
          "1 küçük kase yoğurt",
          "1 avuç çiğ badem",
          "1 çay kaşığı tarçın",
        ],
        nutrition: {
          protein: "12g",
          carb: "10g",
          fat: "8g",
          calorie: "190 kcal",
        },
      },
      {
        name: "Elmalı Chia Puding",
        description: "Tatlı isteğini sağlıklı bir şekilde bastırmak için ideal.",
        ingredients: [
          "1 su bardağı badem sütü",
          "2 yemek kaşığı chia tohumu",
          "1 küçük yeşil elma",
          "1 çay kaşığı tarçın",
        ],
        nutrition: {
          protein: "8g",
          carb: "25g",
          fat: "5g",
          calorie: "180 kcal",
        },
      },
    ],
  };
  

  
  
  
  
  const [activeTab, setActiveTab] = useState('yemek'); // Active tab state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [apiResults, setApiResults] = useState([]); // API results
  const [addedMeals, setAddedMeals] = useState([]); // Added meals state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [mealGrams, setMealGrams] = useState({}); // Meal grams state
  const { userId } = useContext(UserContext);
  const mealRecipes = recipes[mealType] || [];


  const staticMeals = [
    { name: 'Yulaf Ezmesi', protein: 5, carb: 27, fat: 3, calorie: 150 },
    { name: 'Avokado Tost', protein: 4, carb: 15, fat: 10, calorie: 180 },
    { name: 'Yoğurt', protein: 10, carb: 12, fat: 2, calorie: 100 },
    { name: 'Tavuklu Salata', protein: 25, carb: 10, fat: 5, calorie: 200 },
    { name: 'Makarna', protein: 8, carb: 40, fat: 1, calorie: 220 },
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
    const foodDescription = `Calories: ${calculatedValues.calorie}kcal | Fat: ${calculatedValues.fat}g | Carbs: ${calculatedValues.carb}g | Protein: ${calculatedValues.protein}g`;
    try {
      const response = await fetch("http://localhost:5000/api/save_food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          meal_type: mealType,
          food_name: meal.name,
          food_description: foodDescription, // Optional: keep it for display purposes
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


{activeTab === "tarifler" && (
  <div className="recipe-section">
    {/* Sekme Başlığı */}
    <h2 className="recipe-title">
      {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Tarifleri
    </h2>
    <div className="recipe-card-container">
      {recipes[mealType]?.map((recipe, index) => (
        <div key={index} className="recipe-card">
          {/* Yemek İsmi */}
          <h4 className="recipe-name">{recipe.name}</h4>
          
          {/* Yemek Açıklaması */}
          <p className="recipe-description">{recipe.description}</p>
          
          {/* Malzemeler Listesi */}
          <ul className="recipe-ingredients">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="ingredient-item">
                {ingredient}
              </li>
            ))}
          </ul>

          {/* Besin Değerleri */}
          <div className="recipe-nutrition">
            <p><strong>Kalori:</strong> {recipe.nutrition.calorie} kcal</p>
            <p><strong>Protein:</strong> {recipe.nutrition.protein} g</p>
            <p><strong>Karbonhidrat:</strong> {recipe.nutrition.carb} g</p>
            <p><strong>Yağ:</strong> {recipe.nutrition.fat} g</p>
          </div>
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
