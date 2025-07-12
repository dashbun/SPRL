import React, { ReactNode } from 'react';
import './ModelCard.css';

interface ModelTrainingCardProps {
  title: string;
  description?: string;
  loading: boolean;
  error: string | null;
  trainingAction: () => void;
  children: ReactNode;
}

const ModelTrainingCard: React.FC<ModelTrainingCardProps> = ({
  title,
  description,
  loading,
  error,
  trainingAction,
  children
}) => {
  return (
    <div className="model-card">
      <div className="model-card-header">
        <h3>{title}</h3>
        {description && <p className="model-description">{description}</p>}
      </div>
      
      {loading ? (
        <div className="model-loading">
          <div className="spinner"></div>
          <p>Training model, please wait...</p>
        </div>
      ) : error ? (
        <div className="model-error">
          <p>{error}</p>
          <button className="button" onClick={trainingAction}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="model-content">
          {React.Children.count(children) > 0 ? (
            children
          ) : (
            <div className="model-empty">
              <p>No model trained yet</p>
              <button className="button primary" onClick={trainingAction}>
                Train Model
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelTrainingCard;