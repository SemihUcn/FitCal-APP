import React, { useState } from 'react';
import './LoginScreen.css';
import fitcalImage from '../assets/ana_giris_foto.jpg';

const LoginScreen = () => {
  const [view, setView] = useState(null); // Kullanıcı Sign In veya Sign Up seçimi yapana kadar null
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kullanıcı kimliği doğrulandığında true olacak
  const [surveyData, setSurveyData] = useState({
    dailyActivity: '',
    dietaryPreference: '',
    targetWeight: '',
    exerciseFrequency: '',
  });

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

  if (isAuthenticated) {
    // Giriş başarılıysa uygulamanın ana sayfasına yönlendirme (anket formunu gösteriyoruz)
    return (
      <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', fontWeight: 'bold' }}>FitCal Kişisel Anket</h2>
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: '15px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <label style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
            Günlük Aktivite Seviyesi:
            <select name="dailyActivity" value={surveyData.dailyActivity} onChange={handleSurveyChange} required style={{ marginLeft: '10px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}>
              <option value="">Seçiniz</option>
              <option value="Sedentary">Sedentary (Hareketsiz)</option>
              <option value="Lightly active">Lightly active (Hafif aktif)</option>
              <option value="Moderately active">Moderately active (Orta derece aktif)</option>
              <option value="Very active">Very active (Çok aktif)</option>
            </select>
          </label>
          <label style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
            Diyet Tercihi:
            <select name="dietaryPreference" value={surveyData.dietaryPreference} onChange={handleSurveyChange} required style={{ marginLeft: '10px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}>
              <option value="">Seçiniz</option>
              <option value="Omnivore">Omnivore (Her şey yiyen)</option>
              <option value="Vegetarian">Vegetarian (Vejetaryen)</option>
              <option value="Vegan">Vegan</option>
            </select>
          </label>
          <label style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#555' }}>
            Hedef Kilo (kg):
            <input
              type="number"
              name="targetWeight"
              placeholder="Hedef Kilo"
              value={surveyData.targetWeight}
              onChange={handleSurveyChange}
              required
              style={{ marginLeft: '5px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </label>
          <label style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
            Egzersiz Sıklığı:
            <select name="exerciseFrequency" value={surveyData.exerciseFrequency} onChange={handleSurveyChange} required style={{ marginLeft: '10px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}>
              <option value="">Seçiniz</option>
              <option value="Never">Never (Asla)</option>
              <option value="1-2 times a week">1-2 times a week</option>
              <option value="3-4 times a week">3-4 times a week</option>
              <option value="Daily">Daily (Her gün)</option>
            </select>
          </label>
          <button type="button" onClick={() => setIsAuthenticated('completedSurvey')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>Kaydet</button>
        </form>
      </div>
    );
  }

  if (isAuthenticated === 'completedSurvey') {
    // Kullanıcı anketi tamamladıktan sonra ana sayfaya yönlendirme
    return (
      <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#333' }}>Ana Sayfa (Henüz Boş)</h2>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="image-container">
          <img src={fitcalImage} alt="FitCal'a Hoşgeldiniz" className="login-image" />
        </div>
        <h2>FitCal'a Hoşgeldiniz</h2>
        {view === null && (
          <div className="button-container">
            <button className="btn sign-in" onClick={() => setView('signIn')}>Sign In</button>
            <button className="btn sign-up" onClick={() => setView('signUp')}>Sign Up</button>
          </div>
        )}

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

        {view !== null && (
          <div className="switch-container">
            <p className="switch-link" onClick={() => setView(view === 'signUp' ? 'signIn' : 'signUp')}>
              {view === 'signUp' ? 'Hesabınız var mı? Giriş Yapın' : 'Hesabınız yok mu? Kayıt Olun'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
