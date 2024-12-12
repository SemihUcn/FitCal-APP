import React, { createContext, useState } from 'react';

export const MealsContext = createContext();

export const MealsProvider = ({ children }) => {
  const [addedMeals, setAddedMeals] = useState([]);

  const addMeal = (meal) => {
    setAddedMeals((prevMeals) => [...prevMeals, meal]);
  };

  return (
    <MealsContext.Provider value={{ addedMeals, addMeal }}>
      {children}
    </MealsContext.Provider>
  );
};
