import React, { useState } from 'react';
import { makeOutbreakPrediction } from '../services/api';
import { AlertCircle, Thermometer, Droplets, Cloud, Users, Map } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './Predict.css';

interface PredictionFormData {
  temperature: number;
  humidity: number;
  rainfall: number;
  population_density: number;
  mobility_index: number;
}

interface PredictionResult {
  outbreak_probability: number;
  outbreak_prediction: number;
  predicted_cases: number;
  risk_level: string;
}

const Predict: React.FC = () => {
  const [formData, setFormData] = useState<PredictionFormData>({
    temperature: 20,
    humidity: 60,
    rainfall: 5,
    population_density: 1000,
    mobility_index: 50
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      const result = await makeOutbreakPrediction(formData);
      setPrediction(result);
      setLoading(false);
    } catch (err) {
      setError('Failed to make prediction. Please try again.');
      setLoading(false);
    }
  };
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#1a73e8';
    }
  };
  
  const getRecommendation = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return 'Activate outbreak response protocols immediately. Implement control measures and public health interventions.';
      case 'Medium':
        return 'Increase surveillance activities and prepare for potential outbreak response. Consider public health advisories.';
      case 'Low':
        return 'Continue routine surveillance. No additional measures needed at this time.';
      default:
        return 'Insufficient data for recommendations.';
    }
  };
  
  return (
    <div className="predict-page">
      <h1>Disease Outbreak Prediction</h1>
      <p className="predict-intro">
        Enter environmental and demographic data to predict the likelihood of a disease outbreak.
      </p>
      
      <div className="prediction-container">
        <div className="prediction-form">
          <h3>Input Parameters</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="temperature">
                <Thermometer size={16} className="input-icon" />
                Temperature (°C):
              </label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                min="-20"
                max="50"
                step="0.1"
                value={formData.temperature}
                onChange={handleInputChange}
                required
              />
              <div className="range-indicator">
                <span>-20°C</span>
                <span>50°C</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="humidity">
                <Droplets size={16} className="input-icon" />
                Humidity (%):
              </label>
              <input
                type="number"
                id="humidity"
                name="humidity"
                min="0"
                max="100"
                step="0.1"
                value={formData.humidity}
                onChange={handleInputChange}
                required
              />
              <div className="range-indicator">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="rainfall">
                <Cloud size={16} className="input-icon" />
                Rainfall (mm):
              </label>
              <input
                type="number"
                id="rainfall"
                name="rainfall"
                min="0"
                max="500"
                step="0.1"
                value={formData.rainfall}
                onChange={handleInputChange}
                required
              />
              <div className="range-indicator">
                <span>0mm</span>
                <span>500mm</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="population_density">
                <Users size={16} className="input-icon" />
                Population Density (per km²):
              </label>
              <input
                type="number"
                id="population_density"
                name="population_density"
                min="0"
                max="5000"
                step="1"
                value={formData.population_density}
                onChange={handleInputChange}
                required
              />
              <div className="range-indicator">
                <span>0</span>
                <span>5000</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="mobility_index">
                <Map size={16} className="input-icon" />
                Mobility Index:
              </label>
              <input
                type="number"
                id="mobility_index"
                name="mobility_index"
                min="0"
                max="100"
                step="0.1"
                value={formData.mobility_index}
                onChange={handleInputChange}
                required
              />
              <div className="range-indicator">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="button primary predict-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Predict Outbreak Risk'}
            </button>
          </form>
        </div>
        
        <div className={`prediction-results ${prediction ? 'active' : ''}`}>
          {error && (
            <div className="prediction-error">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          
          {prediction && (
            <>
              <h3>Prediction Results</h3>
              
              <div className="results-grid">
                <div className="result-card risk-card" style={{ borderColor: getRiskColor(prediction.risk_level) }}>
                  <h4>Risk Level</h4>
                  <div className="risk-level" style={{ color: getRiskColor(prediction.risk_level) }}>
                    {prediction.risk_level}
                  </div>
                  <div className="risk-meter">
                    <div 
                      className="risk-meter-fill" 
                      style={{ 
                        width: `${prediction.outbreak_probability * 100}%`,
                        backgroundColor: getRiskColor(prediction.risk_level)
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="result-card probability-card">
                  <h4>Outbreak Probability</h4>
                  <div className="probability-gauge">
                    <div className="probability-value">
                      {(prediction.outbreak_probability * 100).toFixed(1)}%
                    </div>
                    <div className="gauge-chart">
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Probability', value: prediction.outbreak_probability },
                              { name: 'Remaining', value: 1 - prediction.outbreak_probability }
                            ]}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="60%"
                            outerRadius="100%"
                            paddingAngle={0}
                            dataKey="value"
                          >
                            <Cell fill={getRiskColor(prediction.risk_level)} />
                            <Cell fill="#e0e0e0" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="result-card cases-card">
                  <h4>Predicted Cases</h4>
                  <div className="cases-prediction">
                    <div className="cases-value">
                      {Math.round(prediction.predicted_cases)}
                    </div>
                    <div className="cases-label">Expected cases</div>
                  </div>
                </div>
                
                <div className="result-card recommendation-card">
                  <h4>Recommendation</h4>
                  <div className="recommendation">
                    {getRecommendation(prediction.risk_level)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;