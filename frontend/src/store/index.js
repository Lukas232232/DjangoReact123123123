import {configureStore, combineReducers, getDefaultMiddleware   }from '@reduxjs/toolkit'
import { composeWithDevTools } from 'redux-devtools-extension';
import alertReducer from './alertSlice'
import authReducer from './authSlice'
import {thunk} from "redux-thunk";
import { createStore, applyMiddleware } from 'redux';


const rootReducer = combineReducers({
    alert: alertReducer,
    auth: authReducer,
});

const middleware = [thunk];

export default configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
    devTools: true,
});
