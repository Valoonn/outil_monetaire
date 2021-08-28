import React, { useState } from 'react';
import './Login-Register.css';
import Axios from 'axios'
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

function Login() {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    
    const [loginStatus, setLoginStatus] = useState("");

    const login = () => {
        Axios.post("http://localhost:3001/login",
        {email : email, password : password})
        .then((response) => {
            setLoginStatus(response.data.message)
        })
    }
  
  return (
    <div className="login_form">
        <h1>Connexion</h1>
          <TextField required="true" id="outlined-basic" autoFocus="true" label="Email" variant="outlined"type="text" onChange={(e) => {
              setemail(e.target.value)
          }}/>
          <TextField required="true" id="outlined-basic" label="Mot de passe" variant="outlined" type="password" onChange={(e) => {
              setPassword(e.target.value)
          }}/>
          <Button variant="contained" onClick={login}> Connexion </Button>
        <p>{loginStatus}</p>
    </div>
  );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }

export default Login;
