import React, {Component, useEffect, useState, useContext} from "react";
import {useLocation, Navigate, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {authSlice} from "../store/storeZustand";
import {login, signup, log_out, useAuth} from '../actions/auth'
import {AuthProtected} from "../hook/useReactQuery";
import * as PropTypes from "prop-types";



const RequireAuth = ({children}) => {
    const location = useLocation();
	const navigate = useNavigate()
    const login = authSlice(state => (state.auth.token))

    useEffect(() => {
        console.log(123)
        const checkToken = async () => {
            try {
                await AuthProtected();
            } catch (error) {
                console.error(error.message);
            }
        };
        checkToken();
    }, [login, location]);

    if (login) {
        return children;
    } else {
        return (
			 <Navigate to="/Login" replace={true}/>
        )
    }
    return children;
}

export {RequireAuth};