/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { login, signup, log_out, useAuth} from "../actions/auth";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        auth: {
            token: JSON.parse(localStorage.getItem("token")),
            isAuthenticated: null,
            loading: false,
        },
    },
    reducers: {
        login_success: (state, action) => {
            console.log(action.payload)
            state.auth.token = action.payload;
            localStorage.setItem("token", JSON.stringify(state.auth.token));
            state.auth.isAuthenticated = true;
            state.auth.loading = false;
            
        },
        signup_success: (state, action) => {
            state.auth.isAuthenticated = false;
            state.auth.loading = true;
        },
        logout: (state, action) => {
            localStorage.removeItem("token");
            state.auth.token = null;
            state.auth.isAuthenticated = null;
            state.auth.loading = false;
        },
        refreshToken: (state, action) => {
            console.log(999111)
            state.auth.token.access_token = action.payload.access;
            localStorage.setItem("token", JSON.stringify(state.auth.token));
            state.auth.isAuthenticated = true;
            state.auth.loading = false;

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.rejected, (state, action) => {
            console.log("фигня полная строка 36");
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log("Все получилось");
            })
            .addCase(useAuth.rejected, (state, action) => {
                console.log(action.payload);
            })
    },
});

export const { login_success, signup_success, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
