/** @format */
import React, {Component, Suspense} from "react";
import {Button, ButtonGroup, Grid,} from "@mui/material";
import {Await, defer, Link, useLoaderData,} from "react-router-dom";

import {AuthContext} from "../hoc/AuthProvider";



import {css} from "@emotion/react";
import DvishenieMTR from "../components/DvishenieMTR"
import axios from "axios";
import {authSlice} from "../store/storeZustand";


export default function HomePage(props) {
    const {query} = useLoaderData();

    const containerMy = css`
      padding-left: 0px;
    `;
    return (
        <Grid css={containerMy} container spacing={3}>
            <Grid item xs={12} align="center">
                <Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={query}>
                        {(resolvedPosts) => (
                            <DvishenieMTR/>
                        )}
                    </Await>
                </Suspense>
            </Grid>
        </Grid>
    );
}

async function getPosts({token}) {
    try {
        // Выполнение GET запроса к API
        const response = await axios.get("/api/sklad_uchastok/all", {
            headers: {
                "Authorization": `Bearer ${token?.access_token}`,
            },
        });
        // Проверка статуса ответа (например, успешный ответ HTTP — 200)
        if (response.status === 200) {
            // Дополнительно может быть реализована проверка структуры данных ответа,
            // чтобы убедиться в их корректности
            const data = response.data;
            if (!data || typeof data !== "object") {
                // Данные не соответствуют ожидаемой структуре
                throw new Response("Некорректный формат данных", {status: response.status});
            }
            // Возвращение данных, если все проверки пройдены успешно
            return data;
        } else {
            // Обработка случаев, когда статус ответа не соответствует ожидаемому (не 200)
            throw new Response(`Статус ответа не соответствует ожиданию: ${response.status}`, {
                status: response.status,
            });
            return null;
        }
    } catch (error) {
        // Обработка ошибок, возникших при выполнении запроса
        if (axios.isAxiosError(error)) {
            // Это ошибка Axios, мы можем получить дополнительную информацию
            throw new Response(`Ошибка запроса axios: ${error.message}`, {status: error.response.status});
        } else {
            // Неизвестный тип ошибки
            throw new Response(`Неизвестная ошибка: ${error.message}`, {status: error?.response?.status});
        }
    }
}

export const getFetchAllLoader = async ({request, params}) => {
    const token = authSlice.getState().auth.token
    // if (!posts){
    // 	throw json(
    // 	  {
    // 		sorry: "You have been fired.",
    // 		hrEmail: "hr@bigco.com",
    // 	  },
    // 	  { status: 401 }
    // 	);
    // }
    return defer({query: getPosts({token: token})});
};
