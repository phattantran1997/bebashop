import React, { useState } from "react";
import axios from "axios";
import "./Login.scss";
import { getBaseURL } from "../apiConfig";
import TokenRefresher from "../Utils/token";

function Login(props) {
  const [uname, setUname] = useState(""); // For username or email
  const [password, setPass] = useState(""); // For password
  const [phoneNumber, setPhoneNumber] = useState(""); // For phone number
  const [error, setError] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(true); // Track if admin is logging in

  // Handle Admin Login (Username/Password)
  const handleAdminLogin = () => {
    if (validateInputs()) {
      const user = { email: uname, password: password };
      let url = `${getBaseURL()}api/users/login`;
      axios
        .post(url, { ...user })
        .then((res) => {
          if (res.data.length > 0) {
            sessionStorage.setItem("isUserAuthenticated", true);
            const user = res.data[0].isAdmin;
            sessionStorage.setItem("customerId", res.data[0].userId);
            sessionStorage.setItem("isAdmin", user ? true : false);
            sessionStorage.setItem("jwt_token", res.data[0].token);
            sessionStorage.setItem("jwt_refresh_token", res.data[0].refreshToken);
            TokenRefresher(res.data[0].refreshToken);
            props.setUserAuthenticatedStatus(user ? true : false, res.data[0].userId);
          } else {
            console.log("User not available");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleNormalUserLogin = () => {
    // Check if the phone number is valid (or is '0' for guest login)
    if (validatePhoneNumber() || phoneNumber === '0') {
      const user = { phone: phoneNumber };
  
      // URL for normal user login
      let url = `${getBaseURL()}api/users/login-by-phone`;
  
      // If the phone number is '0', treat it as a guest user, do not attempt to log in
      if (phoneNumber === '0') {
        sessionStorage.setItem("isUserAuthenticated", false);  // Guest user
        sessionStorage.setItem("customerId", "guest");
        sessionStorage.setItem("isAdmin", false);
        sessionStorage.setItem("jwt_token", "");
        sessionStorage.setItem("jwt_refresh_token", "");
        console.log("User logged in as guest, no authentication.");
        props.setUserAuthenticatedStatus(false, "guest"); // Handle as guest
      } else {
        // Normal login process
        axios
          .post(url, { ...user })
          .then((res) => {
            if (res.data.length > 0) {
              sessionStorage.setItem("isUserAuthenticated", true);
              sessionStorage.setItem("customerId", res.data[0].userId);
              sessionStorage.setItem("isAdmin", false); // Normal user
              sessionStorage.setItem("jwt_token", res.data[0].token);
              sessionStorage.setItem("jwt_refresh_token", res.data[0].refreshToken);
              TokenRefresher(res.data[0].refreshToken);
              props.setUserAuthenticatedStatus(false, res.data[0].userId);
            } else {
              console.log("User not available");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  
  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate password length
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Validate phone number format (just a simple check for this example)
  const validatePhoneNumber = () => {
    const regex = /^[0-9]{10}$/; // Assuming phone number is 10 digits long
    return regex.test(phoneNumber);
  };

  // Validate inputs for username/password login
  const validateInputs = () => {
    if (!validateEmail(uname)) {
      setError("Please provide a valid email address.");
      return false;
    } else if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <div className="login-container">
      <h1>{isAdminLogin ? "Admin Login" : "Normal User Login"}</h1>

      {isAdminLogin ? (
        <>
          <div>
            <label>E-Mail</label>
            <input type="text" value={uname} onChange={(e) => setUname(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPass(e.target.value)} />
          </div>
        </>
      ) : (
        <div>
          <label>Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {isAdminLogin ? (
        <button onClick={handleAdminLogin}>Login as Admin</button>
      ) : (
        <button onClick={handleNormalUserLogin}>Login as Normal User</button>
      )}

      <div className="switch-login" onClick={() => setIsAdminLogin(!isAdminLogin)}>
        {isAdminLogin ? "Login as Normal User" : "Login as Admin"}
      </div>

      <div className="register-link" onClick={() => props.navigateToRegisterPage()}>
        Register
      </div>
    </div>
  );
}

export default Login;
