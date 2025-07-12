import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, BarChart2, Brain, HelpCircle } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo">
          <Activity size={24} />
          <h2>DiseaseSmart</h2>
        </div>
        <nav className="nav">
          <Link to="/" className={isActive('/') ? 'nav-item active' : 'nav-item'}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-item active' : 'nav-item'}>
            <BarChart2 size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/models" className={isActive('/models') ? 'nav-item active' : 'nav-item'}>
            <Brain size={20} />
            <span>Models</span>
          </Link>
          <Link to="/predict" className={isActive('/predict') ? 'nav-item active' : 'nav-item'}>
            <Activity size={20} />
            <span>Predict</span>
          </Link>
          <Link to="/about" className={isActive('/about') ? 'nav-item active' : 'nav-item'}>
            <HelpCircle size={20} />
            <span>About</span>
          </Link>
        </nav>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;