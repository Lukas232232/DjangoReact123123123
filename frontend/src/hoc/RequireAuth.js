import React, { Component, useEffect, useState, useContext} from "react";
import { useLocation, Navigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {authSlice} from "../store/storeZustand";
import {login, signup, log_out, useAuth} from '../actions/auth'
import {useAuthProtected} from "../hook/useReactQuery";

const RequireAuth = ({children}) => {
	const location = useLocation();
	const dispatch = useDispatch()
	const login = useSelector(state => state.auth.auth.token)
	dispatch(useAuth());

	const {
        mutate: useAuthProtected_, isError, error, isLoading, isSuccess, refetch
    } = useAuthProtected()

	useAuthProtected_({})

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