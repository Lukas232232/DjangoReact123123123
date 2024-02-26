import React, { useState } from "react";
import {
    Box,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Container,
    Grid,
    Typography,
    Stack,
} from "@mui/material";
import { Link, Form } from "react-router-dom";
import {login, signup} from '../actions/auth'

import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";

const SignUp = () => {
    const dispatch = useDispatch()
    
    
    const sugnupFunc = (e) =>{
        e.preventDefault();
        const {name, email, password, password2} = e.target;
        console.log(name.value,email.value, password.value, password2.value);
        dispatch(signup({email: email.value, password: password.value, password2: password2.value, name: name.value}))
    }
    
    return (
        <div style={{maxWidth:"500px"}}>
            <h2>Register Form</h2>
            <Form onSubmit={sugnupFunc}>
                <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                    <TextField
                        type="text"
                        
                        variant='outlined'
                        color='secondary'
                        name = "name"
                        label="Name"
                        //onChange={e => setFirstName(e.target.value)}
                        //value={firstName}
                        fullWidth
                        required
                    />
                </Stack>
                <TextField
                    type="email"
                    variant='outlined'
                    color='secondary'
                    name="email"
                    label="Email"
                    //onChange={e => setEmail(e.target.value)}
                    //value={email}
                    fullWidth
                    required
                    sx={{mb: 4}}
                />
                <TextField
                    type="password"
                    name="password"
                    variant='outlined'
                    color='secondary'
                    label="Password"
                    //onChange={e => setPassword(e.target.value)}
                    //value={password}
                    required
                    fullWidth
                    sx={{mb: 4}}
                />
                <TextField
                    type="password2"
                    name="password2"
                    variant='outlined'
                    color='secondary'
                    label="Repeat Password"
                    //onChange={e => setPassword(e.target.value)}
                    //value={password}
                    required
                    fullWidth
                    sx={{mb: 4}}
                />
                <Button variant="outlined" color="secondary" type="submit" size="large">Register</Button>
            </Form>
        </div>
    );
}
export default SignUp;