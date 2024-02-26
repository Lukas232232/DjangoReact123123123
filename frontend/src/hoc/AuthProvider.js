/** @format */
import {
	BrowserRouter as Router,
	Route,
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
	useNavigation,
	useRoutes,
} from "react-router-dom";


import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);
export const TestContext = createContext(null);

export const AuthProvider = ({ children}) => {
	const [test, setTest] = useState(null);
	const [user, setUser] = useState(false);	
	const dispatch = useDispatch()
	
	const signin = async () => {
	}
	const value = {user};

	return (
		<AuthContext.Provider value={value}>
			<TestContext.Provider value={{'test': test, 'setTest':setTest}}>
				{children}
			</TestContext.Provider>
		</AuthContext.Provider>
	);
};
