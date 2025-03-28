import React, { useState } from 'react';
import CustomerDashboard from './components/customer/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css';


function App() {
  const [viewMode, setViewMode] = useState('customer'); // 'customer' or 'admin'

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <img src="./logo.jpg" alt="Twin Green Salankanda" />
        </div>
        <div className="view-toggle">
          <button 
            className={viewMode === 'customer' ? 'active' : ''} 
            onClick={() => setViewMode('customer')}
          >
            Guest View
          </button>
          <button 
            className={viewMode === 'admin' ? 'active' : ''} 
            onClick={() => setViewMode('admin')}
          >
            Admin View
            </button>
        </div>
      </header>
      
      <main>
        {viewMode === 'customer' ? (
          <CustomerDashboard />
        ) : (
          <AdminDashboard />
        )}
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2025 Twin Green Salankanda. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;