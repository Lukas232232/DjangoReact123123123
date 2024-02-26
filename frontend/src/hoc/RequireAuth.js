import React, { Component, useEffect, useState, useContext} from "react";
import { useLocation, Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";

import {login, signup, log_out, useAuth} from '../actions/auth'

const RequireAuth = ({children}) => {
	const location = useLocation();
	const dispatch = useDispatch()
	const login = useSelector(state => state.auth.auth.token)
	
	useEffect(() => {
		dispatch(useAuth());
	}, [login]);
	console.log(login)
	if (login) {
		return children;
	}else{
		return (
			<h1>все фигня</h1>
		)
	}
  	return children;
}

export {RequireAuth};