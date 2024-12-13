import React, { useState } from "react";
import "./ExercisePage.css";

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
  const handleAddExercise = (index) => {
    const newExercise = {
      name: exercises[index].name,
      duration: `${durations[index].hour} saat ${durations[index].minute} dakika`,
      calories: calculateCalories(index),
    };
    setAddedExercises([...addedExercises, newExercise]);

    // Süreyi sıfırla
    const newDurations = [...durations];
    newDurations[index] = { hour: 0, minute: 0 };
    setDurations(newDurations);
  };

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
