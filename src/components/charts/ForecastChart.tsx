import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastChartProps {
  imagePath: string;
  predictions: number[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ imagePath, predictions }) => {
  // Option 1: Use the image from the backend
  if (imagePath) {
    return (
      <div className="forecast-chart">
        <img 
          src={`${imagePath}?t=${new Date().getTime()}`} 
          alt="Disease Forecast" 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
        />
      </div>
    );
  }
  
  // Option 2: Create a chart from prediction data
  const chartData = predictions.map((value, index) => ({
    week: `Week ${index + 1}`,
    cases: Math.round(value)
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} cases`, 'Predicted']} />
        <Line 
          type="monotone" 
          dataKey="cases" 
          stroke="#1a73e8" 
          strokeWidth={2}
          dot={{ r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ForecastChart;