import React from "react";
import { Link, useMatch, NavLink } from 'react-router-dom';

const CustomLink = ({children, to, ...props}) => {
	const match = useMatch({
		path: to,
		end: to.length === 1 || to.length === 0,
	});
	console.log(match);
	return (
		<NavLink to={to} activeclassname="active" {...props} end={match?.pattern?.end ? true : false}>{children}</NavLink> // в react router dom 6 работает и без end
	)
}
export {CustomLink};