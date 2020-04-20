import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { login } from '../helpers/authApi';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const history = useHistory();

  const authorize = async event => {
    event.preventDefault();
    login(username, password)
      .then(response => {
        history.push('/admin');
      })
      .catch(error => {
        setUsername('');
        setPassword('');
        setValidationError(error.detail);
      });
  };

  return (
    <>
      Login
      <form onSubmit={authorize}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nazwa użytkownika"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Hasło"/>
        { validationError }
        <input type="submit" value="Zaloguj"/>
      </form>
    </>
  );
}

export default Login;
