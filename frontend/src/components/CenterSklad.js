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
    Form, Scrolling, Toolbar, SearchPanel, HeaderFilter, Button, FilterRow
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import {Item, CustomRule, RequiredRule, ButtonItem, SimpleItem} from 'devextreme-react/form';
import CustomStore from "devextreme/data/custom_store";
import CustomForm_edit_add from "../components/CenterSklad/CustomForm_edit_add";
import {QueryClient, useQueryClient} from "react-query";
import {number} from "yup";
import Box, {Item as BoxItem} from 'devextreme-react/box';
import {confirm} from 'devextreme/ui/dialog';


const dataGridBorder = css`
    .dx-datagrid .dx-row-lines > td {
        border: 1px solid #e0e0e0 !important;
    }
`


export default function CenterSklad(props) {
    const queryClient = useQueryClient();
    const [editingRow, setEditingRow] = useState(null) // строка которая редиктируется
    const [isEditing, setIsEditing] = useState(null)// открывать ли меню popup
    const [rowIndex, setRowIndex] = useState(null) // индекс строки для редактирования
    const [errorList, setErrorList] = useState(null) //  список ошибок который возвращается от сервера - валид-ия 2-го уровня
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
    } = useEditSkladMagaz({
        onSuccess: (data) => {
            // Обновить кэшированные данные
            queryClient.invalidateQueries(['getAllSkladMagaz']);
        },
        // Если мутация завершилась ошибкой
        onError: (error, newData, context) => {
            // Если статус 400 записываем ошибки в массив
            console.log(error.response.data?.errors)
            setErrorList(error.response.data?.errors)
        },
        // Всегда выполняется после вызова onSuccess или onError
        onSettled: () => {
            // Обновить список пользователей
            queryClient.invalidateQueries(['getAllSkladMagaz']);
        },
    })
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
                    console.log("не загружено");
                    resolve([]); // Возвращаем пустой массив, пока данные загружаются
                    return;
                }
                if (error_) {
                    reject(new Error("Data loading error"));
                    return;
                }
                resolve({
                    data: data_.data.allSklad,
                    totalCount: data_.data.allSklad.length,
                });
            });
        },
        insert: (values) => {
            return new Promise(async (resolve, reject) => {
                InsertSkladMagaz.mutate(values, {
                    onSuccess: (data) => {
                        // Обновить кэшированные данные
                        queryClient.invalidateQueries(['getAllSkladMagaz']);
                        resolve()
                    },
                    // Если мутация завершилась ошибкой
                    onError: (error, newData, context) => {
                        // Если статус 400 записываем ошибки в массив
                        console.log(error.response.data?.errors)
                        reject(error)
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
                EditSkladMagaz({newData: {...RowData, ...values}, id: key},
                    {
                        onSuccess: (data) => {
                            setErrorList(null)
                            resolve(data); // Результат успешного обновления
                        },
                        onError: (error) => {
                            console.error(error.response.data?.errors);
                            setErrorList(error.response.data?.errors)
                            reject(error); // Ошибка обновления, падаем в catch
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
            console.log(123, error.message);
        }
        // Можно также добавить другие методы, такие как insert, update, remove
    }), [data_, isLoading_, error_]);

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
        if (isDataLoaded && isSuccess_) {
            // Используем current.instance для доступа к методам DataGrid
            //gridRef.current.instance.editRowKey = 0;
            //gridRef.current.instance.editRow(0)
            console.log(gridRef.current.instance.getVisibleRows())
            if (searchParams.get("module") === "skladMagazin" && searchParams.get('edit') !== undefined) {
                const keyRow = Number(searchParams.get('edit'))
                const indexRow = gridRef.current.instance.getRowIndexByKey(keyRow)
                const dataRow = data_.data.allSklad.find(item => item.id === keyRow)
                setIsEditing(true)
                setEditingRow(dataRow)
                setRowIndex(indexRow)
            }
        }
    }, [isSuccess_, isDataLoaded, searchParams]);


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
        onClick: () => {
            if (formRef.current) {
                formRef.current.resetValues();
            }
        }
    };


    const onToolbarPreparing = (e) => {
        const toolbarItems = e.toolbarOptions.items;
        // Добавить кнопку с иконкой "plus"
        toolbarItems.push({
            location: 'after',
            widget: 'dxButton',
            options: {
                text: 'Очистить фильтр',
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
            confirm('Вы уверены что ходите удалить запись?', "Подтверждение удаления")
                .then((dialogResult) => {
                    if (dialogResult) {
                        resolve();
                    } else {
                        e.cancel = true
                        resolve("Удаление отменено");
                    }
                });
        });
    };
    const valid_type_dvisheniya = (e) => {
        if (errorList) {
            return false
        }
        return true
    }
    const handleRowClick = (e) => {
        setRowIndex(e.rowIndex)
    }
    const handleEditRow = (e) => {
        setIsEditing(true)
        setEditingRow(e.row.data)
        setRowIndex(e.row.rowIndex)
    }
    const handleSave = ({rowIndex, formData}) => {
        const key = gridRef.current.instance.getKeyByRowIndex(rowIndex)
        if(key){
            customerStore.update(key, formData)
        }else{
            customerStore.insert(formData)
        }

    };

    const deleteSearchParams = (params) => {
        params.map(item => {
            searchParams.delete(item)
        })
        setSearchParams(searchParams)
    }

    const handleCancel = () => {
        deleteSearchParams(['module', 'edit'])
        setErrorList(null)
        setIsEditing(false);
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
    }

    return (
        <div css={dataGridBorder} style={{width: '100%', overflowX: 'auto'}}>
            <DataGrid
                dataSource={customerStore}
                onContentReady={() => {
                    console.log('DataGrid content is ready and loaded');
                    setIsDataLoaded(true);
                }}
                onToolbarPreparing={onToolbarPreparing} //доб пользовательские кнопки сразу в Toolbar
                keyExpr="id"
                showBorders={true}
                columnAutoWidth={true} // расширяет таблицу автоматически
                onRowRemoving={onRowRemoving}
                onRowClick={handleRowClick}
                onInitialized={e => {
                    setErrorList(null)
                }}
                ref={gridRef}
                rowAlternationEnabled={true}
            >
                {/* для возможности скролинга когда много стобцов*/}
                <Scrolling mode="standard"/>
                <Paging enabled={true}/>
                <HeaderFilter visible={true}/>
                <SearchPanel visible={true} width={300}/>
                <FilterRow visible={true}/>

                {/* Дефолтная колонка командных кнопок с добавлением своей кнопки */}
                <Column
                    caption="Действия"
                    type="buttons"
                    buttons={[
                        {
                            hint: 'Редактирование',
                            icon: 'edit',
                            onClick: handleEditRow,
                        }
                        , 'delete'
                    ]}
                />
                <Column
                    dataField="my_date"
                    caption="Дата"
                    dataType="date"
                    //width={70}
                />
                <Column
                    dataField="peredano"
                    caption="Передано"
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
                />
                <Column
                    dataField="date_vhod_document"
                    caption="Дата вход. документа"
                    dataType="date"
                />
                <Column
                    dataField="enc"
                    caption="ЕНС"
                    //width={70}
                >
                    <Lookup
                        dataSource={data_?.data.enc}
                        displayExpr="name"
                        valueExpr="id"
                    />
                </Column>
                <Column
                    dataField="nomer_dogovora"
                    caption="Номер договора"
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
                    format={{type: 'fixedPoint', precision: 2}}
                />
                <Column
                    dataField="type_dvisheniya"
                    caption="Тип движения"
                    //width={70}
                />

                <Column
                    dataField="count"
                    caption="Количество"
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
                    minWidth={170}
                />
                <Column
                    dataField="user"
                    caption="Пользователь"
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
                    <Item name="addRowButton" location="before" showText="always" options={{width: "600px"}} options={{
                        text: 'Добавить запись ',
                        onClick: (e) => (handleAddRow(e)),
                    }}/>
                    <Item name="searchPanel" location="before"/>
                </Toolbar>

            </DataGrid>
            {isEditing &&
                <CustomForm_edit_add visible={isEditing} data={editingRow} onSave={handleSave} errorList={errorList}
                                     setErrorList={setErrorList}
                                     onCancel={handleCancel} refDataGrid={gridRef} rowIndex={rowIndex}/>}
        </div>
    )
}