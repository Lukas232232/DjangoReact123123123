import React, {Suspense} from "react";
import ReactDOM from "react-dom/client";

// импорт scss стилей
import '../sass/main.scss';

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider,} from "react-router-dom";

import HomePage, {getFetchAllLoader} from "../containers/HomePage";
import Main, {test_1} from "../hocs/Main";
import NewMain from "../hocs/newMain";
import About from "../containers/About";
import Contact from "../containers/Contact";
import ListingDetail from "../containers/ListingDetail";
import Listings from "../containers/Listings";
import Login from "../containers/Login";
import SignUp from "../containers/SignUp";

import ErrorPage from "./ErrorPage";

import {AuthProvider} from '../hoc/AuthProvider'
import {RequireAuth} from '../hoc/RequireAuth'
import {QueryClient, QueryClientProvider} from "react-query";
import CenterSklad from "./CenterSklad";
// Импортируйте основные стили DevExtreme
import 'devextreme/dist/css/dx.material.blue.light.compact.css'; // Или другая тема по вашему выбору
import 'devextreme/dist/css/dx.common.css';
import DvishenieMTR from "./DvishenieMTR";

const queryClient = new QueryClient()

export default function App(props) {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path='/' element={<NewMain/>}>
                    <Route index element={<HomePage {...props} testNew="дадада"/>}
                           loader={getFetchAllLoader} errorElement={<ErrorPage/>}/>
                    <Route path='/skladUchastok' element={<RequireAuth {...props}>
                        <DvishenieMTR {...props}/></RequireAuth>}
                           loader={getFetchAllLoader} errorElement={<ErrorPage/>}/>
                    <Route path='/centerSklad' element={<RequireAuth {...props}>
                        <CenterSklad {...props}/></RequireAuth>}/>
                    <Route path='/About' element={<RequireAuth {...props}><About/></RequireAuth>}/>
                    <Route path='/Contact' element={<Contact/>}/>
                    <Route path='/ListingDetail' element={<ListingDetail/>}/>
                    <Route path='/Listings' element={<Listings/>}/>

                    <Route path='/SignUp' element={<SignUp/>}/>
                </Route>
                <Route path='/Login' element={<Login/>}/>
            </>
        ),
    );
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider {...props}>
                <RouterProvider router={router}/>
            </AuthProvider>
        </QueryClientProvider>
    );
}

const appDiv = ReactDOM.createRoot(document.getElementById("app"));

appDiv.render(<App/>);