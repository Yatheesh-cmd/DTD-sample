import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './styles.css'; // Ensure CSS is imported

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '1122') {
      setError('');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-box p-4 shadow rounded bg-white">
        <div className="text-center mb-4">
          <img
            src="https://cdn.wowdeals.me/uploads/images/companies/82/logo/495x225/1744882619.png"
            alt="Warehouse Logo"
            className="login-logo"
            onError={(e) => {
              console.error('Failed to load logo');
              e.target.src = 'https://via.placeholder.com/200x100?text=Logo+Not+Found';
            }}
          />
          <h2 className="login-title">Login to Warehouse Inventory</h2>
          <p className="login-subtitle">Secure access to your inventory management</p>
        </div>
        {error && <Alert variant="danger" className="modern-alert">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label className="modern-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password input"
              className="modern-input"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 modern-button">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
