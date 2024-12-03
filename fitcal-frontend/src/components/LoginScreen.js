import React, { useState } from 'react';
import './LoginScreen.css';
import fitcalImage from '../assets/ana_giris_foto.jpg';

const Header = () => (
  <div style={{
    width: '100%',
    padding: '15px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
  }}>
    <img src={fitcalImage} alt="FitCal Logo" style={{ width: '40px', height: '40px', marginRight: '15px' }} />
    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>FITCAL</h1>
  </div>
);

const LoginScreen = () => {
  const [view, setView] = useState(null); // Kullanıcı Sign In veya Sign Up seçimi yapana kadar null
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kullanıcı kimliği doğrulandığında true olacak
  const [surveyCompleted, setSurveyCompleted] = useState(false); // Anket tamamlandığında true olacak
  const [currentPage, setCurrentPage] = useState('daily'); // Ana uygulama sayfası için aktif sayfa durumu
  const [currentDate, setCurrentDate] = useState(new Date()); // Günlük kısmı için tarih durumu
  const [showFullCalendar, setShowFullCalendar] = useState(false); // Tam takvim gösterimi
  const [surveyData, setSurveyData] = useState({
    dailyActivity: '',
    dietaryPreference: '',
    targetWeight: '',
    exerciseFrequency: '',
  });
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  const [showMealSelection, setShowMealSelection] = useState({ show: false, mealType: '' });
  const [mealSearchQuery, setMealSearchQuery] = useState('');

  // Form verileri için durum yönetimi
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    weight: '',
    height: '',
    age: '',
    gender: '',
  });

  // Input değişikliklerini işleme
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Anket input değişikliklerini işleme
  const handleSurveyChange = (e) => {
    setSurveyData({
      ...surveyData,
      [e.target.name]: e.target.value,
    });
  };

  // Sign In butonuna basıldığında çağrılan işlev
  const handleSignIn = (e) => {
    e.preventDefault();
    setIsAuthenticated(true); // Kullanıcıyı kimlik doğrulandı olarak işaretlemeden doğrudan giriş yap
  };

  // Sign Up butonuna basıldığında çağrılan işlev
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          weight: formData.weight,
          height: formData.height,
          age: formData.age,
          gender: formData.gender,
        }),
      });

      if (response.ok) {
        alert('Kayıt başarılı!');
        setView('signIn'); // Kullanıcı kayıttan sonra giriş formuna döner
      } else {
        alert('Bir hata oluştu, tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
    }
  };

  // Kaydet butonuna basıldığında çağrılan işlev
  const handleSurveySubmit = () => {
    setSurveyCompleted(true); // Anketi tamamlanmış olarak işaretle
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const handleMealSelection = (mealType, meal) => {
    setMeals((prevMeals) => ({
      ...prevMeals,
      [mealType]: [...prevMeals[mealType], meal],
    }));
    setShowMealSelection({ show: false, mealType: '' });
    setMealSearchQuery('');
  };

  const renderBottomNav = () => (
    <div style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: '#ffffff',
      boxShadow: '0px -1px 5px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
    }}>
      {['daily', 'list', 'add', 'progress', 'profile'].map((page, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'color 0.3s ease',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              backgroundColor: currentPage === page ? '#007bff' : '#e0e0e0',
              borderRadius: '50%',
              marginBottom: '5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
            }}
          >
            {page[0].toUpperCase()}
          </div>
          <div style={{ fontSize: '0.85rem', color: currentPage === page ? '#007bff' : '#888' }}>
            {page === 'daily' ? 'Günlük' :
              page === 'list' ? 'Liste' :
              page === 'add' ? 'Ekle' :
              page === 'progress' ? 'İlerleme' :
              'Profil'}
          </div>
        </button>
      ))}
    </div>
  );

  const renderDailyPage = () => (
    <div style={{ padding: '20px', paddingTop: '80px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <button onClick={() => handleDateChange(-1)} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: '#007bff',
          transition: 'color 0.3s ease',
        }}>◀</button>
        <h2 style={{ textAlign: 'center', color: '#007bff', fontWeight: 'bold', fontSize: '1.25rem' }}>{currentDate.toDateString()}</h2>
        <button onClick={() => handleDateChange(1)} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: '#007bff',
          transition: 'color 0.3s ease',
        }}>▶</button>
        <button onClick={() => setShowFullCalendar(!showFullCalendar)} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: '#007bff',
          transition: 'color 0.3s ease',
        }}>📅</button>
      </div>
      {showFullCalendar && <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>Tüm Takvim Gösterimi (Geçici Placeholder)</div>}
      <div style={{ marginTop: '20px' }}>
        {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => (
          <div key={mealType} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px',
            marginBottom: '10px',
            backgroundColor: '#f3f3f3',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#555' }}>
              {mealType === 'breakfast' && 'Kahvaltı'}
              {mealType === 'lunch' && 'Öğle Yemeği'}
              {mealType === 'dinner' && 'Akşam Yemeği'}
              {mealType === 'snacks' && 'Aperatifler'}
            </div>
            <button onClick={() => setShowMealSelection({ show: true, mealType })} style={{
              background: '#007bff',
              border: 'none',
              color: '#fff',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}>+</button>
          </div>
        ))}
        {Object.entries(meals).map(([mealType, items]) => (
          items.length > 0 && (
            <div key={mealType} style={{ marginTop: '10px' }}>
              <strong style={{ fontSize: '1.1rem', color: '#333', textDecoration: 'underline' }}>{mealType === 'breakfast' ? 'Kahvaltı' : mealType === 'lunch' ? 'Öğle Yemeği' : mealType === 'dinner' ? 'Akşam Yemeği' : 'Aperatifler'}</strong>
              <ul style={{ paddingLeft: '20px' }}>
                {items.map((item, index) => (
                  <li key={index} style={{ fontSize: '1rem', color: '#555' }}>{item}</li>
                ))}
              </ul>
            </div>
          )
        ))}
      </div>
      {showMealSelection.show && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          padding: '20px',
          boxShadow: '0px -1px 5px rgba(0, 0, 0, 0.1)',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
        }}>
          <h4 style={{ marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>Yemek Seçin:</h4>
          <input
            type="text"
            placeholder="Yemek Ara..."
            value={mealSearchQuery}
            onChange={(e) => setMealSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '1rem',
            }}
          />
          {['Elma', 'Tavuk Göğsü', 'Yoğurt', 'Salata', 'Yulaf']
            .filter((meal) => meal.toLowerCase().includes(mealSearchQuery.toLowerCase()))
            .map((meal) => (
              <button
                key={meal}
                onClick={() => handleMealSelection(showMealSelection.mealType, meal)}
                style={{
                  margin: '5px',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s ease',
                }}
              >
                {meal}
              </button>
            ))}
          <button onClick={() => setShowMealSelection({ show: false, mealType: '' })} style={{
            display: 'block',
            marginTop: '15px',
            padding: '12px',
            backgroundColor: '#ccc',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}>Kapat</button>
        </div>
      )}
    </div>
  );

  if (surveyCompleted) {
    // Kullanıcı anketi tamamladıktan sonra ana sayfaya yönlendirme
    return (
      <div style={{ height: '100vh', backgroundColor: '#f9f9f9', paddingTop: '80px' }}>
        <Header />
        {currentPage === 'daily' && renderDailyPage()}
        {/* Diğer sayfalar burada eklenebilir */}
        {renderBottomNav()}
      </div>
    );
  }

  if (isAuthenticated) {
    // Giriş başarılıysa uygulamanın ana sayfasına yönlendirme (anket formunu gösteriyoruz)
    return (
      <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '80px' }}>
        <Header />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#007bff', fontWeight: 'bold' }}>FitCal Kişisel Anket</h2>
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '2.5rem', borderRadius: '20px', boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)' }}>
          <label style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#555', width: '100%' }}>
            Günlük Aktivite Seviyesi:
            <select name="dailyActivity" value={surveyData.dailyActivity} onChange={handleSurveyChange} required style={{ marginTop: '5px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="">Seçiniz</option>
              <option value="Sedentary">Sedentary (Hareketsiz)</option>
              <option value="Lightly active">Lightly active (Hafif aktif)</option>
              <option value="Moderately active">Moderately active (Orta derece aktif)</option>
              <option value="Very active">Very active (Çok aktif)</option>
            </select>
          </label>
          <label style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#555', width: '100%' }}>
            Diyet Tercihi:
            <select name="dietaryPreference" value={surveyData.dietaryPreference} onChange={handleSurveyChange} required style={{ marginTop: '5px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="">Seçiniz</option>
              <option value="Omnivore">Omnivore (Her şey yiyen)</option>
              <option value="Vegetarian">Vegetarian (Vejetaryen)</option>
              <option value="Vegan">Vegan</option>
            </select>
          </label>
          <label style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#555', width: '100%' }}>
            Hedef Kilo (kg):
            <input
              type="number"
              name="targetWeight"
              placeholder="Hedef Kilo"
              value={surveyData.targetWeight}
              onChange={handleSurveyChange}
              required
              style={{ marginTop: '5px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </label>
          <label style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#555', width: '100%' }}>
            Egzersiz Sıklığı:
            <select name="exerciseFrequency" value={surveyData.exerciseFrequency} onChange={handleSurveyChange} required style={{ marginTop: '5px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="">Seçiniz</option>
              <option value="Never">Never (Asla)</option>
              <option value="1-2 times a week">1-2 times a week</option>
              <option value="3-4 times a week">3-4 times a week</option>
              <option value="Daily">Daily (Her gün)</option>
            </select>
          </label>
          <button type="button" onClick={handleSurveySubmit} style={{
            marginTop: '20px',
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}>Kaydet</button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <Header />
      <div className="login-container" style={{ paddingTop: '80px' }}>
        <div className="image-container">
          <img src={fitcalImage} alt="FitCal'a Hoşgeldiniz" className="login-image" />
        </div>
        <h2 style={{ fontSize: '2.5rem', color: '#007bff', fontWeight: 'bold', marginBottom: '1.5rem' }}>FitCal'a Hoşgeldiniz</h2>
        {view === null && (
          <div className="button-container">
            <button className="btn sign-in" style={{
              marginBottom: '10px',
              width: '80%',
              padding: '15px',
              fontSize: '1.2rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }} onClick={() => setView('signIn')}>Sign In</button>
            <button className="btn sign-up" style={{
              width: '80%',
              padding: '15px',
              fontSize: '1.2rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }} onClick={() => setView('signUp')}>Sign Up</button>
          </div>
        )}

        {view === 'signIn' && (
          <form onSubmit={handleSignIn} style={{ width: '80%' }}>
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <button type="submit" className="btn" style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.2rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}>Sign In</button>
          </form>
        )}

        {view === 'signUp' && (
          <form onSubmit={handleSignUp} style={{ width: '80%' }}>
            <input
              type="text"
              name="name"
              placeholder="Adınız"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <input
              type="text"
              name="surname"
              placeholder="Soyadınız"
              value={formData.surname}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <input
              type="text"
              name="weight"
              placeholder="Kilonuz (kg)"
              value={formData.weight}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <input
              type="text"
              name="height"
              placeholder="Boyunuz (cm)"
              value={formData.height}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <input
              type="number"
              name="age"
              placeholder="Yaşınız"
              value={formData.age}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <input
              type="text"
              name="gender"
              placeholder="Cinsiyet (Erkek/Kadın)"
              value={formData.gender}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
              }}
            />
            <button type="submit" className="btn" style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.2rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}>Sign Up</button>
          </form>
        )}

        {view !== null && (
          <div className="switch-container">
            <p className="switch-link" style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '1rem',
              marginTop: '20px',
            }} onClick={() => setView(view === 'signUp' ? 'signIn' : 'signUp')}>
              {view === 'signUp' ? 'Hesabınız var mı? Giriş Yapın' : 'Hesabınız yok mu? Kayıt Olun'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
