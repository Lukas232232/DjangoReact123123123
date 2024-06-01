/** @format */
import React, {useEffect, useRef, useState} from "react";
import {useAsyncValue, useLocation, useNavigate, useSearchParams,} from "react-router-dom";

import {css} from "@emotion/react";

import AddForm_DvishenieMTR from "./AddForm_DvishenieMTR";
import EditForm_DvishenieMTR from "./EditForm_DvishenieMTR";

import {useAllSkladMagaz} from "../hook/useReactQuery"
import {useLeftMenu, useTodos} from "../store/storeZustand";
import DataGrid, {
    Column,
    Editing,
    Popup,
    Paging,
    Lookup,
    Form, Scrolling, Toolbar, SearchPanel, HeaderFilter
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import {Item, CustomRule, RequiredRule, ButtonItem, SimpleItem} from 'devextreme-react/form';

const dataGridBorder = css`
    .dx-datagrid .dx-row-lines > td {
        border: 1px solid #e0e0e0 !important;
    }
`
export default function CenterSklad(props) {
    const [errorList, setErrorList] = useState(null)
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Флаг для отслеживания загрузки данных
    // объект таблицы устанавливается через параметр datagrid - onInitialized
    const gridRef = useRef(null);
    const formRef = useRef(null)
    const [gridInstance, setGridInstance] = useState(null)
    // установка для левог оменю
    const leftMenu = useLeftMenu((state) => (state.setMenu))
    useEffect(() => {
        leftMenu([
            {
                name: "Склад123",
                item: [
                    {nameItem: "Menu-11", url: "/edit/rer/erer"},
                    {nameItem: "Menu-22", url: "/edit/rer/erer"}
                ],
            }
        ]);
    }, [leftMenu]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [dummy, setDummy] = useState(0) // для возвожности следить за изменением переменной при открытии любых окон
    // запрос всех записей из склада
    const {
        data: data_, isLoading: isLoading_, isSuccess: isSuccess_, isError: isError_, error: error_
    } = useAllSkladMagaz({refetchOnWindowFocus: false})


    // Используем useEffect для определения экземпляра datagrid
    useEffect(() => {
        if (isDataLoaded && isSuccess_) {
            // Используем current.instance для доступа к методам DataGrid
            //gridRef.current.instance.editRowKey = 0;
            //gridRef.current.instance.editRow(0)
            console.log(gridRef.current.instance.getVisibleRows())
        }
    }, [isSuccess_, isDataLoaded]);


    // обрабатываем событие изменения get параметров в адресной строке что бы можно было открывать окна без кнопки а по запросу
    useEffect(() => {
        if (searchParams.get("module") === "skladMagazin" && searchParams.get('edit') !== undefined) {
            _openEditDialogSet(true)
            setDummy(prevDummy => prevDummy + 1);
        }
    }, [searchParams])

    console.log("В работе")

    if (isLoading_) {
        return <div>Загрузка...</div>;
    }

    if (error_) {
        return <div>Ошибка: {error_.message}</div>;
    }


    const buttonOptions = {
        text: "Do Something",
        type: "success",
        onClick: () => {
            if (formRef.current) {
                formRef.current.resetValues();
            }
        }
    };


    const onInitializedForm = (e) => {
        formRef.current = e.component

    };

    const onToolbarPreparing = (e) => {
        const toolbarItems = e.toolbarOptions.items;
        // Добавить кнопку с иконкой "plus"
        toolbarItems.push({
            location: 'after',
            widget: 'dxButton',
            options: {
                text: 'Custom Button2',
                icon: 'plus',
                onClick: () => {
                    setErrorList(pre => ("Привет"));
                    // Ваша логика для добавления новой строки
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
        return new Promise((resolve, reject) => {
            if (window.confirm("Вы уверены, что хотите удалить эту строку?")) {
                resolve();
            } else {
                e.cancel = true;
                reject("Удаление было отменено.");
            }
        });
    };


    const valid_type_dvisheniya = (e) => {
        if (errorList) {
            return false
        }
        return true
    }

    return (
        <div css={dataGridBorder} style={{width: '100%', overflowX: 'auto'}}>
            <DataGrid

                // onRowPrepared={(e) => {
                //     if (e.data ) {
                //         e.component.editRow(0); // Открываем редактирование для нужной строки
                //     }
                // }}

                dataSource={data_.data.allSklad}
                onContentReady={() => {
                    console.log('DataGrid content is ready and loaded');
                    setIsDataLoaded(true);
                }}// Устанавливаем флаг, когда данные загружены
                //onInitialized={(e) => setGridInstance(e.component)} // Сохраняет экземпляр DataGrid
                onToolbarPreparing={onToolbarPreparing} //доб пользовательские кнопки сразу в Toolbar
                keyExpr="id"
                showBorders={true}
                columnAutoWidth={true} // расширяет таблицу автоматически
                onRowRemoving={onRowRemoving}
                ref={gridRef}
            >
                {/* для возможности скролинга когда много стобцов*/}
                <Scrolling mode="standard"/>
                <Paging enabled={true}/>
                <HeaderFilter visible={true}/>
                <SearchPanel visible={true}/>

                <Column
                    dataField="type_dvisheniya"
                    caption="Тип движения"
                    //width={70}
                />
                <Column
                    dataField="my_date"
                    caption="Дата"
                    dataType="date"
                    //width={70}
                />
                <Column
                    dataField="date_vipuska"
                    caption="Дата выпуска"
                    //width={70}
                />
                <Column
                    dataField="enc"
                    caption="ЕНС"
                    //width={70}
                />
                <Column
                    dataField="count"
                    caption="Количество"
                    //width={70}
                />
                <Column
                    dataField="comment"
                    caption="Комментарий"
                    width={170}
                />
                <Column
                    dataField="user"
                    caption="Пользователь"
                />
                <Column
                    dataField="peredano"
                    caption="Передано"
                />
                <Column
                    dataField="type_postupleniya"
                    caption="Тип поступления"
                />
                <Column
                    dataField="nomer_vhod_document"
                    caption="Номер вход. документа"
                />
                <Column
                    dataField="date_vhod_document"
                    caption="Дата вход. документа"
                />
                <Column
                    dataField="nomer_zakaza"
                    caption="Номер заказа"
                />
                <Column
                    dataField="price_za_edinicy"
                    caption="Цена за ед."
                />
                <Column
                    dataField="serial_number"
                    caption="Серийный номер"
                />
                <Column
                    dataField="nomer_dogovora"
                    caption="Номер договора"
                />

                <Editing
                    mode="popup"
                    startEditAction="click" // "click" или "dblClick"
                    allowUpdating={true}
                    allowAdding={true}
                    allowDeleting={true}
                    confirmDelete={false}
                    useIcons={true}
                >
                    <Popup
                        title="Employee Info"
                        showTitle={true}
                        width={700}
                        height={525}
                    />
                    <Form ref={formRef} onInitialized={onInitializedForm}>
                        <Item
                            itemType="group"
                            colCount={1}
                            colSpan={2}
                        >
                            <SimpleItem dataField="count"><CustomRule message={errorList ? errorList : "999"}
                                                                      validationCallback={valid_type_dvisheniya}>

                            </CustomRule>
                            </SimpleItem>
                            <SimpleItem
                                dataField="comment"
                                editorType="dxTextBox"
                            >
                                <RequiredRule message="Password is required"/>
                            </SimpleItem>
                            <Item dataField="type_dvisheniya">
                                <CustomRule message={errorList ? errorList : ""}
                                            validationCallback={valid_type_dvisheniya}></CustomRule>
                            </Item>
                            <Item dataField="enc"/>
                            <Item dataField="user"/>

                            <ButtonItem horizontalAlignment="left" name="Reset"
                                        buttonOptions={buttonOptions}>Привет</ButtonItem>
                        </Item>
                    </Form>
                </Editing>
                <Toolbar>
                    <Item name="addRowButton" location="before" showText="always" options={{
                        text: 'Добавить запись '
                    }}/>
                    <Item name="searchPanel" location="before"/>
                </Toolbar>
            </DataGrid>
        </div>
    )
}