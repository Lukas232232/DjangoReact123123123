/** @format */
import React, {useState} from "react";
import {Grid,} from "@mui/material";
import {useAsyncValue,} from "react-router-dom";

import {css} from "@emotion/react";
import MaterialTable from "@material-table/core";

import EditForm_DvishenieMTR from "./AddForm_DvishenieMTR";
import EditIcon from '@mui/icons-material/Edit';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

export default function DvishenieMTR(props) {
    // Содержит все данные из loader запроса
    const query = useAsyncValue()
    const {allDvishenie, rudnik, istochnik, type_rabot, enc, user, verbose_name} = query;
    // Данные для Списков с автозаполеннием
    const defaultProps = {
        options: [
            {id: 34, title: "İstanbul"},
            {id: 63, title: "Şanlıurfa"},
        ],
        getOptionLabel: (option) => option.title,
    };
    // открывает диалоговое окно для редактирование записи
    const [_openEditDialog, _openEditDialogSet] = useState(false);
    const [dummy, setDummy] = useState(0) // для возвожности когда происходит такое присваение в state значения как и было

    // метод удаления записи
    const handleDelete = async (rowdata) => {
        console.log("")
    }

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
    const handleEdit = (e, rowData) => {
        _openEditDialogSet(true)
        setDummy(prevDummy => prevDummy + 1);
    }

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
    `;

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
                            tooltip: 'Моя пользовательская операция',
                            isFreeAction: true,
                            onClick: (event, rowData) => handleEdit(event, rowData),
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
                <EditForm_DvishenieMTR _open={_openEditDialog} dummy={dummy}/>
            </Grid>
        </Grid>
    )
}