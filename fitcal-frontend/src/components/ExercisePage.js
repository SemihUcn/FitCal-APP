import React, { useState } from "react";
import "./ExercisePage.css";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Exercises = ({ onClose }) => {
  const allExercises = [
    { name: "Koşu", baseCalories: 500 },
    { name: "Yüzme", baseCalories: 600 },
    { name: "Yoga", baseCalories: 300 },
    { name: "Bisiklet", baseCalories: 450 },
  ];

  const [exercises, setExercises] = useState(allExercises);
  const [searchTerm, setSearchTerm] = useState("");
  const [durations, setDurations] = useState(
    allExercises.map(() => ({ hour: 0, minute: 0 }))
  );
  const { userId } = useContext(UserContext);

  const [addedExercises, setAddedExercises] = useState([]); // Eklenen aktiviteler

  // Arama işlevi
  const handleSearch = () => {
    const filtered = allExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setExercises(filtered);
  };

  // Süre değişimi
  const handleTimeChange = (index, type, value) => {
    const newDurations = [...durations];
    newDurations[index][type] = value;
    setDurations(newDurations);
  };

  // Kalori hesaplama
  const calculateCalories = (index) => {
    const { hour, minute } = durations[index];
    const totalMinutes = Number(hour) * 60 + Number(minute);
    const caloriesPerMinute = exercises[index].baseCalories / 60;
    return Math.round(totalMinutes * caloriesPerMinute);
  };

  // Aktivite ekleme
  const handleAddExercise = async (index) => {
    const newExercise = {
        user_id: userId, // Replace with the logged-in user's ID
        name: exercises[index].name,
        duration: `${durations[index].hour} saat ${durations[index].minute} dakika`,
        calories: calculateCalories(index),
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/api/add_exercise_entry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExercise),
        });

        if (response.ok) {
            fetchExerciseEntries(); // Refresh the list
        } else {
            console.error("Failed to add exercise entry");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};
const fetchExerciseEntries = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/get_exercise_entries?user_id=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch exercise entries");
    const data = await response.json();
    setAddedExercises(data);
  } catch (error) {
    console.error("Error fetching exercise entries:", error);
  }
};


React.useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(`http://127.0.0.1:5000/api/get_exercise_entries?user_id=${userId}`);
    if (response.ok) {
      const data = await response.json();
      setAddedExercises(data);
    }
  };
  fetchData();
}, []);


  return (
    <div className="exercise-page">
      <h2 className="exercise-header">Egzersiz Ekle</h2>
      <button className="back-button" onClick={onClose}>
        Geri Dön
      </button>

      {/* Arama Kutusu */}
      <div className="search-container">
        <input
          type="text"
          className="exercise-search-input"
          placeholder="Egzersiz ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Ara
        </button>
      </div>

      {/* Egzersiz Tablosu */}
      <table className="exercise-table">
        <thead>
          <tr>
            <th>Egzersiz</th>
            <th>Süre (Saat / Dakika)</th>
            <th>Yakılan Kalori</th>
            <th>Ekle</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise, index) => (
            <tr key={index}>
              <td>{exercise.name}</td>
              <td>
                <div className="time-inputs">
                  <select
                    className="duration-select"
                    value={durations[index]?.hour}
                    onChange={(e) => handleTimeChange(index, "hour", e.target.value)}
                  >
                    {[...Array(25).keys()].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    className="duration-select"
                    value={durations[index]?.minute}
                    onChange={(e) =>
                      handleTimeChange(index, "minute", e.target.value)
                    }
                  >
                    {[...Array(60).keys()].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td>{calculateCalories(index)}</td>
              <td>
                <button
                  className="add-button"
                  onClick={() => handleAddExercise(index)}
                >
                  Ekle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Eklenen Egzersizler */}
      <div className="added-exercises">
        <h3>Eklenen Egzersizler</h3>
        <ul>
          {addedExercises.map((exercise, idx) => (
            <li key={idx}>
              {exercise.name} - {exercise.duration} - {exercise.calories} Kalori
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Exercises;
