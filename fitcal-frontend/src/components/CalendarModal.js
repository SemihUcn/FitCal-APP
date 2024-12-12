// src/components/CalendarModal.js
import React, { useState } from 'react';

const CalendarModal = ({ onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleMonthChange = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const daysOfWeek = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        width: '90%',
        maxWidth: '500px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}>✖</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => handleMonthChange(-1)} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: '#007bff',
            transition: 'color 0.3s ease',
          }}>◀</button>
          <h2 style={{ textAlign: 'center', color: '#007bff', fontWeight: 'bold', fontSize: '1.25rem' }}>{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}</h2>
          <button onClick={() => handleMonthChange(1)} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: '#007bff',
            transition: 'color 0.3s ease',
          }}>▶</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {daysOfWeek.map((day, index) => (
            <div key={index} style={{
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#007bff',
            }}>{day}</div>
          ))}
          {[...Array(firstDay).keys()].map((_, index) => (
            <div key={index} style={{ padding: '10px' }}></div>
          ))}
          {[...Array(daysInMonth).keys()].map((day) => (
            <div key={day} style={{
              padding: '10px',
              backgroundColor: '#f3f3f3',
              textAlign: 'center',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}>
              {day + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;