import React, { useState } from 'react';
import MealSearchPage from './MealSearchPage';

const ParentComponent = () => {
  const [meals, setMeals] = useState([]);

  const handleAddMeal = (meal) => {
    setMeals((prevMeals) => [...prevMeals, meal]);
    console.log('Eklenen Yemek:', meal);
  };

  return (
    <MealSearchPage onClose={() => console.log('Geri Dön')} onAddMeal={handleAddMeal} />
  );
};

export default ParentComponent;
