import React from 'react';
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import store from "../store";
import {authSlice} from "../store/storeZustand";
import Cookies from "js-cookie";
import {logout, refreshToken} from "../store/authSlice";
import {log_out} from "../actions/auth";


const authSlice_ = authSlice.getState()
const AuthProtected = (data) => {
    try {
        console.log(authSlice_.auth.token)
        if (getState().auth.auth.token && getState().auth.auth.token.access_token && getState().auth.auth.token.refresh_token) {
            // проверка токена на валидность
            const response = axios.post(
                `/api/tokenVerify/`,
                {token: getState().auth.auth.token.access_token},
                {
                    validateStatus: function (status) {
                        return status >= 200 && status < 300; // Позволяет рассматривать статусы от 200 до 299 как успешные
                    }
                }
            );
            console.log(response.status);
            // если пришел не статус 200... пытаемся обновить через refresh токен
            if (response.status >= 200 && response.status < 300) {
                const response_refresh = axios.post(
                    `/api/token/refresh/`,
                    {refresh: getState().auth.auth.token.refresh_token},
                    {
                        validateStatus: function (status) {
                            return status >= 200 && status < 600; // Позволяет рассматривать статусы от 200 до 299 как успешные
                        }
                    }
                );
                //если refresh токен тоже не валиден
                if (response.status >= 200 && response.status < 300) {
                    dispatch(log_out())
                    throw new Error("Токен не валиден");
                } else {
                    Cookies.set('access_token', response_refresh.data.access, //{ expires: 7, path: '/' }
                    );
                    dispatch(refreshToken(response_refresh.data))
                    return response_refresh.data;
                }
            }
        } else {
            Cookies.remove('access_token')
            dispatch(logout())
            return false
        }
        return true;
    } catch (error) {
        return rejectWithValue(error.message);
    }
}


const createNewDvishMTR = (data) => {
    const state = store.getState();
    const token = state.auth.auth
    return axios.post("/api/sklad_uchastok/create", data, {
        headers: {
            'Authorization': `Bearer ${token.token.access_token}`
        }
    })
}


const GetAllDvishMTR = () => {
    const state = store.getState();
    const token = state.auth.auth
    return axios.get("/api/sklad_uchastok/all", {
        headers: {
            "Authorization": `Bearer ${token.token.access_token}`,
        },
    });
}

const GetAllSkladMagaz = () => {
    const state = store.getState()
    const token = state.auth.auth
    return axios.get("/api/sklad_centeralniy/all", {
        headers: {
            "Authorization": `Bearer ${token.token.access_token}`,
        },
    });
}

const EditDvishMTR = ({newArr, id}) => {
    const state = store.getState();
    const token = state.auth.auth
    return axios.patch(`/api/sklad_uchastok/edit/${id}`, newArr, {
        headers: {
            'Authorization': `Bearer ${token.token.access_token}`
        }
    })
}

const DeleteDvishMTR = (id) => {
    const state = store.getState();
    const token = state.auth.auth
    return axios.delete(`/api/sklad_uchastok/delete/${id}`, {
        headers: {
            'Authorization': `Bearer ${token.token.access_token}`
        }
    })
}

const ItemDvishMTR = (id) => {
    const state = store.getState();
    const token = state.auth.auth
    return axios.get(`/api/sklad_uchastok/all/${id}`, {
        headers: {
            'Authorization': `Bearer ${token.token.access_token}`
        }
    })
}


export function useAllDvishMTR(props) {
    return useQuery(['getAllDvishMTR'], () => GetAllDvishMTR(), props)
}

export function useAllSkladMagaz(props) {
    return useQuery(['пetAllSkladMagaz'], () => GetAllSkladMagaz(), props)
}

export function useItemDvishMTR({id, ...props}) {
    return useQuery(['itemDvishMTR', id], () => ItemDvishMTR(id), props)
}

export function useCreateDvishMTR(props) {
    return useMutation(createNewDvishMTR, props)
}



export function useEditDvishMTR(props) {
    return useMutation(EditDvishMTR, props)
}

export function useDeleteDvishMTR(props) {
    return useMutation(DeleteDvishMTR, props)
}

export function useAuthProtected(props){
    return useMutation(AuthProtected, props)
}