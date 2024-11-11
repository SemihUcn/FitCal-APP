import React from 'react';
import './LoginScreen.css';
import appIcon from '../assets/ana_giris_foto.jpg';

const LoginScreen = () => {
  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="app-icon">
          <img src={appIcon} alt="App Icon" />
        </div>
        <h2>FitCal'a HosGeldiniz</h2>
        <p></p>
        <div className="button-container">
          <button className="btn sign-in">Sign In</button>
          <button className="btn sign-up">Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
