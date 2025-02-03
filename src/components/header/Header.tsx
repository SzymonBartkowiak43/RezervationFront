import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const withHeader = (
    WrappedComponent: React.ComponentType,
    headerText: string
) => {
  return (props: any) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("email");  // Pobieramy email z localStorage
      setIsLoggedIn(!!token);
      setEmail(storedEmail);  // Ustawiamy email
    }, []);

    const handleRegisterClick = () => navigate("/register");
    const handleLoginClick = () => navigate("/login");
    const handleLogoutClick = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("email");  // Usuwamy email przy wylogowywaniu
      setIsLoggedIn(false);
      setEmail(null);  // Resetujemy email
      navigate("/");
    };
    const handleReservationsClick = () => navigate("/reservations");
    const handleHomepageClick = () => navigate("/");
    const handleMySalonsClick = () => navigate("/owner/salons");
    const handleCreateSalonClick = () => navigate("/create-salon");

    return (
        <div>
          <header className="header">
            <div className="header-left">
              <h1 className="header-title" onClick={handleHomepageClick}>
                {headerText}
              </h1>
            </div>
            <div className="header-right">
              {isLoggedIn ? (
                  <>
                    <button
                        className="header-button"
                        onClick={handleCreateSalonClick}
                    >
                      Create Salon
                    </button>
                    <button
                        className="header-button"
                        onClick={handleReservationsClick}
                    >
                      Reservations
                    </button>
                    <button
                        className="header-button"
                        onClick={handleMySalonsClick}
                    >
                      My Salons
                    </button>
                    <button
                        className="header-button logout-button"
                        onClick={handleLogoutClick}
                    >
                      Logout
                    </button>
                  </>
              ) : (
                  <>
                    <button
                        className="header-button login-button"
                        onClick={handleLoginClick}
                    >
                      Login
                    </button>
                    <button
                        className="header-button register-button"
                        onClick={handleRegisterClick}
                    >
                      Register
                    </button>
                  </>
              )}
            </div>
          </header>
          <WrappedComponent {...props} email={email} />
        </div>
    );
  };
};

export default withHeader;

