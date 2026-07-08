import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, LogIn, Clock } from 'lucide-react';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        const res = await axios.post('/token', params);
        setToken(res.data.access_token);
      } else {
        await axios.post('/users/', { username, password });
        setIsLogin(true); // Switch to login after successful signup
        setError('Account created! Please log in.'); // Success message
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-screen">
      <div className="auth-hero">
        <Clock size={64} style={{ marginBottom: '2rem' }} />
        <h1>ChronoCraft</h1>
        <p>Your ultimate platform for mapping out history. Build interactive, collaborative timelines with a stunning visual experience.</p>
        <div className="auth-hero-illustration">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white' }}></div>
            <div style={{ width: '120px', height: '4px', background: 'white' }}></div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}></div>
          </div>
        </div>
      </div>
      
      <div className="auth-form-container">
        <div className="auth-box">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="subtitle">{isLogin ? 'Log in to continue building your timelines' : 'Start your journey through time today'}</p>
          
          {error && <div style={{ 
            color: error.includes('created') ? '#059669' : 'var(--danger-color)', 
            marginBottom: '1.5rem',
            padding: '1rem',
            background: error.includes('created') ? '#d1fae5' : '#fee2e2',
            borderRadius: '8px',
            fontWeight: '500'
          }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                className="form-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
              {isLogin ? <><LogIn size={18} /> Log In</> : <><UserPlus size={18} /> Sign Up</>}
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Create an account' : 'Log in instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
