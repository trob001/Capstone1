import { RiskFactor } from '@/app/types/risk';
import Papa from 'papaparse';

interface HealthData {
  Outcome: string;
  'Grouping category': string;
  Group: string;
  Percentage: string;
  'Confidence Interval': string;
  Title: string;
  Description: string;
  Year: string;
}

const healthData: HealthData[] = [];

// Load and parse CSV data
export const loadHealthData = async () => {
  try {
    // In a Next.js API route, we need to use the file system to read the CSV
    const fs = require('fs');
    const path = require('path');
    
    // Get the absolute path to the CSV file
    const csvPath = path.join(process.cwd(), 'app', 'data', 'health_data.csv');
    const csv = fs.readFileSync(csvPath, 'utf8');
    
    const parsed = Papa.parse(csv, { 
      header: true,
      skipEmptyLines: true
    });
    
    if (parsed.errors.length > 0) {
      console.error('Error parsing CSV:', parsed.errors);
      throw new Error('Failed to parse health data CSV');
    }
    
    // Clear existing data and add new parsed data
    healthData.length = 0;
    healthData.push(...(parsed.data as HealthData[]));
  } catch (error) {
    console.error('Error loading health data:', error);
    throw new Error('Failed to load health data');
  }
};

export const predict_risk = async (input: RiskFactor) => {
  // Load health data if not already loaded
  if (healthData.length === 0) {
    await loadHealthData();
  }

  // Calculate risk based on age and other factors
  let baseRisk = 0.05; // Base risk percentage
  
  // Adjust risk based on age
  if (input.age < 35) {
    baseRisk *= 0.5;
  } else if (input.age >= 65) {
    baseRisk *= 2;
  }
  
  // Adjust risk based on BMI
  if (input.bmi > 30) {
    baseRisk *= 1.5;
  }
  
  // Adjust risk based on blood pressure
  if (input.blood_pressure > 130) {
    baseRisk *= 1.3;
  }
  
  // Adjust risk based on cholesterol
  if (input.cholesterol > 200) {
    baseRisk *= 1.2;
  }
  
  // Adjust risk based on smoking
  if (input.smoking) {
    baseRisk *= 1.8;
  }
  
  // Adjust risk based on physical activity
  if (!input.physical_activity) {
    baseRisk *= 1.4;
  }
  
  // Get relevant health data entries
  const relevantData = healthData.filter(data => {
    return parseInt(data.Year) === 2019 && 
           data['Grouping category'] === 'Age groups with 65+';
  });
  
  // Find closest age group
  let closestAgeGroup = relevantData[0];
  let minDiff = Math.abs(input.age - parseInt(closestAgeGroup.Group.split('-')[0]));
  
  for (const entry of relevantData) {
    const ageGroup = entry.Group.split('-');
    const age = parseInt(ageGroup[0]);
    const diff = Math.abs(input.age - age);
    
    if (diff < minDiff) {
      minDiff = diff;
      closestAgeGroup = entry;
    }
  }
  
  // Adjust risk based on closest age group data
  const ageGroupRisk = parseFloat(closestAgeGroup.Percentage) / 100;
  baseRisk = (baseRisk + ageGroupRisk) / 2;
  
  // Determine risk level
  let riskLevel: string;
  if (baseRisk < 0.1) {
    riskLevel = 'low';
  } else if (baseRisk < 0.3) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'high';
  }

  // Generate recommendations based on risk factors
  const recommendations = [];
  
  if (input.bmi > 30) {
    recommendations.push('Consider dietary changes and regular exercise to manage weight');
  }
  
  if (input.blood_pressure > 130) {
    recommendations.push('Monitor blood pressure regularly and consult healthcare provider');
  }
  
  if (input.cholesterol > 200) {
    recommendations.push('Consider dietary changes to reduce cholesterol levels');
  }
  
  if (input.smoking) {
    recommendations.push('Consider smoking cessation programs for better health');
  }
  
  if (!input.physical_activity) {
    recommendations.push('Increase physical activity levels gradually');
  }

  return {
    risk_level: riskLevel,
    probability: baseRisk,
    recommendations: recommendations,
    age_group_risk: parseFloat(closestAgeGroup.Percentage),
    base_risk: baseRisk
  };
};
export type { RiskFactor };

