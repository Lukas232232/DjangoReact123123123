import React from 'react';
import {useMutation} from "react-query";
import axios from "axios";
import store from "../store";

const createNewDvishMTR = (data) => {
    const state = store.getState();
    const token = state.auth.auth
    console.log(token)
    return axios.post("/api/sklad_uchastok/create", data, {
        headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODA0NDcxLCJpYXQiOjE3MDg2MjA0NzEsImp0aSI6IjVlOGY0MzM0NTZhZDRlZDc5YzllNTg4NDEyZDg1ZjM5IiwidXNlcl9pZCI6M30.HnWOCyIL31OX8QocSMiWj1ia5hK_Aaw19S33E9qTR-M`
        }
    })
}

const createNewDvishMTR = (id) => {
    const state = store.getState();
    const token = state.auth.auth
    console.log(token)
    return axios.post(`/api/sklad_uchastok/delete/${id}`, {
        headers: {
            'Authorization': `Bearer ${state.auth.auth.}`
        }
    })
}


export function useCreateDvishMTR(props) {
    return useMutation(createNewDvishMTR, props)
}


export function useDeleteDvishMTR(props) {
    return useMutation(createNewDvishMTR, props)
}