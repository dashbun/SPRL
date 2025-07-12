import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Thermometer, Droplets, Cloud, Users, Map } from 'lucide-react';
import { fetchEpidemicData } from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('cases');
  
  const COLORS = ['#1a73e8', '#4caf50', '#ff9800', '#f44336'];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const epidemicData = await fetchEpidemicData();
        setData(epidemicData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Extract summary statistics
  const calculateSummary = () => {
    if (!data.length) return null;
    
    const totalCases = data.reduce((sum, day) => sum + day.cases, 0);
    const avgCases = totalCases / data.length;
    const maxCases = Math.max(...data.map(day => day.cases));
    
    const outbreakDays = data.filter(day => day.outbreak === 1).length;
    const outbreakPercentage = (outbreakDays / data.length) * 100;
    
    return {
      totalCases: Math.round(totalCases),
      avgCases: Math.round(avgCases),
      maxCases: Math.round(maxCases),
      outbreakDays,
      outbreakPercentage: outbreakPercentage.toFixed(1)
    };
  };

  const summary = calculateSummary();
  
  // Calculate outbreak correlations (simplified)
  const calculateCorrelations = () => {
    if (!data.length) return [];
    
    const factors = [
      { name: 'Temperature', value: calculateMeanDifference('temperature') },
      { name: 'Humidity', value: calculateMeanDifference('humidity') },
      { name: 'Rainfall', value: calculateMeanDifference('rainfall') },
      { name: 'Population Density', value: calculateMeanDifference('population_density') },
      { name: 'Mobility Index', value: calculateMeanDifference('mobility_index') }
    ];
    
    return factors.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  };
  
  // Calculate mean difference between outbreak and non-outbreak days for a factor
  const calculateMeanDifference = (factor: string) => {
    if (!data.length) return 0;
    
    const outbreakValues = data.filter(day => day.outbreak === 1).map(day => day[factor]);
    const nonOutbreakValues = data.filter(day => day.outbreak === 0).map(day => day[factor]);
    
    if (!outbreakValues.length || !nonOutbreakValues.length) return 0;
    
    const outbreakMean = outbreakValues.reduce((sum, val) => sum + val, 0) / outbreakValues.length;
    const nonOutbreakMean = nonOutbreakValues.reduce((sum, val) => sum + val, 0) / nonOutbreakValues.length;
    
    return outbreakMean - nonOutbreakMean;
  };
  
  const correlations = calculateCorrelations();

  // Prepare data for charts based on active tab
  const getCasesChartData = () => {
    if (!data.length) return [];
    return data.slice(0, 30).map(day => ({
      date: new Date(day.date).toLocaleDateString(),
      cases: day.cases,
      outbreak: day.outbreak
    }));
  };
  
  const getEnvironmentalChartData = () => {
    if (!data.length) return [];
    return data.slice(0, 30).map(day => ({
      date: new Date(day.date).toLocaleDateString(),
      temperature: day.temperature,
      humidity: day.humidity,
      rainfall: day.rainfall
    }));
  };
  
  const getDemographicChartData = () => {
    if (!data.length) return [];
    return data.slice(0, 30).map(day => ({
      date: new Date(day.date).toLocaleDateString(),
      populationDensity: day.population_density,
      mobilityIndex: day.mobility_index
    }));
  };
  
  // Calculate outbreak distribution for pie chart
  const getOutbreakDistribution = () => {
    if (!data.length) return [];
    
    const outbreakCount = data.filter(day => day.outbreak === 1).length;
    const nonOutbreakCount = data.length - outbreakCount;
    
    return [
      { name: 'Outbreak', value: outbreakCount },
      { name: 'No Outbreak', value: nonOutbreakCount }
    ];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="button primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Epidemic Data Dashboard</h1>
      
      {summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">
              <Activity size={24} />
            </div>
            <div className="summary-content">
              <h3>{summary.totalCases}</h3>
              <p>Total Cases</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">
              <BarChart2 size={24} />
            </div>
            <div className="summary-content">
              <h3>{summary.avgCases}</h3>
              <p>Average Daily Cases</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="summary-content">
              <h3>{summary.maxCases}</h3>
              <p>Peak Cases</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">
              <AlertCircle size={24} />
            </div>
            <div className="summary-content">
              <h3>{summary.outbreakPercentage}%</h3>
              <p>Outbreak Days</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="chart-tabs">
        <button 
          className={activeTab === 'cases' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('cases')}
        >
          <Activity size={16} />
          <span>Cases</span>
        </button>
        <button 
          className={activeTab === 'environmental' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('environmental')}
        >
          <Thermometer size={16} />
          <span>Environmental</span>
        </button>
        <button 
          className={activeTab === 'demographic' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('demographic')}
        >
          <Users size={16} />
          <span>Demographic</span>
        </button>
        <button 
          className={activeTab === 'analysis' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('analysis')}
        >
          <Brain size={16} />
          <span>Analysis</span>
        </button>
      </div>
      
      <div className="chart-container">
        {activeTab === 'cases' && (
          <>
            <h2>Disease Cases Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={getCasesChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cases" 
                  stroke="#1a73e8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
        
        {activeTab === 'environmental' && (
          <>
            <h2>Environmental Factors</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={getEnvironmentalChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f44336" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#4caf50" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="rainfall" 
                  stroke="#1a73e8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
        
        {activeTab === 'demographic' && (
          <>
            <h2>Demographic & Mobility Factors</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={getDemographicChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="populationDensity" 
                  stroke="#ff9800" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  yAxisId="left"
                />
                <Line 
                  type="monotone" 
                  dataKey="mobilityIndex" 
                  stroke="#9c27b0" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
        
        {activeTab === 'analysis' && (
          <div className="analysis-container">
            <div className="analysis-section">
              <h2>Outbreak Distribution</h2>
              <div className="pie-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getOutbreakDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {getOutbreakDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="analysis-section">
              <h2>Factor Correlation with Outbreaks</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={correlations}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1a73e8" />
                </BarChart>
              </ResponsiveContainer>
              <p className="correlation-note">
                Positive values indicate higher average values during outbreaks,
                negative values indicate lower average values during outbreaks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Import Lucide React icons that are used in this component
import { Activity, AlertTriangle, AlertCircle, Brain } from 'lucide-react';

export default Dashboard;