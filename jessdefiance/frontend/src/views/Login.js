import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { login } from '../helpers/authApi';
import { TextField, Button } from "@material-ui/core";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  .form {
    margin-top: 1rem;
    display: flex;
    align-items: center;
  }
  
  .form-field {
    margin-left: 1rem;
  }
  
  .form-submit {
    margin-left: 1.5rem;
  }
`;

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
    <Container>
      <form className="form" onSubmit={authorize}>
        <div className="form-field">
          <TextField type="text" value={username} onChange={e => setUsername(e.target.value)} label="Nazwa użytkownika"/>
        </div>
        <div className="form-field">
          <TextField type="password" value={password} onChange={e => setPassword(e.target.value)} label="Hasło"/>
        </div>
        { validationError }
        <Button className="form-submit" type="submit" variant="contained" color="primary">Zaloguj</Button>
      </form>
    </Container>
  );
}

export default Login;
