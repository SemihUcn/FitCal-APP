import React, { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    weight: '',
    height: ''
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
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Kayıt başarılı!');
      } else {
        alert('Bir hata oluştu, tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Adınız" value={formData.name} onChange={handleChange} />
      <input type="email" name="email" placeholder="E-posta" value={formData.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleChange} />
      <input type="text" name="weight" placeholder="Kilonuz (kg)" value={formData.weight} onChange={handleChange} />
      <input type="text" name="height" placeholder="Boyunuz (cm)" value={formData.height} onChange={handleChange} />
      <button type="submit">Kayıt Ol</button>
    </form>
  );
};

export default SignUp;
