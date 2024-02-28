/** @format */
import React, {useState} from "react";
import {Grid,} from "@mui/material";
import {useAsyncValue,} from "react-router-dom";

import {css} from "@emotion/react";
import MaterialTable from "@material-table/core";

import EditForm_DvishenieMTR from "./EditForm_DvishenieMTR";
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
export default function DvishenieMTR(props) {
    // Содержит все данные из loader запроса
    const query = useAsyncValue()
    const {allDvishenie, rudnik, istochnik, type_rabot, verbose_name} = query;
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

    const [rudnikLookup, setRudnikLookup] = useState(() => {
        const data = {}
        rudnik.map((one) => {
            data[one.id] = one.name
        })
        return data; // Возвращаем результат вычислений
    });
    console.log(rudnikLookup)
    // настриваем колонки
    const [columns, setColumns] = useState([
        {title: "ID", field: "id", hidden: false},
        {
            title: "Рудник/Склад", field: "rudnik", lookup: rudnikLookup
        },
        {
            title: "Реальная дата", field: "real_date", initialEditValue: "", render: rowData => {
                const date = new Date(rowData.real_date);
                const day = date.getDate().toString().padStart(2, '0');    // Получаем день, делаем двухзначный
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Получаем месяц (начиная с 0), делаем двухзначный
                const year = date.getFullYear();                            // Получаем год
                const formattedDate = `${day}.${month}.${year}`; // Собираем форматированную строку даты
                // Форматирование времени
                const hours = date.getHours().toString().padStart(2, '0');  // Получаем часы, делаем двухзначный
                const minutes = date.getMinutes().toString().padStart(2, '0'); // Получаем минуты, делаем двухзначный
                const seconds = date.getSeconds().toString().padStart(2, '0'); // Получаем секунды, делаем двухзначный

                const formattedTime = `${hours}:${minutes}:${seconds}`;
                return `${formattedDate} ${formattedTime}`;
            }
        },
        {title: "Дата", field: "my_date", type: "numeric"},
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
      padding-left: 26px;
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
                            icon: () => <EditIcon fontSize="default" color="primary" />,
                            tooltip: 'Редактировать',
                            onClick: (event, rowData) => handleEdit(rowData)
                        },
                        {
                            icon: () => <RemoveIcon fontSize="default" color="primary" />,
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
                    //     onRowUpdate: (newData, oldData) =>
                    //         new Promise((resolve, reject) => {
                    //             setTimeout(() => {
                    //                 const dataUpdate = [...data];
                    //                 const index = dataUpdate.findIndex((item) => item.id === oldData.id);
                    //                 console.log(newData);
                    //                 dataUpdate[index] = newData;
                    //                 setData([...dataUpdate]);
                    //                 resolve();
                    //             }, 1000);
                    //         }),
                    //     onRowDelete: (oldData) =>
                    //         new Promise((resolve, reject) => {
                    //             setTimeout(() => {
                    //                 const dataDelete = [...data];
                    //                 const index = dataDelete.findIndex((item) => item.id === oldData.id);
                    //                 dataDelete.splice(index, 1);
                    //                 setData([...dataDelete]);
                    //                 resolve();
                    //             }, 1000);
                    //         }),
                    // }}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <EditForm_DvishenieMTR _open={_openEditDialog}/>
            </Grid>
        </Grid>
    )
}