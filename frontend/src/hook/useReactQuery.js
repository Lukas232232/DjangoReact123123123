import React from 'react';
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import store from "../store";
import {authSlice} from "../store/storeZustand";
import Cookies from "js-cookie";
import {login_success, logout, refreshToken} from "../store/authSlice";



export const Logout = async () => {
    const authSlice_ = authSlice.getState()
    try {
        authSlice_.auth.logout()
        console.log("Logout выполнен")
        return {
            test: "test",
        };
    } catch (error) {
        throw Error("Ошибка при Logout")
    }
}


export const LoginSuccess = async (email, password) => {
    const authSlice_ = authSlice.getState()
    try {
        console.log(email, password);
        const response = await axios.post(
            `/api/accounts/auth`,
            {
                email: email,
                password: password,
            },
        );

        if (response.status !== 200) {
            console.log(response)
            throw new Error(`Ошибка: Статус авторизации ${response.status}`);
        }
        authSlice_.loginSuccess(response.data)
        return response.data;
    } catch (error) {
        throw new Error(`Ошибка на сервере: ${error.message}`);
    }
}

export const AuthProtected = async () => {
    const authSlice_ = authSlice.getState()
    try {
        if (authSlice_.auth.token && authSlice_.auth.token.access_token && authSlice_.auth.token.refresh_token) {
            // проверка токена на валидность
            const response = axios.post(
                `/api/tokenVerify/`,
                {token: authSlice_.auth.token.access_token},
                {
                    validateStatus: function (status) {
                        return status >= 200 && status < 300; // Позволяет рассматривать статусы от 200 до 299 как успешные
                    }
                }
            );
            // если пришел не статус 200... пытаемся обновить через refresh токен
            if (response.status > 299) {
                const response_refresh = axios.post(
                    `/api/token/refresh/`,
                    {refresh: authSlice_.auth.token.refreshToken},
                    {
                        validateStatus: function (status) {
                            return status >= 200 && status < 300; // Позволяет рассматривать статусы от 200 до 299 как успешные
                        }
                    }
                );
                //если refresh токен тоже не валиден
                if (response.status > 299) {
                    authSlice_.auth.logout()
                    throw new Error("Токен не валиден");
                } else {
                    Cookies.set('access_token', response_refresh.data.access, //{ expires: 7, path: '/' }
                    );
                    authSlice_.auth.refreshToken(response_refresh.data)
                    return response_refresh.data;
                }
            }
        } else {
            authSlice_.auth.logout()
            return false
        }
        return true;
    } catch (error) {
        throw Error("Ошибка проверки токена")
    }
}


const createNewDvishMTR = (data) => {
    const authSlice_ = authSlice.getState()
    const token = authSlice_.auth.token
    return axios.post("/api/sklad_uchastok/create", data, {
        headers: {
            'Authorization': `Bearer ${token?.access_token}`
        }
    })
}


const GetAllDvishMTR = () => {
    const authSlice_ = authSlice.getState()
    const token = authSlice_.auth.token
    console.log(token.access_token)
    return axios.get("/api/sklad_uchastok/all", {
        headers: {
            "Authorization": `Bearer ${token?.access_token}`,
        },
    });
}

const GetAllSkladMagaz = () => {
    const authSlice_ = authSlice.getState()
    const token = authSlice_.auth.token
    console.log(9999,token?.access_token)
    return axios.get("/api/sklad_centeralniy/all", {
        headers: {
            "Authorization": `Bearer ${token?.access_token}`,
        },
    });
}

const EditDvishMTR = ({newArr, id}) => {
    const authSlice_ = authSlice.getState()
    const token = authSlice_.auth.token
    return axios.patch(`/api/sklad_uchastok/edit/${id}`, newArr, {
        headers: {
            'Authorization': `Bearer ${token?.access_token}`
        }
    })
}

const DeleteDvishMTR = (id) => {
    const authSlice_ = authSlice.getState()
    const token = authSlice_.auth.token
    return axios.delete(`/api/sklad_uchastok/delete/${id}`, {
        headers: {
            'Authorization': `Bearer ${token?.access_token}`
        }
    })
}

const ItemDvishMTR = (id) => {
    const authSlice_ = authSlice.getState()
    const token = authSlice_.auth.token
    return axios.get(`/api/sklad_uchastok/all/${id}`, {
        headers: {
            'Authorization': `Bearer ${token?.access_token}`
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

export function useAuthProtected(props) {
    return useMutation(AuthProtected, props)
}