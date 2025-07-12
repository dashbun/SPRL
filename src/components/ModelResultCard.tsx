import React, { ReactNode } from 'react';
import './ModelCard.css';

interface ModelResultCardProps {
  title: string;
  loading: boolean;
  error: string | null;
  children: ReactNode;
}

const ModelResultCard: React.FC<ModelResultCardProps> = ({
  title,
  loading,
  error,
  children
}) => {
  return (
    <div className="model-card">
      <div className="model-card-header">
        <h3>{title}</h3>
      </div>
      
      {loading ? (
        <div className="model-loading">
          <div className="spinner"></div>
          <p>Processing data, please wait...</p>
        </div>
      ) : error ? (
        <div className="model-error">
          <p>{error}</p>
        </div>
      ) : (
        <div className="model-content">
          {React.Children.count(children) > 0 ? (
            children
          ) : (
            <div className="model-empty">
              <p>No data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelResultCard;