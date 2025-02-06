import React from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../store/protected/IsAuth';

const NotFound = () => {
  const navigate = useNavigate();
  const { adminInfo } = adminAuth();

  const userStyle = 'bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600';
  const adminStyle = 'bg-gray-900'

  const handleNavigateHome = () => {
  
    if (adminInfo) {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${adminInfo ? adminStyle : userStyle} text-white`}>
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">Sorry, the page you are looking for does not exist.</p>
      <button 
        onClick={handleNavigateHome}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;