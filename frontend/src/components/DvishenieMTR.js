/** @format */
import React, {useEffect, useState} from "react";
import {Grid,} from "@mui/material";
import {useAsyncValue, useLocation, useNavigate, useSearchParams,} from "react-router-dom";

import {css} from "@emotion/react";
import MaterialTable from "@material-table/core";

import AddForm_DvishenieMTR from "./AddForm_DvishenieMTR";
import EditForm_DvishenieMTR from "./EditForm_DvishenieMTR";
import EditIcon from '@mui/icons-material/Edit';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import {useDeleteDvishMTR} from "../hook/useReactQuery"
import {useLeftMenu} from "../store/storeZustand";

export default function DvishenieMTR(props) {
    // устанавливаем себе левое меню
    const leftMenu = useLeftMenu((state) => (state.setMenu))
    useEffect(() => {
        leftMenu([
            {
                name: "Склад",
                item: [
                    {nameItem: "Menu-1", url: "/edit/rer/erer"},
                    {nameItem: "Menu-2", url: "/edit/rer/erer"}
                ],
            }
        ]);
    }, [leftMenu]);
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();
    // метод для удаление записи движения мтр
    const {mutate: DeleteDvishMTR, isError, error, isLoading, isSuccess} = useDeleteDvishMTR({
        onSuccess: () => {
            const currentPath = window.location.pathname;
            navigate(currentPath, {replace: true});
        },
    })
    // Содержит все данные из loader запроса
    const query = useAsyncValue()
    const {allDvishenie, rudnik, istochnik, type_rabot, enc, user, verbose_name} = query;
    // открывает диалоговое окно для редактирование записи
    const [_openDialog, _openDialogSet] = useState(false);
    const [_openEditDialog, _openEditDialogSet] = useState(false);
    const [dummy, setDummy] = useState(0) // для возвожности когда происходит такое присваение в state значения как и было

    // метод удаления записи
    const handleDelete = (rowdata) => {
        DeleteDvishMTR(rowdata.id)
        if (isSuccess) {
            console.log("Все ок!")
        }
    }
    // кнопка добавление записи
    const handleAdd = (e, rowData) => {
        _openDialogSet(true)
        setDummy(prevDummy => prevDummy + 1);
    }
    // кнопка изменения записи
    const handleEdit = (e, rowData) => {
        setSearchParams({module: "dvisheniemtr", edit: rowData.id})
        _openEditDialogSet(true)
        setDummy(prevDummy => prevDummy + 1);
    }
    // обрабатываем событие изменения get параметров в строке запроса
    useEffect(() => {
        if (searchParams.get("module") === "dvisheniemtr" && searchParams.get('edit') !== undefined) {
            _openEditDialogSet(true)
            setDummy(prevDummy => prevDummy + 1);
        }
    }, [searchParams])

    const [allDvish, setAllDvish] = useState(allDvishenie)
    // lookup полей
    const [rudnikLookup, setRudnikLookup] = useState(() => {
        const data = {}
        rudnik.map((one) => {
            data[one.id] = one.name
        })
        return data; // Возвращаем результат вычислений
    });
    const [encLookup, setEncLookup] = useState(() => {
        const data = {}
        enc.map((one) => {
            data[one.id] = one.name
        })
        return data; // Возвращаем результат вычислений
    });
    const [istochnikLookup, setIstochnikLookup] = useState(() => {
        const data = {}
        istochnik.map((one) => {
            data[one.id] = one.name
        })
        return data; // Возвращаем результат вычислений
    });
    const [type_rabotLookup, setType_rabotLookup] = useState(() => {
        const data = {}
        type_rabot.map((one) => {
            data[one.id] = one.name
        })
        return data; // Возвращаем результат вычислений
    });
    const [userLookup, setUserLookup] = useState(() => {
        const data = {}
        user.map((one) => {
            data[one.id] = one.name
        })
        return data; // Возвращаем результат вычислений
    });

    const [columns, setColumns] = useState([
        {title: "ID", field: "id", hidden: false},
        {
            title: "Рудник/Склад", field: "rudnik", lookup: rudnikLookup
        },
        {
            title: "Реальная дата", type: "datetime", field: "real_date", initialEditValue: "___",
        },
        {title: "Дата", field: "my_date", type: "date"},
        {title: "ЕНС", field: "enc", type: "numeric", lookup: encLookup},
        {title: "Тип движение", field: "type_dvisheniya", type: "string"},
        {title: "Количество", field: "count", type: "numeric"},
        {title: "Итоговое кол-во", field: "itog_count", type: "numeric"},
        {title: "Источник", field: "istochnik", type: "numeric", lookup: istochnikLookup},
        {title: "Тип работ", field: "type_rabot", type: "numeric", lookup: type_rabotLookup},
        {title: "СДО/оборудование", field: "sdo", type: "string"},
        {title: "INC|RITM", field: "nomer_incidenta", type: "string"},
        {title: "Комментарий", field: "comment", type: "string"},
        {title: "Пользователь", field: "user", type: "numeric", lookup: userLookup},

        // {
        // 	title: "Место рождения",
        // 	field: "birthCity",
        // 	lookup: { 34: "İstanbul", 63: "Şanlıurfa" }, // lookup - это объект, в котором ключи - это значения поля, а значения выподятся пользователю
        // 	// render: (rowData) => (
        // 	// 		<span>{rowData.birthCity === 'İstanbul' ? 'Стамбул' : rowData.birthCity}</span>
        // 	//   ),
        // 	editComponent: (props) => {
        // 		console.log(selectedBirthCity)
        // 		return (
        // 			<Autocomplete
        // 				css={css`
        // 					padding-bottom: 14px;
        // 				`}
        // 				{...defaultProps}
        // 				id="disable-close-on-select"
        // 				disableCloseOnSelect={false}
        // 				value={
        // 					defaultProps.options.find((option) => {
        // 						console.log(props.rowData.birthCity);
        // 						return option.id === props.rowData.birthCity;
        // 					}) || null
        // 				}
        // 				onChange={(e, v) => {
        // 					// Обработчик изменения выбранного значения
        // 					handleBirthCityChange(e, v);
        // 					props.onChange(v ? v.id : null);
        // 				}}
        // 				renderInput={(params) => (
        // 					<TextField {...params} label="Место рождения" variant="standard" />
        // 				)}
        // 			/>
        // 		);
        // 	},
        // },
    ]);

    const containerMy = css`
        padding-left: 0px;
    `
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} align="center">
                <MaterialTable
                    options={{addRowPosition: "first"}}
                    title="Editable Preview"
                    columns={columns}
                    data={allDvishenie}
                    actions={[
                        {
                            icon: () => <ControlPointIcon fontSize="large" color="primary"/>,
                            tooltip: 'Добавить запись',
                            isFreeAction: true,
                            onClick: (event, rowData) => handleAdd(event, rowData),
                        },
                        {
                            icon: () => <EditIcon fontSize="default" color="primary"/>,
                            tooltip: 'Редактировать',
                            onClick: (event, rowData) => handleEdit(event, rowData)
                        },
                        {
                            icon: () => <AutoDeleteIcon fontSize="default" color="primary"/>,
                            tooltip: 'Удалить',
                            onClick: (event, rowData) => {
                                if (window.confirm('Вы уверены, что хотите удалить эту строку?')) handleDelete(rowData);
                            }
                        }
                    ]}
                    // editable={{
                    //     onRowAdd: (newData) =>
                    //         new Promise((resolve, reject) => {
                    //             setTimeout(() => {
                    //                 const newDataArray = [...data, newData]; // Создаем новый массив с новой строкой в начале
                    //                 setData(newDataArray);
                    //                 resolve();
                    //             }, 1000);
                    //         }),
                    //     // onRowUpdate: (newData, oldData) =>
                    //     //     new Promise((resolve, reject) => {
                    //     //         setTimeout(() => {
                    //     //             const dataUpdate = [...data];
                    //     //             const index = dataUpdate.findIndex((item) => item.id === oldData.id);
                    //     //             console.log(newData);
                    //     //             dataUpdate[index] = newData;
                    //     //             setData([...dataUpdate]);
                    //     //             resolve();
                    //     //         }, 1000);
                    //     //     }),
                    //     // onRowDelete: (oldData) =>
                    //     //     new Promise((resolve, reject) => {
                    //     //         setTimeout(() => {
                    //     //             const dataDelete = [...data];
                    //     //             const index = dataDelete.findIndex((item) => item.id === oldData.id);
                    //     //             dataDelete.splice(index, 1);
                    //     //             setData([...dataDelete]);
                    //     //             resolve();
                    //     //         }, 1000);
                    //     //     }),
                    // }}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <AddForm_DvishenieMTR _open={_openDialog} _openSet={_openDialogSet} dummy={dummy}/>
            </Grid>
            <Grid item xs={12} align="center">
                <EditForm_DvishenieMTR _open={_openEditDialog} _openSet={_openEditDialogSet} dummy={dummy}/>
            </Grid>
        </Grid>
    )
}