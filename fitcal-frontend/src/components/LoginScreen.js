import React, { useState } from 'react';
import './LoginScreen.css';
import fitcalImage from '../assets/ana_giris_foto.jpg';
import Header from './Header';
import ReportPage from './ReportPage';
import AddPage from './AddPage';
import ProfilePage from './ProfilePage';
import CommunityPage from './CommunityPage';
import DailyPage from './DailyPage';
import ListPage from './ListPage';



const LoginScreen = () => {
  const [view, setView] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState('daily');
  


  const renderPage = () => {
    switch (currentPage) {
      case 'Daily':
        return <DailyPage />;
      case 'Report':
        return <ReportPage />;
      case 'add':
        return <AddPage />;
      case 'Community':
        return <CommunityPage />;
      case 'Profile':
        return <ProfilePage />;
      default:
        return <DailyPage />;
    }
  };
  
  const [surveyData, setSurveyData] = useState({
    dailyActivity: '',
    dietaryPreference: '',
    targetWeight: '',
    exerciseFrequency: '',
  });
  
  
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

    

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSurveyChange = (e) => {
    setSurveyData({
      ...surveyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json(); // Backend'den kullanıcı ID'sini al
        const userId = data.user_id;
  
        // Kullanıcının profil verisini kontrol et
        const profileResponse = await fetch('http://localhost:5000/api/check_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });
  
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
  
          if (profileData.exists) {
            // Kullanıcının profili varsa direkt ana menüye git
            alert('Giriş başarılı! Profiliniz mevcut, ana menüye yönlendiriliyorsunuz.');
            setSurveyCompleted(true);
            setIsAuthenticated(true);
          } else {
            // Kullanıcının profili yoksa anket ekranına yönlendir
            alert('Giriş başarılı! Profil bilgilerinizi doldurunuz.');
            setIsAuthenticated(true);
          }
        }
      } else if (response.status === 404) {
        alert('Bu e-posta adresi kayıtlı değil. Lütfen kayıt olun.');
      } else if (response.status === 401) {
        alert('Şifre yanlış. Lütfen tekrar deneyiniz.');
      } else {
        alert('Bir hata oluştu, lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      alert('Sunucu hatası. Lütfen tekrar deneyin.');
    }
  };
  
  

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
        setView('signIn');
      } else {
        alert('Bir hata oluştu, tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
    }
  };

  const handleSurveySubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 4, // Burada kullanıcı ID'sini dinamik olarak almanız gerekiyor.
          activity_level: surveyData.dailyActivity,
          diet_preference: surveyData.dietaryPreference,
          target_weight: surveyData.targetWeight,
          exercise_frequency: surveyData.exerciseFrequency,
        }),
      });
  
      if (response.ok) {
        alert('Profil bilgileri başarıyla kaydedildi!');
        setSurveyCompleted(true);
      } else {
        alert('Profil bilgileri kaydedilemedi, tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Bir hata oluştu, lütfen tekrar deneyiniz.');
    }
  }
  
  const renderBottomNav = () => (
    <div className="bottom-nav">
      {['Daily', 'Report', 'add', 'Community', 'Profile'].map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)} // Doğru sayfa durumunu ayarla
          className={`nav-button ${currentPage === page ? 'active' : ''}`}
        >
          {page[0].toUpperCase()}<br />{page}
        </button>
      ))}
    </div>
  );
  

  if (surveyCompleted) {
    return (
      <div className="login-screen">
        <Header />
        {renderPage()} {/* Sayfayı dinamik olarak render et */}
        {renderBottomNav()} {/* Alt navigasyon */}
      </div>
    );
  }
  
  
  

  if (isAuthenticated) {
    return (
      <div>
        <Header />
        <h2>FitCal Kişisel Anket</h2>
        <form>
          <label>
            Günlük Aktivite Seviyesi:
            <select
              name="dailyActivity"
              value={surveyData.dailyActivity}
              onChange={handleSurveyChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly active">Lightly active</option>
              <option value="Moderately active">Moderately active</option>
              <option value="Very active">Very active</option>
            </select>
          </label>
          <label>
            Diyet Tercihi:
            <select
              name="dietaryPreference"
              value={surveyData.dietaryPreference}
              onChange={handleSurveyChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="Omnivore">Omnivore</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </label>
          <label>
            Hedef Kilo:
            <input
              type="number"
              name="targetWeight"
              value={surveyData.targetWeight}
              onChange={handleSurveyChange}
              required
            />
          </label>
          <label>
            Egzersiz Sıklığı:
            <select
              name="exerciseFrequency"
              value={surveyData.exerciseFrequency}
              onChange={handleSurveyChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="Never">Never</option>
              <option value="1-2 times a week">1-2 times a week</option>
              <option value="3-4 times a week">3-4 times a week</option>
              <option value="Daily">Daily</option>
            </select>
          </label>
          <button type="button" onClick={handleSurveySubmit}>Kaydet</button>
        </form>
      </div>
    );
  }
  return (
    <div className=".login-screen">
      <Header />
  
      {/* Kullanıcı giriş yapmış ve anket tamamlanmışsa */}
      {isAuthenticated && surveyCompleted ? (
        <>
          {renderPage()} {/* Sayfanın içeriğini gösterir */}
          {renderBottomNav()} {/* Alt navigasyon butonlarını gösterir */}
        </>
      ) : (
        <div className="login-container">
          <div className="login-image-container">
            <img src={fitcalImage} alt="FitCal'a Hoşgeldiniz" className="login-image" />
          </div>
          <h2>FitCal'a Hoşgeldiniz</h2>
  
          {/* Giriş Ekranı */}
          {view === null && (
            <div className="button-container">
              <button className="login-btn sign-in" onClick={() => setView('signIn')}>
                Sign In
              </button>
              <button className="login-btn.sign-up" onClick={() => setView('signUp')}>
                Sign Up
              </button>
            </div>
          )}
  
          {/* Giriş Formu */}
          {view === 'signIn' && (
            <form onSubmit={handleSignIn}>
              <input
                type="email"
                name="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn">Sign In</button>
            </form>
          )}
  
          {/* Kayıt Formu */}
          {view === 'signUp' && (
            <form onSubmit={handleSignUp}>
              <input
                type="text"
                name="name"
                placeholder="Adınız"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="surname"
                placeholder="Soyadınız"
                value={formData.surname}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="weight"
                placeholder="Kilonuz (kg)"
                value={formData.weight}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="height"
                placeholder="Boyunuz (cm)"
                value={formData.height}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Yaşınız"
                value={formData.age}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="gender"
                placeholder="Cinsiyet (Erkek/Kadın)"
                value={formData.gender}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn">Sign Up</button>
            </form>
          )}
  
          {/* Sayfa Geçiş Bağlantısı */}
          {view !== null && (
            <div className="switch-container">
              <p className="switch-link" onClick={() => setView(view === 'signUp' ? 'signIn' : 'signUp')}>
                {view === 'signUp' ? 'Hesabınız var mı? Giriş Yapın' : 'Hesabınız yok mu? Kayıt Olun'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
};



export default LoginScreen;