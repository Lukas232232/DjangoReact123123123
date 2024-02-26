import React, { Component } from "react";
import ReactDOM from "react-dom/client";

// импорт scss стилей
import '../sass/main.scss';

import {
	Route,
	BrowserRouter as Router,
	Link,
	Navigate,
	useSearchParams,
	useParams,
	useNavigate,
	useLocation,
	useMatch,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
	
} from "react-router-dom";

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

import {Provider} from "react-redux";
import store from '../store'

import { AuthProvider } from '../hoc/AuthProvider'
import { RequireAuth } from '../hoc/RequireAuth'



export default function App(props) {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>	
				<Route path='/' element={<Main />}>
					<Route index element={<HomePage {...props} testNew={<test_1/>} />} />
					<Route path='/createRoom' element={<h1>привет</h1>} />
				</Route>
				<Route path='/new' element={<NewMain/>}>
					<Route index element={<HomePage {...props} testNew="дадада" />} loader={getFetchAllLoader} errorElement={<ErrorPage/>}/>
					<Route path='/new/createRoom' element={<h1>привет</h1>} />

					<Route path='/new/About' element={<RequireAuth {...props}><About /></RequireAuth>} />

					<Route path='/new/Contact' element={<Contact/>} />
					<Route path='/new/ListingDetail' element={<ListingDetail/>} />
					<Route path='/new/Listings' element={<Listings/>} />
					<Route path='/new/Login' element={<Login/>}/>
					<Route path='/new/SignUp' element={<SignUp/>} />
				</Route>
			</>
		),
	);
	return (
		<Provider store={store}>
			<AuthProvider {...props}>
				<RouterProvider router={router} />
			</AuthProvider>
		</Provider>
		);
}

const appDiv = ReactDOM.createRoot(document.getElementById("app"));

appDiv.render(<App />);