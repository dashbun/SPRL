import React from 'react';

interface PredictionChartProps {
  imagePath: string;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ imagePath }) => {
  return (
    <div className="prediction-chart">
      <img 
        src={`${imagePath}?t=${new Date().getTime()}`} 
        alt="LSTM Prediction Results" 
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
      />
    </div>
  );
};

export default PredictionChart;