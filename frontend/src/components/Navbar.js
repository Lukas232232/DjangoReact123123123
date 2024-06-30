/** @format */

import React, {useEffect, useState} from "react";

import Cookies from "js-cookie";
import {styled, useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import {css} from "@emotion/react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {useLocation, useNavigate} from "react-router-dom";
import {useLeftMenu} from "../store/storeZustand";

const drawerWidth = 240;

const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})(({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const leftMenu = [
    {
        name: "Склад_2",
        item: [
            {nameItem: "Menu-2", url: "/edit/rer/erer"},
            {nameItem: "Menu-3", url: "/edit/rer/erer"}],
    },
];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

// css темы для вертикального меню
const vertMenu = css`
    padding-left: 50px;

    .Mui-selected {
        background-color: #05c1fa;
        font-size: 13px;
        color: white !important;
    }

    .Mui-selected .MuiTab-root {
        border-bottom: 2px solid red; // пример добавления стиля для нажатой кнопки
    }
`;

const verMenuItem = css`
    color: #fff;
    font-size: 13px;
    font-weight: 500;

`;
// Основаная функция компонента


export default function Navbar(props) {
    // настравиваем левое меню под zustand
    const leftMenu = useLeftMenu((state) => (state.menu))
    console.log(leftMenu)
    // списки меню
    const [menuItem, setMenuItem] = useState([
        {label: 'Склад-Участковый', value: "/skladUchastok"},
        {label: 'Склад-Центральный', value: "/centerSklad"},
        {label: 'Склад-Метрологии', value: "/metrology"}
    ])
    const location = useLocation()
    const cookieValue = Cookies.get("access_token");
    const navigate = useNavigate()
    // определяет содержится ли в адресе значения из menuItem делает кнопку нажатой
    const [value, setValue] = useState(() => {
        const fullURL = window.location.href;
        console.log(fullURL)
        const foundPart = menuItem.find(item => {
            return fullURL.includes(item.value)
        });
        return foundPart ? foundPart.value : null
    });

    const handleChange = (event, newValue) => {
        setValue(newValue)
        navigate(newValue)
    };
    // при каждой смене пути, будет определяться какую кнопку нажимать в навигации (подходит ли путь)
    useEffect(() => {
        setValue(location.pathname)
    }, [location]);

    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box sx={{display: "flex"}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{mr: 2, ...(open && {display: "none"})}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Box sx={{width: "100%"}}>
                        <Tabs
                            css={vertMenu}
                            value={value}
                            onChange={handleChange}
                            aria-label="wrapped label tabs example"
                        >
                            {menuItem.map(item => <Tab key={item.value} css={verMenuItem} value={item.value}
                                                       label={item.label}/>)}
                        </Tabs>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        backgroundColor: "#f0f9ffd4",
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >

                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "ltr" ?
                        <>
                            <ChevronLeftIcon/>
                            <ChevronLeftIcon/>
                            <ChevronLeftIcon/>
                        </> :
                        <ChevronRightIcon/>
                    }
                </IconButton>
                {leftMenu.map((nameSklad, index) => {
                    return (
                        <React.Fragment key={index}>
                            <h6 style={{paddingRight: "15px", textAlign: 'center'}}>{nameSklad.name}</h6>
                            <List>
                                {nameSklad.item.map((itm, index) => (
                                    <ListItem key={itm.nameItem} disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                                            <ListItemText primary={itm.nameItem}/>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </React.Fragment>)
                })}
                <Divider/>

                <Divider/>
            </Drawer>
            <Main open={open}>
                <DrawerHeader/>
                {props.outletMy}
            </Main>
        </Box>
    );
}
