// AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [meals, setMeals] = useState([]); // Tüm öğün verilerini saklar

  const addMeal = (meal) => {
    setMeals((prevMeals) => [...prevMeals, meal]);
  };

  return (
    <AppContext.Provider value={{ meals, addMeal }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;