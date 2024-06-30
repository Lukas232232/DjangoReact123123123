import React, {useEffect, useRef, useState} from 'react';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import {Popup, Position} from 'devextreme-react/popup';
import {ButtonItem, Form, GroupItem, Item} from 'devextreme-react/form';
import 'devextreme/dist/css/dx.light.css'; // Добавьте путь к вашим стилям
import {Global, css} from "@emotion/react";
import {useQueryClient} from "react-query";
import NumberBox from 'devextreme-react/number-box';
import {ScrollView} from 'devextreme-react/scroll-view';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {format} from 'date-fns';

const cssButton = css`
    .button-container {
        display: flex;
        width: 100%;
        justify-content: end;
    }

    .button-container .dx-item-content {
        padding: 2px;
    }

    .dx-first-row {
        padding-inline-end: 10px !important;
        padding-inline-start: 3px !important;
    }

    .last-group .dx-field-item {
        padding: 0 !important;
    }

    .classTextArea {
        color: #000000 !important;
    }
`

const textArea = css`
    .textAreaENCname textarea {
        color: black !important;
    }
`
const labelStyleForm = css`
    .dx-field-item-label-text {
        color: black !important;
        font-size: 16px;
        font-weight: 700;
    }
`
const combinedStyles = [cssButton, textArea, labelStyleForm];


