/** @format */

import { createSlice } from "@reduxjs/toolkit";

const todotSlice = createSlice({
    name: "todos",
    initialState: {
        todos: [],
    },
    reducers: {
        addTodo: (state, action) => {
            state.todos.push({
                id: new Date().toISOString(),
                text: action.payload.text,
                completed: false,
            });
        },
        removeTodo: (state, action) => {
            console.log(action.payload)
            state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
        },
        toggleTodo: (state, action) => {
            const toggleTodo = state.todos.find((todo) => todo.id === action.payload.id);
            toggleTodo.completed = !toggleTodo.completed;
        },
    },
});

export const { addTodo, removeTodo, toggleTodo } = todotSlice.actions;
export default todotSlice.reducer;
