import {nanoid} from 'nanoid';
import {create} from 'zustand';
import {persist, devtools, createJSONStorage} from 'zustand/middleware'


// Конфигурация для persist, с явным указанием localStorage
const authSliceOptions = {
    name: "authSlice_", // ключ, под которым сохраняются данные
};

export const authSlice = create(devtools(persist((set, get) => ({
            auth: {
                token: null,
                isAuthenticated: null,
                loading: false
            },
            loginSuccess: (token) => {
                set(store => ({auth: {token: {...token}, isAuthenticated: true, loading: false}}))
            },
            logout: () => {
                set(store =>
                    ({auth: {token: null, isAuthenticated: null, loading: false}})
                )
            },
            refreshToken: (access) => {
                set(store => ({
                    auth: {
                        ...store.auth,
                        token: {
                            access_token: access.access,
                        },
                        isAuthenticated: true,
                        loading: false
                    }
                }))
            },
        }),
        authSliceOptions
    )
))

const useLeftMenuOptions = {
    name: "useLeftMenu_", // ключ, под которым сохраняются данные
};
export const useLeftMenu = create(devtools(persist((set, get) => ({
    menu: [
        {
            name: "Склад",
            item: [
                {nameItem: "Menu-1", url: "/edit/rer/erer"},
                {nameItem: "Menu-2", url: "/edit/rer/erer"}],

        },
        {
            name: "Склад-2",
            item: [
                {nameItem: "Menu-1", url: "/edit/rer/erer"},
                {nameItem: "Menu-2", url: "/edit/rer/erer"}],

        }
    ],
    setMenu: (menu) => {
        // set({ todos: [...get().todos, newTodo] })
        set(store => ({menu: [...store.menu,...menu]}))
    },
    toggleMenu: (todoId) => set({
        todos: get().todos.map(
            todo => todoId === todo.id
                ? {...todo, completed: !todo.completed}
                : todo
        )
    }),

}), useLeftMenuOptions)))

export const useFilter = create(set => ({
    filter: 'all',
    setFilter: (value) => set({filter: value})
}))