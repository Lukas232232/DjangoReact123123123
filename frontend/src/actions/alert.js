import { v4 as uuid } from 'uuid';
import { addAlert, removeAlert } from '../store/alertSlice'
import { createAsyncThunk } from "@reduxjs/toolkit";


// export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
//     const id = uuid();
//     dispatch({
//         type: SET_ALERT,
//         payload: { msg, alertType, id }
//     });

//     setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
// }


export const setAlerts = createAsyncThunk(
    "alert/setAlerts",
    async function (text, { rejectWithValue, dispatch, getState }) {
        const id = uuid();
        dispatch(
            addAlert({
                text: text,
                id: id,
            })
        )
        setTimeout(() => dispatch(removeAlert({id:id})), 3000);
    },
);