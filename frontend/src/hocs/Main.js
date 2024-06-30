import React, { Component, useEffect, useState, useContext} from "react";
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
} from "@mui/material";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
	useSearchParams,
	useParams,
	useNavigate,
	useLocation,
	Outlet,
	Form,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from 'js-cookie';
import {CustomLink} from "../components/CustomLink";

export let test_1

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';

export default function Main() {
	const [test, setTest] = useState("Тестовое состояние")
	test_1 = test

	const todos = useSelector(state => state.todos.todos)
	const dispatch = useDispatch()

	const [text, setText] = useState([])
	const location = useLocation();
	useEffect(() => {
		console.log("Работает")
	}, [location])


	const buttonPress = (e) => {
		if (text.trim().length) {
			setTodos([...todos,
			{
				id: new Date().toISOString(),
				text: text,
				completed: false,
			}])
			setText("")
		}
	}

	const addTask = (e) => {
		dispatch(addTodo({text}))
		setText('')
	}

	const onSubmitButton = (e)=>{
		e.preventDefault()
		console.log(e.targer.todo.value)
		console.log(e.target.todo.type)
	}
	
	return (
		<div>

			
			<Grid container spacing={3}>
				<Grid item xs={12} align='center' style={{ marginTop: 20 }}>
					<Form method='post' onSubmit={onSubmitButton}>
					<FormControl>
						<Grid container spacing={0} alignItems="center">
						  <Grid item xs={6}>
							<TextField name="todo" label="Текстовое поле" variant="outlined" value={text} onChange={e=>setText(e.target.value)} fullWidth size="small"/>
						  </Grid>
						  <Grid item xs={6} >
							<Button style={{marginLeft:10}} type="submit" variant="contained" color="primary" fullWidth size="large">
							  Кнопка
							</Button>
						  </Grid>
						</Grid>
					</FormControl>
					</Form>
				</Grid>
			</Grid>


			<Grid container spacing={3}>
				<Grid item xs={12} align='center' style={{ marginTop: 20 }}>
					<FormControl>
						<Grid container spacing={0} alignItems="center">
						  <Grid item xs={6}>
							<TextField name="todo" label="Текстовое поле" variant="outlined" value={text} onChange={e=>setText(e.target.value)} fullWidth size="small"/>
						  </Grid>
						  <Grid item xs={6} >
							<Button style={{marginLeft:10}} onClick={addTask} variant="contained" color="primary" fullWidth size="large">
							  Кнопка
							</Button>
						  </Grid>
						</Grid>
					</FormControl>
				</Grid>

				<Grid item xs={12} align='center' alignItems="center">
					<List sx={{maxWidth: 200,  bgcolor: 'background.paper' }}>
					  {todos.map((value) => {
						const labelId = `checkbox-list-label-${value.id}`;

						return (
						  <ListItem
							key={value.id}
							secondaryAction={
							  <IconButton edge="end" aria-label="comments" onClick={()=>dispatch(removeTodo({id: value.id}))}>
								<CommentIcon />
							  </IconButton>
							}
							disablePadding
						  >
							<ListItemButton role={undefined} onClick={()=>dispatch(toggleTodo({id:value.id}))} dense>
							  <ListItemIcon>
								<Checkbox
								  edge="start"
								  checked={value.completed}
								  tabIndex={-1}
								  disableRipple
								  inputProps={{ 'aria-labelledby': labelId }}
								/>
							  </ListItemIcon>
							  <ListItemText id={labelId} primary={`Line item ${value.text}`} />
							</ListItemButton>
						  </ListItem>
						);
					  })}
					</List>
				</Grid>
				
				<Grid item xs={12}  align="center">
					<ul>
						<li style={{display: 'inline', margin: '5px'}}><CustomLink to={"/"}>Главная страница</CustomLink></li>
						<li style={{display: 'inline', margin: '5px'}}><CustomLink to={"/createRoom"}>Создать комнату</CustomLink></li>
						<li style={{display: 'inline', margin: '5px'}}><Link >Присоединиться</Link></li>
						<li style={{display: 'inline', margin: '5px'}}><CustomLink to={"/join/us"}>Присоединиться us</CustomLink></li>
						<li style={{display: 'inline', margin: '5px'}}><CustomLink to={"/pages"}>Блок</CustomLink></li>
						<li style={{display: 'inline', margin: '5px'}}><CustomLink to={"/posts/new"}>Создать Пост</CustomLink></li>
					</ul>
				</Grid>
				<Grid item xs={12}  align="center">
					<Typography variant="h4" component="p">
						House Party
					</Typography>
				</Grid>
			</Grid>
			<Outlet />
		</div>
	);
}

