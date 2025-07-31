// Define the RiskFactor type used in the application
export interface RiskFactor {
  age?: number;
  gender?: string;
  bmi?: number;
  blood_pressure?: number;  // Changed from string to number
  cholesterol?: number;     // Changed from string to number
  smoking?: boolean;
  physical_activity?: string;
  // Add other relevant properties based on your application's needs
}
