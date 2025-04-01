import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 2a1 1 0 00-.894.553l-7 14A1 1 0 003 18h14a1 1 0 00.894-1.447l-7-14A1 1 0 0010 2z" />
          </svg>
          <span className="text-2xl font-bold">Task Manager</span>
        </div>
        <div className="flex-grow text-center">
          <h1 className="text-xl font-semibold">
          </h1>
        </div>
        <div className="flex items-center">
          {isAuthenticated && (
            <Button variant="contained" onClick={handleLogout} endIcon={<LogoutIcon />} className="h-max w-max">
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
