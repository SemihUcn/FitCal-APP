import React, { useState } from 'react';
import './MealSearchPage.css';

const MealSearchPage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('yemek'); // Aktif sekme
  const [searchQuery, setSearchQuery] = useState(''); // Arama sorgusu
  const [apiResults, setApiResults] = useState([]); // API'den dönen sonuçlar
  const [addedMeals, setAddedMeals] = useState([]); // Eklenen yemekler
  const [isLoading, setIsLoading] = useState(false); // Yükleniyor durumu
  const [errorMessage, setErrorMessage] = useState(''); // Hata mesajı

  // Backend'e arama isteği atan fonksiyon
  const handleSearch = async () => {
    setIsLoading(true); // Yükleniyor durumunu başlat
    setErrorMessage(''); // Hata mesajını temizle
    setApiResults([]); // Önceki sonuçları temizle


    try {
      const response = await fetch('http://localhost:5000/api/food_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          user_id: 4, // Örnek kullanıcı ID'si
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Yanıtı:", data); // API'den gelen veriyi konsola yaz
        if (data.results && data.results.length > 0) {
          setApiResults(data.results);
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
      setIsLoading(false); // Yükleniyor durumunu kapat
    }
  };

  // Yemek ekleme fonksiyonu
  const addMeal = async (meal) => {
  console.log("DEBUG - Backend'e Gönderilen Meal Obj:", meal); // Bu satır ekle
  try {
    const response = await fetch("http://localhost:5000/api/save_food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 4,
        meal_type: "kahvaltı",
        food_name: meal.food_name,
        food_description: meal.food_description || "", // Burada food_description ekliyoruz
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Yemek eklendi:", result);
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



  return (
    <div className="meal-search-page">
      <div className="meal-search-header">
        {/* Sekme Butonları */}
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
            <button onClick={handleSearch} className="search-button">
              Ara
            </button>
          </div>

          {/* Yükleniyor Mesajı */}
          {isLoading && <p>Arama yapılıyor...</p>}

          {/* Hata Mesajı */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Backend'den Dönen Yemekler */}
          {apiResults.length > 0 && (
            <table className="meal-table">
              <thead>
                <tr>
                  <th>Yemek</th>
                  <th>Ekle</th>
                </tr>
              </thead>
              <tbody>
                {apiResults.map((meal, index) => (
                  <tr key={index}>
                    <td>{meal.food_name || 'Bilinmeyen Yemek'}</td>
                    <td>
                      <button className="add-button" onClick={() => addMeal(meal)}>
                        Ekle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Eklenen Yemekler */}
          {addedMeals.length > 0 && (
            <div className="added-meals-section">
              <h3>Eklenen Yemekler</h3>
              <ul>
                {addedMeals.map((meal, index) => (
                  <li key={index}>
                    {meal.food_name || 'Bilinmeyen Yemek'} - {meal.calories || 0} kcal
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
          <p>Burada tarifler yer alacak.</p>
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
                  {meal.food_name || 'Bilinmeyen Yemek'} - {meal.calories || 0} kcal
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
