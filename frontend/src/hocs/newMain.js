import React, { Component, useEffect, useState, useContext} from "react";
import {
    Grid,
    Button,
    ButtonGroup,
    Typography,
    TextField,
    FormHelperText,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
} from "@mui/material";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useSearchParams,
    useParams,
    useNavigate,
    useLocation,
    Outlet,
    Form,
} from "react-router-dom";

import {CustomLink} from "../components/CustomLink";
import Navbar from "../components/Navbar";
import HomePage from "../containers/HomePage";

import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";

import {fetchAlert} from '../store/alertSlice'
import {setAlerts} from '../actions/alert'

import {login, signup, log_out, useAuth} from '../actions/auth'

import Cookies from 'js-cookie';

// Создаем новый объект для работы с куками


export default function NewMain(props) {
    const outl = Outlet
    return (
        <Navbar {...props} outletMy={<Outlet/>}/>

    );
}

