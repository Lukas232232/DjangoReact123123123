import React, {useEffect, useState} from "react"
import { isRouteErrorResponse, useRouteError } from "react-router-dom"

function ErrorPage() {
	const error = useRouteError()
	const [text, setText] = useState(null)
	if (isRouteErrorResponse(error)) { // используетс ятолько вместе с throw json()
		//проверят случилась ли ошибка на уровне роутинка или нет
		return (
			<div>
				<h1>Ошибка</h1>
				<h1>{error}</h1><p>fdsfsf</p>
			</div>
		)
	}
	useEffect(() => {
		(async () => {
		  let text = await error.text();
		  setText(text);
		})();
	  }, []);
	return (
		<div>
			{text ?(<>
				<h1>{text}</h1>
				<h1>{error.statusText}</h1>
				<h1>{error.status}</h1></>
			)
			:
				(<h1>Ищи ошибку в логах</h1>)}
		</div>
	)
}
export default ErrorPage
