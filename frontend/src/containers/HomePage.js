/** @format */
import React, { Component, useEffect, useState, useContext, Suspense } from "react";
import { useAuth } from "../hook/useAuth";
import {
	Grid,
	Button,
	ButtonGroup,
	Typography,
	TextField,
	FormHelperText,
	FormControl,
	Radio,
	RadioGroup,
	FormControlLabel,
	Autocomplete,
} from "@mui/material";
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
	useLoaderData,
	defer,
	Await,
	json,
} from "react-router-dom";

import store from "../store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { useTheme } from "@material-ui/core/styles";

import { RequireAuth } from "../hoc/RequireAuth";
import { AuthProvider, AuthContext, TestContext } from "../hoc/AuthProvider";

import ListingForm from "../components/ListingForm";

import { css } from "@emotion/react";
import MaterialTable from "@material-table/core";

import Cookies from "js-cookie";
import axios from "axios";

class HomePage1 extends Component {
	static contextType = AuthContext;
	constructor(props) {
		super(props);
		console.log(this.props.testNew);
	}

	componentDidUpdate(prevProps) {}

	async componentDidMount() {
		this.fetch_user_room_code();
	}

	fetch_user_room_code() {}

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
					<ListingForm />
					fdsfasfdsf
				</Grid>
			</Grid>
		);
	}
}

const containerMy = css`
	padding-left: 26px;
`;

export default function HomePage(props) {
	const { query } = useLoaderData();
	const { allDvishenie, rudnik, istochnik, type_rabot, verbose_name } = query;

	const defaultProps = {
		options: [
			{ id: 34, title: "İstanbul" },
			{ id: 63, title: "Şanlıurfa" },
		],
		getOptionLabel: (option) => option.title,
	};

	const [selectedBirthCity, setSelectedBirthCity] = useState(null);

	const handleBirthCityChange = (event, value) => {
		// Вы должны обновить значение props.rowData.birthCity с помощью обработчика onChange
		// Например:

		setSelectedBirthCity(value ? value.title : null);
		console.log(selectedBirthCity, 123);
	};
	// настриваем колонки
	const [columns, setColumns] = useState([
		{ title: "ID", field: "id", hidden: false },
		{ title: "Имя", field: "name" },
		{ title: "Фамилия", field: "surname", initialEditValue: "" },
		{ title: "Год рождения", field: "birthYear", type: "numeric" },
		{
			title: "Место рождения",
			field: "birthCity",
			lookup: { 34: "İstanbul", 63: "Şanlıurfa" }, // lookup - это объект, в котором ключи - это значения поля, а значения выподятся пользователю
			// render: (rowData) => (
			// 		<span>{rowData.birthCity === 'İstanbul' ? 'Стамбул' : rowData.birthCity}</span>
			//   ),
			editComponent: (props) => {
				console.log(selectedBirthCity);

				return (
					<Autocomplete
						css={css`
							padding-bottom: 14px;
						`}
						{...defaultProps}
						id="disable-close-on-select"
						disableCloseOnSelect={false}
						value={
							defaultProps.options.find((option) => {
								console.log(props.rowData.birthCity);
								return option.id === props.rowData.birthCity;
							}) || null
						}
						onChange={(e, v) => {
							// Обработчик изменения выбранного значения
							handleBirthCityChange(e, v);
							props.onChange(v ? v.id : null);
						}}
						renderInput={(params) => (
							<TextField {...params} label="Место рождения" variant="standard" />
						)}
					/>
				);
			},
		},
	]);

	const [data, setData] = useState([
		{ id: 1, name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 34 },
		{ id: 2, name: "Zerya Betül", surname: "Baran", birthYear: 2017, birthCity: 63 },
	]);

	// поиск Get запросов
	const [searchParams, setSearchParams] = useSearchParams();
	// получить параметры внутренних запросов
	const params = useParams();
	const navigate = useNavigate();
	const navigation = useNavigation();

	return (
		<Grid css={containerMy} container spacing={3}>
			<Grid item xs={12} align="center">
				{" "}
				<div>{selectedBirthCity || "Пусто"}</div>
				<Suspense fallback={<h2>Loading...</h2>}>
					<Await resolve={query}>
						{(resolvedPosts) => (
							<p>{resolvedPosts.allDvishenie.map((post) => post.id).join("---")}</p>
						)}
					</Await>
				</Suspense>
				<MaterialTable
					options={{ addRowPosition: "first" }}
					title="Editable Preview"
					columns={columns}
					data={data}
					editable={{
						onRowAdd: (newData) =>
							new Promise((resolve, reject) => {
								setTimeout(() => {
									const newDataArray = [...data, newData]; // Создаем новый массив с новой строкой в начале
									setData(newDataArray);

									resolve();
								}, 1000);
							}),
						onRowUpdate: (newData, oldData) =>
							new Promise((resolve, reject) => {
								setTimeout(() => {
									const dataUpdate = [...data];
									const index = dataUpdate.findIndex((item) => item.id === oldData.id);
									console.log(newData);
									dataUpdate[index] = newData;
									setData([...dataUpdate]);

									resolve();
								}, 1000);
							}),
						onRowDelete: (oldData) =>
							new Promise((resolve, reject) => {
								setTimeout(() => {
									const dataDelete = [...data];
									const index = dataDelete.findIndex((item) => item.id === oldData.id);
									dataDelete.splice(index, 1);
									setData([...dataDelete]);

									resolve();
								}, 1000);
							}),
					}}
				/>
			</Grid>
			<Grid item xs={12} align="center">
				<ListingForm />
			</Grid>
		</Grid>
	);
}

async function getPosts({ token }) {
	try {
		// Выполнение GET запроса к API
		const response = await axios.get("/api/sklad_uchastok/all", {
			headers: {
				"Authorization": `Bearer ${token.access_token}`,
			},
		});
		// Проверка статуса ответа (например, успешный ответ HTTP — 200)
		if (response.status === 200) {
			// Дополнительно может быть реализована проверка структуры данных ответа,
			// чтобы убедиться в их корректности
			const data = response.data;
			if (!data || typeof data !== "object") {
				// Данные не соответствуют ожидаемой структуре
				throw new Response("Некорректный формат данных", { status: response.status });
			}
			console.log(data)
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
			throw new Response(`Ошибка запроса axios: ${error.message}`, { status: error.response.status });
		} else {
			// Неизвестный тип ошибки
			throw new Response(`Неизвестная ошибка: ${error.message}`, { status: error?.response?.status });
		}
	}
}

export const getFetchAllLoader = async ({ request, params }) => {
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
	return defer({ query: getPosts({ token: state.auth.auth.token }) });
};