export default function CustomEditForm({visible, data, onSave, onCancel, rowIndex, errorList, setErrorList}) {
    // Правила ВАЛИДАЦИИ
    const validateRules = {
        my_date: [{type: "required", message: "Данное поле обязательно!"},],
    }

    const popupRef = useRef(null);

    const queryClient = useQueryClient();
    const formRef = useRef()
    const allDataQuery = queryClient.getQueryData('getAllSkladMagaz'); // Получение данных из кэша
    const [formData, setFormData] = useState({...data});
    // метод для сохранения данных
    const handleFormSubmit = (e) => {
        e.preventDefault();
        formRef.current.instance.validate()
        onSave({rowIndex, formData});

    };

    const handleContentReady = (e) => { // устанавливает для поля наряд_заказы начальные значения исходя от поля договора
        const form = e.component
        form.option('items').map((item) => {
            if (item.dataField === "nomer_zakaza") {
                const nomer_dogovora = form.option("formData")['nomer_dogovora']
                const nomers = allDataQuery.data.nomer_zakaza.filter((nomer) => (nomer.nomer_dogovora === nomer_dogovora))
                form.itemOption('nomer_zakaza', 'editorOptions', {dataSource: nomers})
            }
        })
        //form.itemOption('nomer_dogovora', 'editorOptions', {dataSource: []})
    }

    return (<React.Fragment>
        <Popup
            ref={popupRef}
            dragOutsideBoundary={true}
            maxHeight={2000}
            height="95%"
            maxWidth={600}
            visible={visible}
            onHiding={onCancel}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            title="Custom Edit Form"
            resizeEnabled={true}
        >
            <Position at="center" my="center"/>
            <form onSubmit={handleFormSubmit}>
                <Form css={combinedStyles} formData={formData} ref={formRef}
                      onFieldDataChanged={(e) => {
                          setFormData(e.component.option('formData'))
                      }}
                      onContentReady={handleContentReady}
                >
                    <Item
                        dataField="my_date"
                        editorType="dxDateBox"
                        label={{text: "Дата"}}
                        editorOptions={{
                            placeholder: "Введите дату",
                            onValueChanged: (e) => {
                                // Ensure the value is formatted correctly
                                setFormData({
                                    ...formData,
                                    my_date: format(new Date(e.value), 'yyyy-MM-dd')
                                });
                            }
                        }}
                        validationRules={validateRules.my_date}
                    />
                    <Item
                        dataField="peredano"
                        editorType="dxSelectBox"
                        label={{text: "Передано:"}}
                        validationRules={validateRules.peredano}
                        editorOptions={{
                            dataSource: allDataQuery?.data.rudnik,
                            displayExpr: 'name',
                            valueExpr: 'id',
                            placeholder: 'Выбирите Склад',  // Текст по умолчанию в поле ввода
                            searchEnabled: true,              // Включает возможность поиска
                        }}
                    />
                    <Item
                        dataField="nomer_vhod_document"
                        editorType="dxTextBox"
                        label={{text: "Номер вход. документа"}}
                        //validationRules={validateRules.nomer_vhod_document}
                        editorOptions={{
                            placeholder: 'Введите номер вход. документа',  // Текст по умолчанию в поле ввода
                        }}
                    />
                    <Item
                        dataField="date_vhod_document"
                        editorType="dxDateBox"
                        label={{text: "Дата вход. документа"}}
                        validationRules={validateRules.date_vhod_document}
                        editorOptions={{
                            onValueChanged: (e) => {
                                // Ensure the value is formatted correctly
                                setFormData({
                                    ...formData,
                                    date_vhod_document: format(new Date(e.value), 'yyyy-MM-dd')
                                });
                            },
                            placeholder: 'Введите дату вход. документа',  // Текст по умолчанию в поле ввода
                        }}
                    />
                    <Item
                        dataField="enc"
                        editorType="dxSelectBox"
                        label={{text: "ЕНС:"}}
                        validationRules={validateRules.enc}
                        editorOptions={{
                            dataSource: allDataQuery?.data.enc,
                            displayExpr: 'enc',
                            valueExpr: 'id',
                            placeholder: 'Выбирите ЕНС',  // Текст по умолчанию в поле ввода
                            searchEnabled: true,// Включает возможность поиска
                            onValueChanged: (e) => {
                                if (e.value !== "") {
                                    let enc_name = allDataQuery.data.enc.find((item) => (item.id === e.value))

                                    let editor = formRef.current.instance.getEditor('enc_name');
                                    if (enc_name) {
                                        editor.option('value', enc_name.name)
                                    } else {
                                        editor.option('value', null)
                                    }

                                }
                            }
                        }}
                    />
                    <Item
                        dataField="enc_name"
                        editorType="dxTextArea"
                        label={{text: "Наименование оборудования"}}
                        validationRules={validateRules.enc_name}
                        editorOptions={{
                            height: "100px", readOnly: true, elementAttr: {
                                class: "textAreaENCname"
                            }
                        }}
                    />
                    <Item
                        dataField="nomer_dogovora"
                        editorType="dxSelectBox"
                        label={{text: "Номер договора"}}
                        validationRules={validateRules.nomer_dogovora}
                        editorOptions={{
                            dataSource: allDataQuery?.data.nomer_dogovora,
                            displayExpr: 'nomer_dogovora',
                            valueExpr: 'id',
                            placeholder: 'Выбирите Номер договора',  // Текст по умолчанию в поле ввода
                            searchEnabled: true,              // Включает возможность поиска
                            onValueChanged: (e) => {
                                const nomer_zakaza = formRef.current.instance.getEditor('nomer_zakaza')
                                nomer_zakaza.clear()
                                nomer_zakaza.option('dataSource', [])
                                if (e.value) {
                                    console.log(e.value, allDataQuery.data)
                                    let nomera = allDataQuery.data.nomer_zakaza.filter((item) => (item.nomer_dogovora === e.value))
                                    if (nomera) {
                                        nomer_zakaza.option('dataSource', nomera)
                                    }
                                }
                            }
                        }}
                    />
                    <Item
                        dataField="nomer_zakaza"
                        editorType="dxSelectBox"
                        label={{text: "Номер Заказа"}}
                        validationRules={validateRules.nomer_zakaza}
                        editorOptions={{
                            dataSource: () => {
                                return [1, 2, 3]
                            }, displayExpr: 'nomer_document', valueExpr: 'id', placeholder: 'Выбирите Номер заказа',  // Текст по умолчанию в поле ввода
                            searchEnabled: true,              // Включает возможность поиска
                        }}
                    />
                    <Item
                        dataField="price_za_edinicy"
                        editorType="dxNumberBox"
                        label={{text: "Цена за единицу"}}
                        validationRules={validateRules.price_za_edinicy}
                        editorOptions={{
                            format: {type: 'fixedPoint', precision: 2}, // Формат фиксированной точки с 2 десятичными
                            placeholder: 'Введите цену за единицу', min: 1,// Текст по умолчанию в поле ввода
                        }}
                    />
                    <Item
                        dataField="type_dvisheniya"
                        editorType="dxSelectBox"
                        label={{text: "Тип движения"}}
                        validationRules={validateRules.type_dvisheniya}
                        editorOptions={{
                            dataSource: [{name: "Приход"}, {name: 'Расход'}],
                            valueExpr: 'name',
                            displayExpr: 'name',
                            placeholder: 'Выбирите Тип движения',  // Текст по умолчанию в поле ввода
                            searchEnabled: true,              // Включает возможность поиска
                        }}
                    />
                    <Item
                        dataField="count"
                        editorType="dxNumberBox"
                        label={{text: "Количество"}}
                        validationRules={validateRules.count}
                        editorOptions={{
                            placeholder: 'Введите количество',// Текст по умолчанию в поле ввода
                            min: 1,
                        }}
                    />
                    <Item
                        dataField="type_postupleniya"
                        editorType="dxSelectBox"
                        label={{text: "Тип поступления"}}
                        validationRules={validateRules.type_postupleniya}
                        editorOptions={{
                            dataSource: allDataQuery?.data.type_postupleniya,
                            valueExpr: 'id',
                            displayExpr: 'name',
                            placeholder: 'Выбирите Тип поступления',  // Текст по умолчанию в поле ввода
                            searchEnabled: true,              // Включает возможность поиска
                        }}
                    />
                    <Item
                        dataField="serial_number"
                        editorType="dxTextBox"
                        label={{text: "Серийный номер"}}
                        validationRules={validateRules.serial_number}
                        editorOptions={{
                            placeholder: 'Введите Серийный номер',  // Текст по умолчанию в поле ввода
                        }}
                    />
                    <Item
                        dataField="comment"
                        editorType="dxTextArea"
                        label={{text: "Комментарий"}}
                        validationRules={validateRules.comment}
                        editorOptions={{
                            height: "200px"
                        }}
                    />
                    <Item
                        dataField="user"
                        disabled={true}
                        editorType="dxSelectBox"
                        label={{text: "Пользователь"}}
                        editorOptions={{
                            dataSource: allDataQuery?.data.user,
                            valueExpr: 'id',
                            displayExpr: 'name',
                            placeholder: 'Выбирите Пользователя',  // Текст по умолчанию в поле ввода
                            searchEnabled: true,              // Включает возможность поиска
                        }}
                    />

                    <GroupItem cssClass="button-container" colCountByScreen={{
                        xs: 2, sm: 2, md: 2, lg: 2
                    }}>
                        <ButtonItem horizontalAlignment="right"
                                    name="myButton_can"
                                    buttonOptions={{
                                        text: 'Отмена', type: 'default', onClick: onCancel, width: "130px"
                                    }}
                        />
                        <ButtonItem horizontalAlignment="right"
                                    name="myButton_sub"
                                    buttonOptions={{
                                        text: 'Сохранить',
                                        type: 'success',
                                        useSubmitBehavior: true,
                                        width: "130px",
                                        elementAttr: {id: "test1111"}
                                    }}
                        />
                    </GroupItem>
                </Form>
            </form>
            {errorList && <Alert severity="error">{`${errorList}`}</Alert>}
        </Popup>
    </React.Fragment>);
};
