"use client";

import React, { useState } from "react";

interface UserInput {
  age: number;
  bmi: number;
  blood_pressure: number;
  cholesterol: number;
  smoking: number;
  physical_activity: number;
}

export default function HealthRiskForm() {
  const [userInput, setUserInput] = useState<UserInput>({
    age: 30,
    bmi: 25,
    blood_pressure: 120,
    cholesterol: 180,
    smoking: 0,
    physical_activity: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <form>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 300 }}>
        <label>
            <p>Age:</p>
          <input
            name="age"
            type="number"
            value={userInput.age}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>

        <label>
            <p> BMI:</p>
          <input
            name="bmi"
            type="number"
            value={userInput.bmi}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>
        
        <label>
            <p>Blood Pressure:</p>
          <input
            name="blood_pressure"
            type="number"
            value={userInput.blood_pressure}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>
    
        <label>
              <p>Cholesterol:</p>
          <input
            name="cholesterol"
            type="number"
            value={userInput.cholesterol}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>

        <label>
            <p>Smoking (0 = No, 1 = Yes):</p>
          <input
            name="smoking"
            type="number"
            value={userInput.smoking}
            onChange={handleChange}
            min={0}
            max={1}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          <p>Physical Activity (0 = No, 1 = Yes):</p>
          <input
            name="physical_activity"
            type="number"
            value={userInput.physical_activity}
            onChange={handleChange}
            min={0}
            max={1}
            style={{ width: "100%" }}
          />
        </label>
      </div>
    </form>
  );
}