"use client";

import { useState } from "react";

const HealthDataPredictor = () => {
  const [formData, setFormData] = useState({
    age: 0,
    bmi: 0,
    blood_pressure: 0,
    cholesterol: 0,
    smoking: 0,
    physical_activity: 1,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "checkbox" ? (e.target.checked ? 1 : 0) : Number(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/predict-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Error fetching risk prediction" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-blue-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Health Risk Predictor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>
          Age:
          <input name="age" type="number" value={formData.age} onChange={handleChange} min={0} className="ml-2 p-1 border rounded" />
        </label>
        <label>
          BMI:
          <input name="bmi" type="number" value={formData.bmi} onChange={handleChange} min={0} step="0.1" className="ml-2 p-1 border rounded" />
        </label>
        <label>
          Blood Pressure:
          <input name="blood_pressure" type="number" value={formData.blood_pressure} onChange={handleChange} min={0} className="ml-2 p-1 border rounded" />
        </label>
        <label>
          Cholesterol:
          <input name="cholesterol" type="number" value={formData.cholesterol} onChange={handleChange} min={0} className="ml-2 p-1 border rounded" />
        </label>
        <label>
          Smoking:
          <input name="smoking" type="checkbox" checked={formData.smoking === 1} onChange={handleChange} className="ml-2" />
        </label>
        <label>
          Physical Activity:
          <input name="physical_activity" type="checkbox" checked={formData.physical_activity === 1} onChange={handleChange} className="ml-2" />
        </label>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Calculating..." : "Predict Risk"}
        </button>
      </form>

      {result && !result.error && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Risk Level: {result.risk_level}</h3>
          <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
          <p>Age Group Risk: {result.age_group_risk}%</p>
          <p>Recommendations:</p>
          <ul className="list-disc list-inside">
            {result.recommendations.map((rec: string, i: number) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {result?.error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">{result.error}</div>
      )}
    </section>
  );
};

export default HealthDataPredictor;
