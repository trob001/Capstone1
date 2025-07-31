"use client";

import { useState } from "react";

export default function HealthRiskPage() {
  const [userInput, setUserInput] = useState({
    age: 30,
    bmi: 25,
    blood_pressure: 120,
    cholesterol: 180,
    smoking: 0,
    physical_activity: 1,
  });
  const [result, setResult] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/predict-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInput),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Predict Your Health Risk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>
          Age:
          <input
            name="age"
            type="number"
            value={userInput.age}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <label>
          BMI:
          <input
            name="bmi"
            type="number"
            value={userInput.bmi}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <label>
          Blood Pressure:
          <input
            name="blood_pressure"
            type="number"
            value={userInput.blood_pressure}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <label>
          Cholesterol:
          <input
            name="cholesterol"
            type="number"
            value={userInput.cholesterol}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <label>
          Smoking (1 = Yes, 0 = No):
          <input
            name="smoking"
            type="number"
            value={userInput.smoking}
            onChange={handleChange}
            className="border p-2 w-full"
            min={0}
            max={1}
          />
        </label>
        <label>
          Physical Activity (1 = Yes, 0 = No):
          <input
            name="physical_activity"
            type="number"
            value={userInput.physical_activity}
            onChange={handleChange}
            className="border p-2 w-full"
            min={0}
            max={1}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Predict Risk
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold text-lg mb-2">Prediction Result</h2>
          <p>Risk Level: {result.risk_level}</p>
          <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
          <p>Recommendations:</p>
          <ul className="list-disc list-inside">
            {result.recommendations.map((rec: string, idx: number) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
