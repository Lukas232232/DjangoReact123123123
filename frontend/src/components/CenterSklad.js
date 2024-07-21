/** @format */
import React, {useEffect, useRef, useState, useMemo} from "react";
import {useAsyncValue, useLocation, useNavigate, useSearchParams,} from "react-router-dom";

import {css} from "@emotion/react";

import {useAllSkladMagaz, useDeleteSkladMagaz, useEditSkladMagaz, useInsertSkladMagaz} from "../hook/useReactQuery"
import {useLeftMenu, useTodos} from "../store/storeZustand";
import DataGrid, {
    Column,
    Editing,
    Popup,
    Paging,
    Lookup,
    Form, Scrolling, Toolbar, SearchPanel, HeaderFilter, FilterRow, Pager
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import 'devextreme-react/text-area';
import {Item, CustomRule, RequiredRule, ButtonItem, SimpleItem} from 'devextreme-react/form';
import CustomStore from "devextreme/data/custom_store";
import CustomForm_edit_add from "../components/CenterSklad/CustomForm_edit_add";
import CustomForm_RashodCS from "../components/CenterSklad/CustomForm_RashodCS";
import {QueryClient, useQueryClient} from "react-query";
import Box, {Item as BoxItem} from 'devextreme-react/box';
import {confirm} from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import Alert from "@mui/material/Alert";

const dataGridBorder = css`

    .dx-datagrid .dx-row-lines > td {
        border: 1px solid #e0e0e0 !important;
    }

    //.dx-datagrid .dx-row:not(.dx-alternate-row) {
    //    background-color: #8fb576 !important; /* Цвет для обычных строк */
    //}

    .dx-datagrid .dx-row-alt > td, .dx-datagrid .dx-row-alt > tr > td {
        background-color: #e5e5e5 !important; /* Светлый цвет для чередующихся строк */
    }

    .dx-datagrid-rowsview .dx-row-focused.dx-data-row .dx-command-edit .dx-link,
    .dx-datagrid-rowsview .dx-row-focused.dx-data-row > td:not(.dx-focused):not(.dx-cell-modified):not(.dx-datagrid-invalid) {
        background-color: #47acad !important; /* Замените на желаемый цвет */
    }

    .dx-datagrid-borders > .dx-datagrid-pager {
        display: flex;
        justify-content: left;
    }

    .dx-pager .dx-page-sizes {
        margin-right: 400px;
    }

    .dx-button-text {
        color: black !important;
    }

    .dx-button.dx-button-success .dx-icon {
        color: black;
    }
`


export default function CenterSklad(props) {
    const queryClient = useQueryClient();
    const [editingRow, setEditingRow] = useState(null) // строка которая редиктируется
    const [isEditing, setIsEditing] = useState(null)// открывать меню popup для редактирования
    const [isRashod, setIsRashod] = useState(null)// открывать меню popup для Рахода ЦС
    const [rowIndex, setRowIndex] = useState(null) // индекс строки для редактирования
    const [rowKey, setRowKey] = useState(null) // Ключ строки для редактирования
    const [errorList, setErrorList] = useState(null) //  список ошибок который возвращается от сервера - валид-ия 2-го уровня
    const [errorLostRashod, setErrorListRashod] = useState(null) //  список ошибок который возвращается от сервера - валид-ия 2-го уровня
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Флаг для отслеживания загрузки данных
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();
    // объект таблицы устанавливается через параметр datagrid - onContentReady
    const gridRef = useRef(null); // ссылка на DataGrid
    const formRef = useRef(null) // ссылка на форму
    // установка для левого меню
    const leftMenu = useLeftMenu((state) => (state.setMenu))
    // делаем запрос к БД для получения всех записей в таблицу
    const {
        data: data_, isLoading: isLoading_, isSuccess: isSuccess_, isError: isError_, error: error_
    } = useAllSkladMagaz({refetchOnWindowFocus: false})
    // reactquery - изменение данных в БД
    const {
        mutate: EditSkladMagaz, isError: isErrorEditSklad, error: errorEditSklad, isLoading: isLoadingEditSklad,
        isSuccess: isSuccessEditSklad, refetch: refetchEditSklad, data: editSkladData
    } = useEditSkladMagaz()
    // Удаление записи через API запрос
    const DeleteSkladMagaz = useDeleteSkladMagaz()

    // добавление данных в таблицу
    const InsertSkladMagaz = useInsertSkladMagaz()

    // исползуем CustomeStore для загрузки, обновления, и дабавления записи в devExpress datagrid
    const customerStore = React.useMemo(() => new CustomStore({
        key: "id",
        load: () => {
            return new Promise((resolve, reject) => {
                if (isLoading_) {
                    resolve([]); // Возвращаем пустой массив, пока данные загружаются
                    return;
                }
                if (error_) {
                    reject(new Error("Data loading error"));
                    return;
                }
                console.log("Загружено")
                resolve({
                    data: data_.data.allSklad,
                    totalCount: data_.data.allSklad.length,
                });
            });
        },
        insert: (values) => {
            return new Promise(async (resolve, reject) => {
                await InsertSkladMagaz.mutate(values, {
                    onSuccess: (data) => {
                        console.log("onSuccess")
                        queryClient.invalidateQueries(['getAllSkladMagaz']);
                        resolve(data); // Результат успешного обновления
                    },
                    // Если мутация завершилась ошибкой
                    onError: (error, newData, context) => {
                        console.log("onError")
                        setErrorList(error.response.data?.errors)
                        gridRef.current.instance.saveEditData()
                        reject(error);
                    },
                    // Всегда выполняется после вызова onSuccess или onError
                    onSettled: () => {
                        // Обновить список пользователей
                        queryClient.invalidateQueries(['getAllSkladMagaz']);
                    },
                })
            })
        },
        update: (key, values) => {
            return new Promise(async (resolve, reject) => {
                const allData = await gridRef.current.instance.getDataSource().load()
                const RowData = allData.find((item) => (item.id === key))
                setErrorList(null)
                await EditSkladMagaz({newData: {...RowData, ...values}, id: key},
                    {
                        onSuccess: (data) => {
                            console.log("onSuccess")
                            queryClient.invalidateQueries(['getAllSkladMagaz']);
                            resolve(data); // Результат успешного обновления
                        },
                        onError: (error) => {
                            console.log("onError")
                            setErrorList(error.response.data?.errors)
                            gridRef.current.instance.saveEditData()
                            reject(error);
                        },
                    }
                )
            })
        },
        remove: (key) => {
            return new Promise(async (resolve, reject) => {
                DeleteSkladMagaz.mutate({id: key},
                    {
                        onSuccess: (data) => {
                            console.error(data);
                            resolve(data); // Результат успешного обновления
                        },
                        onError: (error) => {
                            console.error(error);
                            reject(error); // Ошибка обновления, падаем в catch
                        },
                        onSettled: () => {
                            // Обновить список записей
                            queryClient.invalidateQueries(['getAllSkladMagaz']);
                        },
                    }
                )
            })
        },
        errorHandler: (error) => {
            console.log(error)
        }
        // Можно также добавить другие методы, такие как insert, update, remove
    }), [data_]);

    // Правила валидации для всех полей
    const validateRules = {
        nomer_vhod_document: [
            {type: 'required', message: 'Это поле обязательно для заполнения.'},
            //{type: 'stringLength', min: 3, max: 10, message: 'Длина должна быть от 3 до 10 символов.'},
            //{type: 'pattern', pattern: '^[0-9]+$', message: 'Только цифры допустимы.'},
            {
                type: 'custom',
                validationCallback: (e) => e.value !== '0000',
                message: 'Значение не должно быть "0000".'
            },

        ],
        count: [
            {
                type: 'custom',
                validationCallback: (e) => {
                    if (errorList?.count) {
                        return false
                    }
                    return true
                },
                message: errorList?.count !== undefined ? errorList?.count[0] : ""
            },
        ],
        my_date: [
            {type: 'required', message: 'Это поле обязательно для заполнения.'}
        ],
        type_postupleniya: [
            {type: 'required', message: 'Это поле обязательно для заполнения.'}
        ]
    }


    // Устанавливаем для этого компонента ЛЕвое меню
    // useEffect(() => {
    //     leftMenu([
    //         {
    //             name: "Склад123123123123",
    //             item: [
    //                 {nameItem: "Menu-11", url: "/edit/rer/erer"},
    //                 {nameItem: "Menu-22", url: "/edit/rer/erer"}
    //             ],
    //         }
    //     ]);
    // }, [leftMenu]);

    // определения экземпляра datagrid к которому можно будет обращаться после полной его загрузки
    useEffect(() => {
        (async () => {
            if (isSuccess_ && isDataLoaded) {
                // Используем current.instance для доступа к методам DataGrid
                //gridRef.current.instance.editRowKey = 0;
                //gridRef.current.instance.editRow(0)
                //console.log(gridRef.current.instance.getVisibleRows())
                if (searchParams.get("module") === "skladMagazin" && searchParams.get('edit') !== undefined) {
                    const keyRow = Number(searchParams.get('edit'))
                    const dataRow = data_.data.allSklad.find(item => item.id === keyRow)
                    if (dataRow) {
                        setIsEditing(true)
                        setEditingRow(dataRow)
                        setRowKey(dataRow.id)
                    } else {
                        notify("Нет такого ID для редактирования!", 'error', 3000)
                        deleteSearchParams()
                    }
                }
            }
        })()
    }, [isDataLoaded, searchParams, isSuccess_]);


    // // обрабатываем событие изменения get параметров в адресной строке что бы можно было открывать окна без кнопки а по запросу
    // useEffect(() => {
    //     if (searchParams.get("module") === "skladMagazin" && searchParams.get('edit') !== undefined) {
    //         _openEditDialogSet(true)
    //         setDummy(prevDummy => prevDummy + 1);
    //     }
    // }, [searchParams])


    const buttonOptions = {
        text: "Do Something",
        type: "success",
        stylingMode: "contained",
        onClick: () => {
            if (formRef.current) {
                formRef.current.resetValues();
            }
        }
    };

    // метод добавления кнопок в Toolbar
    const onToolbarPreparing = (e) => {
        const toolbarItems = e.toolbarOptions.items;
        // Добавить кнопку с иконкой "plus"
        toolbarItems.push({
            location: 'after',
            widget: 'dxButton',
            options: {
                text: 'Очистить фильтр',
                type: "success",
                stylingMode: "contained",
                icon: 'plus',
                onClick: () => {
                    gridRef.current.instance.clearFilter();
                }
            }
        });
        // Добавить пользовательскую кнопку с текстом
        toolbarItems.push({
            location: 'after',
            widget: 'dxButton',
            options: {
                type: "success",
                stylingMode: "contained",
                text: 'Custom Button',
                onClick: () => {
                    console.log('Custom Button clicked');
                    // Ваша логика для данной кнопки
                }
            }
        });
    };

    const onRowRemoving = (e) => {
        // Отмена стандартного поведения удаления
        return e.cancel = new Promise((resolve, reject) => {
            confirm('Точно удалить запись?', "Подтверждение удаления",)
                .then((dialogResult) => {
                    if (dialogResult) {
                        resolve();
                    } else {
                        e.cancel = true
                        reject("Удаление отменено");
                    }
                }).catch((e) => {
                reject("Отмена удаления!")
            })

        })
    };

    const handleRowClick = (e) => {
        setRowIndex(e.rowIndex)
        setRowKey(e.key)
    }
    const handleEditRow = (e) => {
        setIsEditing(true)
        setEditingRow(e.row.data)
        setRowIndex(e.row.rowIndex)
        setRowKey(e.row.key)
    }
    const handleSave = ({rowKey, formData}) => {
        if (rowKey) {
            return customerStore.update(rowKey, formData)
        } else {
            return customerStore.insert(formData)
        }

    };

    const handleSaveRashod = ({rowKey, formData}) => {
        return customerStore.insert(formData)
    };


    const deleteSearchParams = (params) => {
        if (params) {
            params.map(item => {
                searchParams.delete(item)
            })
            setSearchParams(searchParams)
        } else {
            setSearchParams({})
        }
    }

    const handleCancel = () => {
        deleteSearchParams(['module', 'edit'])
        setErrorList(null)
        setIsEditing(false);
    };
    const handleCancelRashod = () => {
        setErrorListRashod(null)
        setIsRashod(null);
    };
    // Маска для вода даты производ
    const dateEditorOptions = {
        mask: '00-00', // Маска для формата YYYY-MM-DD
        placeholder: 'MM-YY',
    };
    // Кастомный метод добавления новой записи
    const handleAddRow = (e) => {
        setIsEditing(true)
        setEditingRow(null)
        setRowIndex(null)
        setRowKey(null)
    }
    // Метод для кнопки Расход оборудования ЦС
    const handleAddRashod = (e) => {
        setIsRashod(true)
        setEditingRow(null)
        setRowIndex(null)
    }

    const handleContentReady = (e) => {
        setIsDataLoaded(true);
    };

    const handleDataErrorOccurred = (e) => {
        console.log(e)
        // // Вывод уведомления при возникновении ошибки
        // notify(e.error.message, 'error', 3000);
    };

    const handleEditingStop = () => {
        setErrorList(null)
    }

    const handleOptionChanged = (e) => {
        if (e.name === 'editing' || e.name === "focusedRowKey") {
            setErrorList(null)
            console.log('Editing option changed:', e.value);
        }
    }


    return (
        <div css={dataGridBorder} style={{width: '100%', overflowX: 'auto'}}>
            {errorList && Object.entries(errorList).map(([key, value]) => {
                const caption = gridRef.current.instance.columnOption(key, 'caption')
                notify(`${caption}: ${value[0]}!!!`, 'error', 3000)
                return
            })}
            <DataGrid
                keyExpr="id"
                onOptionChanged={handleOptionChanged}
                onEditCanceled={handleEditingStop}
                onEditCanceling={handleEditingStop}
                onDataErrorOccurred={handleDataErrorOccurred} // ошибки которые не обработаны выводит
                dataSource={customerStore}
                onContentReady={handleContentReady}
                onToolbarPreparing={onToolbarPreparing} //доб пользовательские кнопки сразу в Toolbar
                showBorders={true}
                //onCellPrepared={handleCellPrepared} // используется для изменения внешнего вида, не для данныых
                columnAutoWidth={true} // расширяет таблицу автоматически
                onRowRemoving={onRowRemoving}
                onRowClick={handleRowClick}
                repaintChangesOnly={true}
                onInitialized={e => {
                    setErrorList(null)
                }}
                ref={gridRef}
                rowAlternationEnabled={true}
                focusedRowEnabled={true}
            >
                <Paging defaultPageSize={10} enabled={true}/>
                <Pager
                    visible={true}
                    allowedPageSizes={[10, 25, 'all']}
                    displayMode={"full"}
                    showPageSizeSelector={true}
                    showInfo={true}
                    showNavigationButtons={true}
                />
                {/* для возможности скролинга когда много стобцов*/}
                <Scrolling mode="standard"/>
                <HeaderFilter visible={true}/>
                <SearchPanel visible={true} width={250}/>
                <FilterRow visible={true}/>
                {/* Дефолтная колонка командных кнопок с добавлением своей кнопки */}
                <Column
                    caption="Действия"
                    type="buttons"
                    buttons={[
                        {
                            hint: 'Редактирование!!!!!',
                            icon: 'edit',
                            onClick: handleEditRow,
                        },
                        {
                            name: 'delete', // Оставляем поведение по умолчанию
                            hint: 'Удаление',
                        }
                    ]}
                />
                <Column
                    dataField="my_date"
                    caption="Дата"
                    dataType="date"
                    allowEditing={false}
                    format="dd.MM.yyyy"
                    //width={70}
                />
                <Column
                    dataField="peredano"
                    caption="Передано"
                    allowEditing={false}
                >
                    <Lookup
                        dataSource={data_?.data.rudnik}
                        displayExpr="name"
                        valueExpr="id"
                    />
                </Column>
                <Column
                    dataField="nomer_vhod_document"
                    caption="Номер вход. документа"
                    validationRules={validateRules.nomer_vhod_document}
                />
                <Column
                    dataField="date_vhod_document"
                    caption="Дата вход. документа"
                    dataType="date"
                />
                <Column
                    minWidth={100}
                    dataField="enc"
                    caption="ЕНС"
                    validationRules={[
                        {type: "required", message: "Обязательное поле"},
                    ]}
                    //width={70}
                >
                    <Lookup
                        dataSource={data_?.data.enc}
                        displayExpr="enc"
                        valueExpr="id"
                    />

                </Column>
                <Column
                    dataField="name"
                    caption="Наименование"
                    allowEditing={false}
                    calculateCellValue={(rowData) => {
                        const encList = [...data_?.data.enc]
                        const value = encList.find(item => (rowData.enc === item.id))
                        return value ? value.name : ''
                    }}// Пример вычисления
                />
                <Column
                    dataField="nomer_dogovora"
                    caption="Номер договора"
                    allowEditing={false}
                >
                    <Lookup
                        dataSource={data_?.data.nomer_dogovora}
                        displayExpr="nomer_dogovora"
                        valueExpr="id"
                    />
                </Column>
                <Column
                    dataField="nomer_zakaza"
                    caption="Номер заказа"
                    allowEditing={false}
                >
                    <Lookup
                        dataSource={data_?.data.nomer_zakaza}
                        displayExpr="nomer_document"
                        valueExpr="id"
                    />
                </Column>
                <Column
                    dataField="price_za_edinicy"
                    caption="Цена за ед."
                    dataType="number"
                    validationRules={validateRules.price_za_edinicy}
                    format={{type: 'fixedPoint', precision: 2}}
                />
                <Column
                    dataField="type_dvisheniya"
                    caption="Тип движения"
                    //width={70}
                >
                    <Lookup
                        dataSource={[{name: "Приход"}, {name: 'Расход'}]}
                        displayExpr="name"
                        valueExpr="name"
                    />
                </Column>

                <Column
                    dataField="count"
                    caption="Количество"
                    validationRules={validateRules.count}
                    //width={70}
                />


                <Column
                    dataField="type_postupleniya"
                    caption="Тип поступления"
                >
                    <Lookup
                        dataSource={data_?.data.type_postupleniya}
                        displayExpr="name"
                        valueExpr="id"
                    />
                </Column>
                <Column
                    dataField="serial_number"
                    caption="Серийный номер"
                />
                <Column
                    dataField="comment"
                    caption="Комментарий"
                    minWidth={150}
                    width={350}
                />
                <Column
                    dataField="user"
                    caption="Пользователь"
                    allowEditing={false}
                >
                    <Lookup
                        dataSource={data_?.data.user}
                        displayExpr="name"
                        valueExpr="id"
                    />
                </Column>

                <Editing
                    mode="cell"
                    startEditAction="dblClick" // "click" или "dblClick"
                    allowUpdating={true}
                    allowAdding={true}
                    allowDeleting={true}
                    confirmDelete={false}
                    useIcons={true}
                >
                </Editing>
                <Toolbar>
                    <Item name="searchPanel" location="before">
                        <SearchPanel/>
                    </Item>
                    <Item name="prihodCS" widget='dxButton' location="before" showText="always" options={{
                        width: "230px",
                        icon: 'plus',
                        text: 'Приход оборудования',
                        type: "success", // default или "normal", "success", "danger"
                        stylingMode: "contained", // или "text", "outlined"
                        onClick: (e) => (handleAddRow(e)),
                    }}/>
                    <Item location="before">
                        <Button
                            name="rashodCS"
                            icon='plus'
                            text="Расход оборудования"
                            type="success"
                            stylingMode="contained"
                            onClick={handleAddRashod}/>
                    </Item>
                    <Item name="prihodCS" widget='dxButton' location="before" showText="always" options={{
                        width: "230px",
                        icon: 'plus',
                        text: 'Возврат оборудования',
                        type: "success", // default или "normal", "success", "danger"
                        stylingMode: "contained", // или "text", "outlined"
                        onClick: (e) => (handleAddRow(e)),
                    }}/>
                    <Item name="zaprosNaSklad" widget='dxButton' location="before" showText="always" options={{
                        width: "310px",
                        icon: 'plus',
                        text: 'Создать запрос на Склад-Магазин',
                        type: "success", // default или "normal", "success", "danger"
                        stylingMode: "contained", // или "text", "outlined"
                        onClick: (e) => (handleAddRashod(e)),
                    }}/>
                </Toolbar>

            </DataGrid>
            {
                isEditing &&
                <CustomForm_edit_add visible={isEditing} data={editingRow} onSave={handleSave}
                                     errorList={errorList}
                                     setErrorList={setErrorList}
                                     onCancel={handleCancel} refDataGrid={gridRef} rowKey={rowKey}
                                     validateRules={validateRules}/>
            }
            {
                isRashod &&
                <CustomForm_RashodCS visible={isRashod} data={null} onSave={handleSaveRashod}
                                     errorList={errorLostRashod}
                                     setErrorList={setErrorListRashod}
                                     onCancel={handleCancelRashod} refDataGrid={gridRef} rowIndex={null}/>
            }
        </div>
    )
}