import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../Services/userService";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import "./Register.css";
import header from "../header/Header";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({ email, name, password });
      alert("Success registration!");
      navigate("/login/");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user");
    }
  };

  return (
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Create Account</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
            </div>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={5}
                  maxLength={20}
                  required
              />
            </div>
            <button type="submit" className="register-button">
              Sign Up
            </button>
          </form>
          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
  );
};

export default header(Register, "Rezerwacje");