/** @format */
import React, {Component, Suspense} from "react";
import {Button, ButtonGroup, Grid,} from "@mui/material";
import {Await, defer, Link, useLoaderData,} from "react-router-dom";

import {AuthContext} from "../hoc/AuthProvider";


import {css} from "@emotion/react";
import DvishenieMTR from "../components/DvishenieMTR.js"
import axios from "axios";
import {authSlice} from "../store/storeZustand";


export default function HomePage(props) {
    return (
        <>
            <p>Привет... ты на Главной</p>
        </>
    )

};
