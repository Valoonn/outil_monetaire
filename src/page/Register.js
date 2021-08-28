import './Login-Register.css';
import { useState } from 'react';
import Axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function Register() {

    const [email, setemail] = useState("");
    const [firstName, setfirstName] = useState("");
    const [secondeName, setsecondeName] = useState("");
    const [age, setAge] = useState("");
    const [adress, setAdress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [password, setPassword] = useState("");
    const [secondePassword, setSecondePassword] = useState("");
    
    const [loginStatus, setLoginStatus] = useState("");

    const register = () => {
        if (password !== secondePassword)
            setLoginStatus("Les mots de passe sont different");
        else {
            Axios.post("http://localhost:3001/register",
            {email : email, password : password, firstName: firstName,
            secondeName: secondeName, age: age, adress: adress, city: city,
            postalCode: postalCode})
            .then((response) => {
                setLoginStatus(response.data.message)
            })
        }
    }

  return (
    <div className="login_form">
        <h1>S'inscrire</h1>
        <div className="all_input">
            <div>
                <TextField required="true" id="outlined-basic" autoFocus="true" label="Email" variant="outlined" onChange={(e) => {
                    setemail(e.target.value)
                }}/>

                <TextField required="true" id="outlined-basic" label="Nom" variant="outlined" onChange={(e) => {
                    setfirstName(e.target.value)
                }}/>

                <TextField required="true" id="outlined-basic" label="Prenom" variant="outlined" onChange={(e) => {
                    setsecondeName(e.target.value)
                }}/>

                <TextField required="true" id="outlined-basic" label="Age" variant="outlined" onChange={(e) => {
                    setAge(e.target.value)
                }}/>
            </div>
            <div>
                <TextField required="true" id="outlined-basic" label="Adresse" variant="outlined" onChange={(e) => {
                    setAdress(e.target.value)
                }}/>

                <TextField required="true" id="outlined-basic" label="Code Postal" variant="outlined" onChange={(e) => {
                    setPostalCode(e.target.value)
                }}/>

                <TextField required="true" id="outlined-basic" label="Ville" variant="outlined" onChange={(e) => {
                    setCity(e.target.value)
                }}/>

                <TextField required="true" id="outlined-basic" label="Mot de passe" variant="outlined" type="password"onChange={(e) => {
                    setPassword(e.target.value)
                }}/>

                <TextField required="true" id="outlined-basic" label="Confirmer le mot de passe" variant="outlined" type="password"onChange={(e) => {
                    setSecondePassword(e.target.value)
                }}/>
            </div>
        </div>

        <Button variant="contained" onClick={register}> S'inscrire </Button>
        <h>{loginStatus}</h>
    </div>
  );
}

export default Register;
