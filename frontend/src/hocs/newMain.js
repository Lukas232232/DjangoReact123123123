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
import Cookies from 'js-cookie';

// Создаем новый объект для работы с куками


export default function NewMain(props) {
    return (
        <Navbar {...props} outletMy={<Outlet/>}/>

    );
}

