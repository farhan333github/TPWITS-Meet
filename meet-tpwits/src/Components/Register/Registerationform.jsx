import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registerationform.css";

const Registerationform = () => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    
    if (!fullName) formErrors.fullName = "This field is required";
    if (!gender) formErrors.gender = "Please select a gender";
    if (!email) formErrors.email = "This field is required";
    if (!password) {formErrors.password = "This field is required";
      
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
    }

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      const response = await axios.post(
        "http://172.25.0.109:3000/auth/register",
        { 
          full_name: fullName,  
          gender, 
          email, 
          password 
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,  
        }
      );

      if (response.data.success) {
        alert("Registration successful. Please log in.");
        navigate("/login");
      } else {
        alert(response.data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.response?.data?.message || "An error occurred. Try again.");
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <h3>Registration</h3>

        
        <div className="input_box">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
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

        
        <div className="radio">
          <label>Gender</label>
          <div className="gender-option">
            <input
              type="radio"
              id="male"
              value="male" 
              checked={gender === "male"}
              onChange={() => setGender("male")}
            />
            <label htmlFor="male">Male</label>
          </div>
          <div className="gender-option">
            <input
              type="radio"
              id="female"
              value="female" 
              checked={gender === "female"}
              onChange={() => setGender("female")}
            />
            <label htmlFor="female">Female</label>
          </div>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registerationform;