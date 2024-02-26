/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";

import { setAlerts } from "./alert";
import { login_success, signup_success, logout, refreshToken } from "../store/authSlice";

import Cookies from 'js-cookie';
import axios from "axios";


const signup = createAsyncThunk(
	"auth/signup",
	async function ({ name, email, password, password2 }, { rejectWithValue, dispatch, getState }) {
		console.log(name, email, password, password2);
		try {
			const response = await axios.post(
				`/api/accounts/signup`,
				{ name, email, password, password2 },
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			console.log(response.data);
			if (response.status !== 200) {
				throw new Error("Error Authenticating");
			}

			dispatch(signup_success(response.data));
			//dispatch(login(email, password));
			dispatch(setAlert("Signup successfully"));
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const log_out = createAsyncThunk("auth/logout", async function (_, { rejectWithValue, dispatch, getState }) {
	console.log(0);
	try {
		dispatch(logout());
		Cookies.remove('access_token')
		dispatch(setAlerts("logout successful."));
		return {
			test: "test",
		};
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

const login = createAsyncThunk(
	"auth/login",
	async function ({ email, password }, { rejectWithValue, dispatch, getState }) {
		try {
			console.log(email, password);
			const response = await fetch(
				`https://c75b361c-d4a8-4f3c-ba6c-626f8832b861-00-150peigvtqdi5.kirk.replit.dev/api/accounts/auth`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						// Преобразуем объект в строку JSON
						email: email,
						password: password,
					}),
				},
			);
			if (!response.ok) {
				throw new Error("Can't toggle status. Server error.");
			}
			const data = await response.json();
			dispatch(login_success(data));
			const test = dispatch(setAlerts("Authenticated successfully"));
			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const useAuth = createAsyncThunk(
	"auth/useAuth",
	async function (_, { rejectWithValue, dispatch, getState }) {
		try {
			if (getState().auth.auth.token && getState().auth.auth.token.access_token && getState().auth.auth.token.refresh_token) {
				// проверка токена на валидность
				const response = await axios.post(
					`/api/tokenVerify/`,
					{ token: getState().auth.auth.token.access_token },
					{ validateStatus: function (status) {
						return status >= 200 && status < 600; // Позволяет рассматривать статусы от 200 до 299 как успешные
					}}
					// {
					//     headers: {
					//         "Content-Type": "application/json",
					//     },
					// },
				);
				console.log(response.status);
				// если пришел не статус 200... пытаемся обновить через refresh токен
				if (response.status !== 200) {
					const response_refresh = await axios.post(
						`/api/token/refresh/`,
						{ refresh: getState().auth.auth.token.refresh_token },
						{ validateStatus: function (status) {
							return status >= 200 && status < 600; // Позволяет рассматривать статусы от 200 до 299 как успешные
						}}
					);
					//если refresh токен тоже не валиден
					if (response_refresh.status !== 200) {
						dispatch(log_out())
						throw new Error("Токен не валиден");
					}else{
						Cookies.set('access_token', response_refresh.data.access, //{ expires: 7, path: '/' }
						);
						dispatch(refreshToken(response_refresh.data))
						return response_refresh.data;
					}
				}
			}else{
				Cookies.remove('access_token')
				dispatch(logout())
				return false
			}
			return true;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

export { login, log_out, signup, useAuth };
