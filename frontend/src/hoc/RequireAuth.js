import React, {Component, useEffect, useState, useContext} from "react";
import {useLocation, Navigate, useNavigate} from 'react-router-dom';
import {authSlice} from "../store/storeZustand";
import {AuthProtected} from "../hook/useReactQuery";


const RequireAuth = ({children}) => {
    const location = useLocation();
	const navigate = useNavigate()
    const login = authSlice(state => (state.auth.token))

    useEffect(() => {
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