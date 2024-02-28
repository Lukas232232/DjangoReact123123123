/** @format */
import React, {Component, Suspense} from "react";
import {Button, ButtonGroup, Grid,} from "@mui/material";
import {Await, defer, Link, useLoaderData,} from "react-router-dom";

import store from "../store";
import {AuthContext} from "../hoc/AuthProvider";

import ListingForm from "../components/EditForm_DvishenieMTR";

import {css} from "@emotion/react";
import DvishenieMTR from "../components/DvishenieMTR"
import axios from "axios";

class HomePage1 extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        console.log(this.props.testNew);
    }

    componentDidUpdate(prevProps) {
    }

    async componentDidMount() {
        this.fetch_user_room_code();
    }

    fetch_user_room_code() {
    }

    render() {
        console.log(this.context);
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="secondary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/createRoom" component={Link}>
                            Create a Room123
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} align="center">
                    <ListingForm/>
                    fdsfasfdsf
                </Grid>
            </Grid>
        );
    }
}


export default function HomePage(props) {
    const {query} = useLoaderData();
    const containerMy = css`
      padding-left: 26px;
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
    const state = store.getState();

    // if (!posts){
    // 	throw json(
    // 	  {
    // 		sorry: "You have been fired.",
    // 		hrEmail: "hr@bigco.com",
    // 	  },
    // 	  { status: 401 }
    // 	);
    // }
    return defer({query: getPosts({token: state.auth.auth.token})});
};
