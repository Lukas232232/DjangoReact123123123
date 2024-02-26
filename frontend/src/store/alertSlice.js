/** @format */
import axios from 'axios'; 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAlert = createAsyncThunk("todos/fetchTodos", async function (_, { rejectWithValue }) {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=10")
        const data = response.data;
        console.log(data)
        if (response.status !== 200) {
            throw new Error("Server Error!");
        }
        return data
    } catch (error) {
        return rejectWithValue(error.message);
    }
});



export const deleteTodo = createAsyncThunk(
    "todos/deleteTodo",
    async function (id, { rejectWithValue, dispatch }) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Can't delete task. Server error.");
            }

            dispatch(removeTodo({ id }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const toggleStatus = createAsyncThunk(
    "todos/toggleStatus",
    async function (id, { rejectWithValue, dispatch, getState }) {
        const todo = getState().todos.todos.find((todo) => todo.id === id);

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    completed: !todo.completed,
                }),
            });

            if (!response.ok) {
                throw new Error("Can't toggle status. Server error.");
            }

            dispatch(toggleComplete({ id }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);


export const addNewTodo = createAsyncThunk(
    "todos/addNewTodo",
    async function (text, { rejectWithValue, dispatch }) {
        try {
            const todo = {
                title: text,
                userId: 1,
                completed: false,
            };

            const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(todo),
            });

            if (!response.ok) {
                throw new Error("Can't add task. Server error.");
            }

            const data = await response.json();
            dispatch(addTodo(data));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);


const setError = (state, action) => {
    state.status = "rejected";
    state.error = action.payload;
};


const alertSlice = createSlice({
    name: "alert",
    initialState: {
        alert: JSON.parse(localStorage.getItem('alert')) || [],
        status: null,
        error: null,
    },
    reducers: {
        addAlert: (state, action) => {
            state.alert = [...state.alert, action.payload];
            //localStorage.setItem('alert', JSON.stringify(state.alert))
        },
        removeAlert: (state, action) => {
            state.alert = state.alert.filter((alert) => alert.id !== action.payload.id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlert.pending, (state, action) => {
                console.log("Загрузка fetchAlert.pending");
            })
            .addCase(fetchAlert.fulfilled, (state, action) => {
                console.log("Выполнено otherActionType.fulfilled");
            })
            .addCase(fetchAlert.rejected, (state, action) => {
                console.log("Ошибка otherActionType.rejected");
            })
    }
});

export const { addAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
