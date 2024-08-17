/* eslint-disable jsx-a11y/anchor-is-valid */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../api-calls/user-request';

import '../signUp/signup.css'
import '../../common_style.css'

export default function LoginPage() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, SetUserPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const LoginPassFun = (e) => {
        SetUserPassword(e.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setUserEmail(userEmail);
        SetUserPassword(userPassword);
        SaveDetails(userEmail, userPassword);
    };

    const SaveDetails = (userEmail, userPassword) => {
        const userEntry = {
            email: userEmail,
            password: userPassword,
        };

        userLogin(userEntry).then(function (response) {
            if (response.data) {
                localStorage.setItem('mail',response.data.Data.email);
                navigate('/home');
            }
        });
    }

    return (
        <>
            <div className='d-flex card-main-div'>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Box component="section" >
                            <Typography className='fs-24'>
                                SingIn
                            </Typography>
                            <div>
                                <ValidatorForm
                                    useref="form"
                                    onSubmit={handleSubmit}
                                >
                                    <div className='login-text-field-div d-flex'>
                                        <TextValidator
                                            label="Email"
                                            margin="normal"
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            name="email"
                                            className="width-100"
                                            value={userEmail}
                                            id="userEmail"
                                            required={true}
                                            InputLabelProps={{ shrink: true }}
                                            autoFocus
                                            validators={["required"]}
                                            errorMessages={['this field is required', 'email is not valid']}
                                        />
                                        <TextValidator
                                            required={true}
                                            margin="normal"
                                            className=""
                                            onChange={(e) => LoginPassFun(e)}
                                            value={userPassword}
                                            label="Password"
                                            InputLabelProps={{ shrink: true }}
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            id="userPassword"
                                            validators={["required"]}
                                            errorMessages={["password is required"]}
                                            autoComplete="current-password"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            className='signIn-button'
                                        >
                                            Login
                                        </Button>
                                    </div>
                                </ValidatorForm>
                                <div className='login-forgot-password-div'>
                                    <a href='' className='login-forgot-password'>Forgot password ?</a>
                                </div>
                                <div className='login_last_part-div'>
                                    <p>Don't have an account..? <span className='login_register_text' onClick={() => navigate("/signup")}>Sign Up</span></p>
                                </div>
                            </div>
                        </Box>
                    </CardContent>
                </Card>
            </div >
        </>
    )
}