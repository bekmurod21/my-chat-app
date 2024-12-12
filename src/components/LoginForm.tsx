import React, {useState} from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <form onSubmit={e=>{e.preventDefault(); onLogin(email,password);}}>
      <h2>Login</h2>
      <div>
        <label>Email:</label><br />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      </div>
      <div>
        <label>Password:</label><br />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
export default LoginForm;
