import React, { useState } from 'react';
import './LoginScreen.css';
import fitcalImage from '../assets/ana_giris_foto.jpg';

const LoginScreen = () => {
  const [view, setView] = useState(null); // Kullanıcı Sign In veya Sign Up seçimi yapana kadar null
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kullanıcı kimliği doğrulandığında true olacak

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
    // Giriş başarılıysa uygulamanın ana sayfasına yönlendirme (aşağıda 4 buton bulunan bir ekran gösteriyoruz)
    return (
      <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <button style={{ margin: '10px', padding: '10px 20px' }}>Lionel Messi</button>
          <button style={{ margin: '10px', padding: '10px 20px' }}>Cristiano Ronaldo</button>
          <button style={{ margin: '10px', padding: '10px 20px' }}>Neymar Jr</button>
          <button style={{ margin: '10px', padding: '10px 20px' }}>Kylian Mbappe</button>
        </div>
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
