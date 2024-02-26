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
} from "@mui/material";
import { Link, Form, useNavigate } from "react-router-dom";
import {login} from '../actions/auth'

import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const dataForm = useState({
        email: null,
        password: null,
    });

    const loginFunc = async (e) =>{
        e.preventDefault();
        const {email, password} = e.target;
        console.log(email.value, password.value);
        const resp = await dispatch(login({email: email.value, password: password.value}))
        if (resp.payload.access_token){
            navigate("/new")
        }
    }
    
    return (
        <Form onSubmit={loginFunc}>
        <Box
            sx={{
                maxWidth: "500px",
                margin: "auto",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                backgroundColor: "white",
            }}
        >
                <TextField
                    fullWidth
                    autoComplete="off"
                    label="Email"
                    name="email"
                    //onChange={handleChange}
                    //error={Boolean(errors.username)}
                    //helperText={errors.username}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    name="password"
                    //value={formData.password}
                    //onChange={handleChange}
                    //error={Boolean(errors.password)}
                    //helperText={errors.password}
                    margin="normal"
                    sx={{ mt: 2 }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={true}
                            //onChange=""
                            name="rememberMe"
                            color="primary"
                        />
                    }
                    label="Remember Me"
                    sx={{ mt: 1, textAlign: "left" }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            
            <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link href="#" variant="body2">
                    Forgot Password?
                </Link>
                <Box mt={1}>
                    <Link href="" variant="body2">
                        Don't have an account? Sign Up
                    </Link>
                </Box>
            </Box>
        </Box>
        </Form>
    );
};


// const loginAction = async ({ request, params }) => {
//     const formData = await request.formData();
    
//     // if (formData.get('title') === '' || formData.get('body') === '') {
//     //     return {message: `Post and Body not be empty.`}
//     // }
//     // const updatePost = await updatePostfunc(formData)
//     // return {message: `Post ${updatePost.id} updated`}
//     const dispatch = useDispatch()
//     const email = formData.get('email')
//     const password = formData.get('password')
//     const loginData = await dispatch(login({email, password}));
//     console.log(1111);
//     return loginData
// };

export default Login;
