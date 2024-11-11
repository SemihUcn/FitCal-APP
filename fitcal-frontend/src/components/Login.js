import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Giriş başarılı!');
      } else {
        alert('E-posta veya şifre hatalı!');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="E-posta" value={formData.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleChange} />
      <button type="submit">Giriş Yap</button>
    </form>
  );
};

export default Login;
