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
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';




const LoginScreen = () => {
  const { setUserId  ,userId  } = useContext(UserContext);
  const [view, setView] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState('daily');
  


  const renderPage = () => {
    switch (currentPage) {
      case 'Günlük Takip':
        return <DailyPage />;
      case 'Raporlar':
        return <ReportPage />;
      case 'Diyet Planı':
        return <AddPage />;
      case 'Topluluk':
        return <CommunityPage />;
      case 'Profil':
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
        setUserId(data.user_id);
  
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
          user_id:userId,
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
      {['Günlük Takip', 'Raporlar', 'Diyet Planı', 'Topluluk', 'Profil'].map((page) => (
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
      <div className="login-screen__survey-container">
        <h2 className="login-screen__survey-title">FitCal Kişisel Anket</h2>
        <form className="login-screen__survey-form">
          <label>Günlük Aktivite Seviyesi:</label>
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
  
          <label>Diyet Tercihi:</label>
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
  
          <label>Hedef Kilo:</label>
          <input
            type="number"
            name="targetWeight"
            placeholder="Kilo (kg)"
            value={surveyData.targetWeight}
            onChange={handleSurveyChange}
            required
          />
  
          <label>Egzersiz Sıklığı:</label>
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
  
          <button
            type="button"
            className="login-screen__survey-button"
            onClick={handleSurveySubmit}
          >
            Kaydet
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className="login-screen__container">
      <Header />
  ""
      {/* Kullanıcı giriş yapmış ve anket tamamlanmışsa */}
      {isAuthenticated && surveyCompleted ? (
        <>
          {renderPage()} {/* Sayfanın içeriğini gösterir */}
          {renderBottomNav()} {/* Alt navigasyon butonlarını gösterir */}
        </>
      ) : (
        <div className="login-screen__box">
          <div className="login-screen__image-container">
            <img src={fitcalImage} alt="FitCal'a Hoşgeldiniz" className="login-screen__image" />
          </div>
          <h2 className="login-screen__title">FitCal'a Hoşgeldiniz</h2>
  
          {/* Giriş Ekranı */}
          {view === null && (
            <div className="login-screen__button-container">
              <button
                className="login-screen_button login-screen_button--signin"
                onClick={() => setView('signIn')}
              >
                Sign In
              </button>
              <button
                className="login-screen_button login-screen_button--signup"
                onClick={() => setView('signUp')}
              >
                Sign Up
              </button>
            </div>
          )}
  
          {/* Giriş Formu */}
          {view === 'signIn' && (
            <form className="login-screen__form" onSubmit={handleSignIn}>
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
              <button type="submit" className="login-screen__form-button">Sign In</button>
            </form>
          )}
  
          {/* Kayıt Formu */}
          {view === 'signUp' && (
            <form className="login-screen__form" onSubmit={handleSignUp}>
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
              <button type="submit" className="login-screen__form-button">Sign Up</button>
            </form>
          )}
  
          {/* Sayfa Geçiş Bağlantısı */}
          {view !== null && (
            <p
              className="login-screen__switch-link"
              onClick={() => setView(view === 'signUp' ? 'signIn' : 'signUp')}
            >
              {view === 'signUp'
                ? 'Hesabınız var mı? Giriş Yapın'
                : 'Hesabınız yok mu? Kayıt Olun'}
            </p>
          )}
        </div>
      )}
    </div>
  );
  
  
};

export default LoginScreen;