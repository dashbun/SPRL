// Mock API service for the disease prediction application
// In a real application, these would make actual API calls to a backend server

// Helper function to simulate API delay
const simulateApiDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generate synthetic epidemic data
export const fetchEpidemicData = async () => {
  await simulateApiDelay(1500);
  
  // Generate synthetic data for demonstration
  const data = [];
  const startDate = new Date('2023-01-01');
  const days = 365;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Calculate day of year (0-364)
    const dayOfYear = i;
    
    // Create seasonal pattern with random noise
    const seasonalFactor = Math.sin((dayOfYear / 365) * Math.PI * 2);
    
    // Disease cases with seasonal pattern
    const baseCases = 100 + 50 * seasonalFactor;
    const randomVariation = Math.random() * 30 - 15; // Random variation between -15 and 15
    const outbreakSpike = Math.random() > 0.9 ? Math.random() * 100 : 0; // Occasional outbreaks
    const cases = Math.max(0, baseCases + randomVariation + outbreakSpike);
    
    // Environmental factors
    const temperature = 20 + 15 * seasonalFactor + (Math.random() * 5 - 2.5);
    const humidity = 60 + 20 * seasonalFactor + (Math.random() * 10 - 5);
    const rainfall = Math.max(0, 5 + 10 * seasonalFactor + (Math.random() * 15));
    
    // Demographic factors
    const populationDensity = 1000 + Math.random() * 200 - 100;
    const mobilityIndex = 50 + 10 * seasonalFactor + Math.random() * 10 - 5;
    
    // Determine if this is an outbreak day (arbitrary threshold for demo)
    const isOutbreak = cases > 150 ? 1 : 0;
    
    data.push({
      date: date.toISOString().split('T')[0],
      cases,
      temperature,
      humidity,
      rainfall,
      population_density: populationDensity,
      mobility_index: mobilityIndex,
      outbreak: isOutbreak
    });
  }
  
  return data;
};

// Train SVM model
export const trainSvmModel = async () => {
  await simulateApiDelay(2000);
  
  // Simulated model results
  return {
    status: 'success',
    accuracy: 0.87,
    report: {
      '0': {
        precision: 0.89,
        recall: 0.92,
        f1_score: 0.905
      },
      '1': {
        precision: 0.83,
        recall: 0.78,
        f1_score: 0.805
      }
    },
    feature_importance: [
      { feature: 'temperature', importance: 0.23 },
      { feature: 'humidity', importance: 0.18 },
      { feature: 'rainfall', importance: 0.15 },
      { feature: 'population_density', importance: 0.12 },
      { feature: 'mobility_index', importance: 0.20 },
      { feature: 'cases_lag_1', importance: 0.35 },
      { feature: 'cases_lag_2', importance: 0.28 },
      { feature: 'cases_lag_3', importance: 0.21 },
      { feature: 'temp_lag_1', importance: 0.14 },
      { feature: 'humidity_lag_1', importance: 0.12 },
      { feature: 'rainfall_lag_1', importance: 0.10 },
      { feature: 'mobility_lag_1', importance: 0.16 },
      { feature: 'temp_lag_2', importance: 0.09 },
      { feature: 'humidity_lag_2', importance: 0.08 },
      { feature: 'rainfall_lag_2', importance: 0.07 }
    ]
  };
};

// Generate Self-Organizing Map
export const generateSom = async () => {
  await simulateApiDelay(3000);
  
  // Generate synthetic SOM data
  const gridSize = 10;
  const somData = [];
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      // Generate random weights (simplified for demo)
      const weight = Math.random();
      const isOutbreak = Math.random() > 0.8; // 20% chance of being an outbreak node
      
      somData.push({
        x,
        y,
        weight: [weight],
        isOutbreak
      });
    }
  }
  
  return {
    status: 'success',
    data: somData,
    gridSize
  };
};

// Train LSTM model
export const trainLstmModel = async () => {
  await simulateApiDelay(4000);
  
  // Generate synthetic forecast data
  const futurePredictions = [];
  const baseCases = 120;
  for (let i = 0; i < 8; i++) {
    // Slight upward trend with randomness
    const prediction = baseCases + (i * 5) + (Math.random() * 20 - 10);
    futurePredictions.push(prediction);
  }
  
  return {
    status: 'success',
    rmse: 12.7,
    train_loss: 0.0234,
    test_loss: 0.0312,
    future_predictions: futurePredictions,
    prediction_image: 'https://images.pexels.com/photos/669118/pexels-photo-669118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    forecast_image: 'https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };
};

// Make outbreak prediction
export const makeOutbreakPrediction = async (formData: any) => {
  await simulateApiDelay(1500);
  
  // Create a pseudo-random but deterministic prediction based on input values
  // This is just for demonstration - a real app would use the trained models
  
  // Simple weighted calculation for demo purposes
  const temperatureFactor = formData.temperature > 25 ? 0.2 : 0.1;
  const humidityFactor = formData.humidity > 70 ? 0.25 : 0.15;
  const rainfallFactor = formData.rainfall > 20 ? 0.2 : 0.1;
  const populationFactor = formData.population_density > 1500 ? 0.25 : 0.15;
  const mobilityFactor = formData.mobility_index > 70 ? 0.2 : 0.1;
  
  let probability = (
    temperatureFactor + 
    humidityFactor + 
    rainfallFactor + 
    populationFactor + 
    mobilityFactor
  ) / 1.5;
  
  // Ensure probability is between 0 and 1
  probability = Math.min(Math.max(probability, 0), 1);
  
  // Determine risk level
  let riskLevel = 'Low';
  if (probability > 0.7) {
    riskLevel = 'High';
  } else if (probability > 0.4) {
    riskLevel = 'Medium';
  }
  
  // Calculate predicted cases based on input factors
  const predictedCases = (
    80 + 
    (formData.temperature * 1.5) + 
    (formData.humidity * 0.5) + 
    (formData.rainfall * 0.8) + 
    (formData.population_density * 0.01) + 
    (formData.mobility_index * 0.7)
  );
  
  return {
    outbreak_probability: probability,
    outbreak_prediction: probability > 0.5 ? 1 : 0,
    predicted_cases: predictedCases,
    risk_level: riskLevel
  };
};