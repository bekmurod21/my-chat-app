import React, {useState} from 'react';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  return (
    <form onSubmit={e=>{e.preventDefault(); onRegister(name,email,password);}}>
      <h2>Register</h2>
      <div>
        <label>Name:</label><br />
        <input value={name} onChange={e=>setName(e.target.value)} required/>
      </div>
      <div>
        <label>Email:</label><br />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      </div>
      <div>
        <label>Password:</label><br />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      </div>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
