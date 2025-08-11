import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profile_picture: null,
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [emailForOTP, setEmailForOTP] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.profile_picture) {
      data.append('profile_picture', formData.profile_picture);
    }

    try {
      // Use axios directly so no token is sent
      await axios.post('https://51.20.117.87.sslip.io/api/auth/register/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Registered! Check your email for the OTP.");
      setEmailForOTP(formData.email);
      setShowOTP(true);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert("Registration failed!");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://51.20.117.87/api/auth/verify-otp/', {
        email: emailForOTP,
        otp: otp
      });

      alert("Email verified! You can now login.");
      setShowOTP(false);
      setFormData({ email: '', password: '', profile_picture: null });
      setOTP('');
    } catch (err) {
      console.error("OTP verification error:", err.response?.data || err.message);
      alert("OTP verification failed.");
    }
  };

  return (
    <div style={styles.container}>
      {!showOTP ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Create an Account</h2>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="file"
            name="profile_picture"
            onChange={handleChange}
            style={styles.fileInput}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>

          <p style={styles.linkText}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleOTPSubmit} style={styles.form}>
          <h2 style={styles.heading}>Verify Email</h2>
          <p style={styles.message}>
            We sent an OTP to <strong>{emailForOTP}</strong>. Please enter it below.
          </p>

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f5f5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    background: '#fff',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
  },
  message: {
    marginBottom: '10px',
    fontSize: '14px',
    textAlign: 'center',
  },
  linkText: {
    marginTop: '15px',
    fontSize: '14px',
    textAlign: 'center',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  fileInput: {
    marginBottom: '20px',
    padding: '5px 0',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Register;
