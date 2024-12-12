import React, { useState } from 'react';
import '../LoginRegisterPage.css';
import { login } from '../api/auth'; // login funksiyasini import qiling
import { useNavigate } from 'react-router-dom';

const LoginRegisterPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Sign In form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const navigate = useNavigate();

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  // Sign In tugmasi bosilganda backendga request
  const handleSignIn = async () => {
    try {
      const data = await login(loginEmail, loginPassword);
      // data { token: string, userId: string } bo'ladi deb faraz qilamiz
      console.log(data,"Data")
      //localStorage.setItem('token', data);
      //localStorage.setItem('userId', data.userId);
      navigate('/chat'); // Login muvaffaqiyatli bo'lsa chat sahifasiga o'tish
    } catch (error) {
      alert('Login failed');
    }
  };

  // Sign Up tugmasiga bosilganda backendga request (agar kerak bo'lsa)
  // register funksiyasini ham xuddi login funksiyasi kabi api/auth.ts da yozib, chaqirishingiz mumkin.

  return (
    <div style={{padding: '20px'}}>
      <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
        <div className="form sign-in">
          <h2>Welcome</h2>
          <label>
            <span>Email</span>
            <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
          </label>
          <p className="forgot-pass">Forgot password?</p>
          <button type="button" className="submit" onClick={handleSignIn}>Sign In</button>
        </div>
        <div className="sub-cont">
          <div className="img">
            <div className="img__text m--up">
              <h3>Don't have an account? Please Sign up!</h3>
            </div>
            <div className="img__text m--in">
              <h3>If you already have an account, just sign in.</h3>
            </div>
            <div className="img__btn" onClick={handleToggle}>
              <span className="m--up">Sign Up</span>
              <span className="m--in">Sign In</span>
            </div>
          </div>
          <div className="form sign-up">
            <h2>Create your Account</h2>
            <label>
              <span>Name</span>
              <input type="text" value={regName} onChange={e => setRegName(e.target.value)} />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </label>
            <label>
              <span>Password</span>
              <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            </label>
            <button type="button" className="submit" /*onClick={handleSignUp}*/>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
