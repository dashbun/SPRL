import React, { useState } from 'react';
import { trainSvmModel, generateSom, trainLstmModel } from '../services/api';
import ModelTrainingCard from '../components/ModelTrainingCard';
import ModelResultCard from '../components/ModelResultCard';
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart';
import PredictionChart from '../components/charts/PredictionChart';
import ForecastChart from '../components/charts/ForecastChart';
import SOMVisualization from '../components/charts/SOMVisualization';
import './Models.css';

const Models: React.FC = () => {
  const [svmResults, setSvmResults] = useState<any>(null);
  const [svmLoading, setSvmLoading] = useState(false);
  const [svmError, setSvmError] = useState<string | null>(null);
  
  const [somResults, setSomResults] = useState<any>(null);
  const [somLoading, setSomLoading] = useState(false);
  const [somError, setSomError] = useState<string | null>(null);
  
  const [lstmResults, setLstmResults] = useState<any>(null);
  const [lstmLoading, setLstmLoading] = useState(false);
  const [lstmError, setLstmError] = useState<string | null>(null);
  
  const handleTrainSvm = async () => {
    try {
      setSvmLoading(true);
      setSvmError(null);
      const data = await trainSvmModel();
      setSvmResults(data);
      setSvmLoading(false);
    } catch (error) {
      setSvmError('Failed to train SVM model');
      setSvmLoading(false);
    }
  };
  
  const handleGenerateSom = async () => {
    try {
      setSomLoading(true);
      setSomError(null);
      const data = await generateSom();
      setSomResults(data);
      setSomLoading(false);
    } catch (error) {
      setSomError('Failed to generate SOM');
      setSomLoading(false);
    }
  };
  
  const handleTrainLstm = async () => {
    try {
      setLstmLoading(true);
      setLstmError(null);
      const data = await trainLstmModel();
      setLstmResults(data);
      setLstmLoading(false);
    } catch (error) {
      setLstmError('Failed to train LSTM model');
      setLstmLoading(false);
    }
  };
  
  return (
    <div className="models-page">
      <h1>Machine Learning Models</h1>
      <p className="models-intro">
        Train and visualize different machine learning models for disease outbreak prediction.
      </p>
      
      <div className="model-actions">
        <button 
          className="button primary"
          onClick={handleTrainSvm}
          disabled={svmLoading}
        >
          {svmLoading ? 'Training...' : 'Train SVM Model'}
        </button>
        <button 
          className="button primary"
          onClick={handleGenerateSom}
          disabled={somLoading}
        >
          {somLoading ? 'Generating...' : 'Generate SOM'}
        </button>
        <button 
          className="button primary"
          onClick={handleTrainLstm}
          disabled={lstmLoading}
        >
          {lstmLoading ? 'Training...' : 'Train LSTM Model'}
        </button>
      </div>
      
      <div className="models-grid">
        {/* SVM Model Section */}
        <ModelTrainingCard
          title="Support Vector Machine"
          description="Classification model for outbreak prediction based on environmental and demographic factors."
          loading={svmLoading}
          error={svmError}
          trainingAction={handleTrainSvm}
        >
          {svmResults && (
            <>
              <div className="metrics-grid">
                <div className="metric">
                  <div className="metric-value">{(svmResults.accuracy * 100).toFixed(1)}%</div>
                  <div className="metric-label">Accuracy</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{(svmResults.report['1'].precision * 100).toFixed(1)}%</div>
                  <div className="metric-label">Precision</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{(svmResults.report['1'].recall * 100).toFixed(1)}%</div>
                  <div className="metric-label">Recall</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{(svmResults.report['1'].f1_score * 100).toFixed(1)}%</div>
                  <div className="metric-label">F1 Score</div>
                </div>
              </div>
              
              <h4>Top Features by Importance</h4>
              <div className="chart-container">
                <FeatureImportanceChart featureImportance={svmResults.feature_importance} />
              </div>
            </>
          )}
        </ModelTrainingCard>
        
        {/* SOM Model Section */}
        <ModelTrainingCard
          title="Self-Organizing Map"
          description="Visualization of data clusters and patterns in the epidemiological dataset."
          loading={somLoading}
          error={somError}
          trainingAction={handleGenerateSom}
        >
          {somResults && (
            <>
              <p className="som-description">
                The SOM visualizes clusters in the data. Red points represent outbreak nodes, 
                while the color intensity represents the weight values of the nodes.
              </p>
              <div className="som-visualization">
                <SOMVisualization 
                  data={somResults.data}
                  gridSize={somResults.gridSize}
                  width={500}
                  height={500}
                />
              </div>
            </>
          )}
        </ModelTrainingCard>
        
        {/* LSTM Model Section */}
        <ModelResultCard
          title="LSTM Time Series Prediction"
          loading={lstmLoading}
          error={lstmError}
        >
          {lstmResults && (
            <>
              <div className="metrics-grid">
                <div className="metric">
                  <div className="metric-value">{lstmResults.rmse.toFixed(2)}</div>
                  <div className="metric-label">RMSE</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{lstmResults.train_loss.toFixed(4)}</div>
                  <div className="metric-label">Train Loss</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{lstmResults.test_loss.toFixed(4)}</div>
                  <div className="metric-label">Test Loss</div>
                </div>
              </div>
              
              <h4>Actual vs Predicted</h4>
              <div className="chart-container">
                <PredictionChart imagePath={lstmResults.prediction_image} />
              </div>
            </>
          )}
        </ModelResultCard>
        
        {/* Forecast Section */}
        <ModelResultCard
          title="Disease Forecast"
          loading={lstmLoading}
          error={lstmError}
        >
          {lstmResults && (
            <>
              <h4>8-Week Forecast</h4>
              <div className="forecast-data">
                {lstmResults.future_predictions.map((prediction: number, index: number) => (
                  <div key={index} className="forecast-week">
                    <span className="forecast-label">Week {index + 1}:</span>
                    <span className="forecast-value">{Math.round(prediction)} cases</span>
                  </div>
                ))}
              </div>
              
              <div className="chart-container">
                <ForecastChart 
                  imagePath={lstmResults.forecast_image}
                  predictions={lstmResults.future_predictions}
                />
              </div>
            </>
          )}
        </ModelResultCard>
      </div>
    </div>
  );
};

export default Models;