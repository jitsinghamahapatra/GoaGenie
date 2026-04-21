import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await googleSignIn();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  }

  return (
    <div className="page-content auth-page">
      <div className="auth-visual-bg"></div>
      <div className="auth-container animate-fade-up">
        <div className="auth-card card">
          <div className="auth-header">
            <div className="auth-logo-circle">🌴</div>
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="auth-subtitle">
              {isLogin ? 'Login to continue your Goa journey' : 'Join thousands of travelers planning with AI'}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button className="btn btn-ghost auth-google" onClick={handleGoogleSignIn}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
            Continue with Google
          </button>

          <div className="auth-footer">
            <p>
              {isLogin ? "New to GoaGenie? " : "Already have an account? "}
              <button className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up Free' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
