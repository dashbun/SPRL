import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, BarChart2, Brain, AlertTriangle } from 'lucide-react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Infectious Disease Prediction System</h1>
        <p>Advanced analytics and machine learning for epidemiological data</p>
        <div className="hero-buttons">
          <button className="button primary" onClick={() => navigate('/dashboard')}>
            Explore Dashboard
          </button>
          <button className="button" onClick={() => navigate('/predict')}>
            Make Predictions
          </button>
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="icon-wrapper">
            <BarChart2 size={32} />
          </div>
          <h3>Data Visualization</h3>
          <p>Comprehensive visualization of epidemiological data, environmental factors, and population metrics.</p>
          <button className="button" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </button>
        </div>
        
        <div className="feature-card">
          <div className="icon-wrapper">
            <Brain size={32} />
          </div>
          <h3>Machine Learning Models</h3>
          <p>Advanced models including SVM, Self-Organizing Maps, and LSTM networks for accurate predictions.</p>
          <button className="button" onClick={() => navigate('/models')}>
            Explore Models
          </button>
        </div>
        
        <div className="feature-card">
          <div className="icon-wrapper">
            <Activity size={32} />
          </div>
          <h3>Outbreak Prediction</h3>
          <p>Predict disease outbreaks with high accuracy based on multiple environmental and demographic factors.</p>
          <button className="button" onClick={() => navigate('/predict')}>
            Make Predictions
          </button>
        </div>
        
        <div className="feature-card">
          <div className="icon-wrapper">
            <AlertTriangle size={32} />
          </div>
          <h3>Risk Assessment</h3>
          <p>Comprehensive risk assessment and actionable recommendations for public health interventions.</p>
          <button className="button" onClick={() => navigate('/predict')}>
            Assess Risk
          </button>
        </div>
      </div>
      
      <div className="intro-section">
        <div className="intro-content">
          <h2>Enhancing Public Health Response</h2>
          <p>
            The Disease Prediction System combines epidemiological data with advanced machine learning techniques to provide early warnings of potential disease outbreaks.
          </p>
          <p>
            By analyzing environmental factors, population dynamics, and historical disease patterns, our system can predict outbreaks 3-8 weeks in advance, giving public health officials valuable time to implement preventive measures.
          </p>
          <button className="button primary" onClick={() => navigate('/about')}>
            Learn More
          </button>
        </div>
        <div className="intro-image">
          <img 
            src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Data analysis visualization" 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;