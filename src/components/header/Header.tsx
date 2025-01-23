import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const withHeader = (WrappedComponent: React.ComponentType, headerText: string) => {
  return (props: any) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }, []);

    const handleRegisterClick = () => navigate('/register');
    const handleLoginClick = () => navigate('/login');
    const handleLogoutClick = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setIsLoggedIn(false);
      navigate('/');
    };
    const handleReservationsClick = () => navigate('/reservations');

    return (
        <div>
          <header className="header">
            <div className="header-left">
              <h1 className="header-title">{headerText}</h1>
            </div>
            <div className="header-right">
              {isLoggedIn ? (
                  <>
                    <button className="header-button" onClick={handleReservationsClick}>
                      Reservations
                    </button>
                    <button className="header-button logout-button" onClick={handleLogoutClick}>
                      Logout
                    </button>
                  </>
              ) : (
                  <>
                    <button className="header-button login-button" onClick={handleLoginClick}>
                      Login
                    </button>
                    <button className="header-button register-button" onClick={handleRegisterClick}>
                      Register
                    </button>
                  </>
              )}
            </div>
          </header>
          <WrappedComponent {...props} />
        </div>
    );
  };
};

export default withHeader;
