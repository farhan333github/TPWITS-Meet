import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext"; // ✅ Import useAuth
import "./Login.css";
import logo from "../../assets/Tpwitslogo.png";
import { io } from "socket.io-client"; 

const API_BASE_URL = "http://172.25.0.109:3000"; 

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // Reset errors before request
    let validationErrors = {};

    if (!email) validationErrors.email = "This field is required";
    if (!password) validationErrors.password = "This field is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // ✅ Store token and user details
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        login(user); // ✅ Use login to set user in context

        // ✅ Initialize Socket.io Connection After Login
        const socket = io(API_BASE_URL, { transports: ["websocket"], withCredentials: true });
        socket.emit("register", user.id);
        console.log("Socket registered for:", user.id);

        console.log("✅ Logged in successfully", response.data);
        navigate("/meeting"); // Ensure route matches router setup
      } else {
        setServerError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      if (error.response) {
        if (error.response.status === 404) {
          setServerError("User not found. Please register.");
        } else if (error.response.status === 401) {
          setServerError("Incorrect password. Try again.");
        } else {
          setServerError("Server error. Please try later.");
        }
      } else {
        setServerError("Network error. Check your connection.");
      }
    }
  };

  return (
    <div className="login_form">
      <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}>
        <div className="logo">
          <img src={logo} alt="tpwits logo" />
        </div>

        <div className="input_box">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input_box">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {serverError && <p className="error">{serverError}</p>}

        <button type="submit">Log In</button>
        <p className="sign_up">
          Don't have an account? <a href="/register">Register Now</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
