import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeatureImportance {
  feature: string;
  importance: number;
}

interface FeatureImportanceChartProps {
  featureImportance: FeatureImportance[];
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ featureImportance }) => {
  // Sort and slice to get top 10 features by importance
  const sortedData = [...featureImportance]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10)
    .map(item => ({
      ...item,
      // Shorten feature names for better display
      feature: item.feature.length > 15 
        ? `${item.feature.substring(0, 12)}...` 
        : item.feature
    }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="feature" tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value: number) => [value.toFixed(4), 'Importance']}
          labelFormatter={(label) => `Feature: ${label}`}
        />
        <Bar dataKey="importance" fill="#1a73e8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeatureImportanceChart;