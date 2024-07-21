import React, {useCallback, useEffect, useRef, useState} from 'react';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import {Popup, Position} from 'devextreme-react/popup';
import {ButtonItem, Form, GroupItem, Item} from 'devextreme-react/form';

import {Global, css} from "@emotion/react";
import {useQueryClient} from "react-query";
import NumberBox from 'devextreme-react/number-box';
import {ScrollView} from 'devextreme-react/scroll-view';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {format} from 'date-fns';
import notify from "devextreme/ui/notify";

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
const test111 = css`
    .dx-popup-content-scrollable {

    }
`
const combinedStyles = [cssButton, textArea, labelStyleForm];


export default function CustomEditForm({visible, data, onSave, onCancel, rowKey, errorList, setErrorList}) {
    // Правила ВАЛИДАЦИИ
    const validateRules = {
        my_date: [{type: "required", message: "Данное поле обязательно!"},],
    }

    const scrollViewRef = useRef(null)
    const popupRef = useRef(null);
    const queryClient = useQueryClient();
    const formRef = useRef()
    const allDataQuery = queryClient.getQueryData('getAllSkladMagaz'); // Получение данных из кэша
    const [formData, setFormData] = useState({...data});
    // метод для сохранения данных
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(rowIndex)
        onSave({rowKey, formData}).then((result) => {
            notify("Данные cохранены!", 'success', 2000)

        }).catch((error) => {

        })
    }

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

    const hangleOptionChanged = useCallback((e) => {
        const scrollPosition = scrollViewRef.current.instance.scrollTop(); //запоминаем скрол что бы вернуться
        setErrorList((prev) => {
            return null
        }) // сбрасываем все ошибки
        setTimeout(() => {
            scrollViewRef.current.instance.scrollTo(scrollPosition);
        }, 0);
    }, [])


    const handleDataChanged = useCallback((e) => {
        setFormData((e.component.option("formData")))
        console.log("handleDataChanged")
        //setFormData(formRef.current.instance.option('formData'))

    }, [])

    return (<React.Fragment>
        <Popup
            css={test111}
            ref={popupRef}
            copyRootClassesToWrapper={true}
            enableBodyScroll={true}
            hideOnParentScroll={false}
            dragOutsideBoundary={true}
            maxHeight={2000}
            height="95%"
            maxWidth={600}
            visible={visible}
            onHiding={onCancel}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            title="Приход оборудования"
            resizeEnabled={true}
            //container=".dx-viewport123"
        >
            <Position at="center" my="center"/>
            <ScrollView
                ref={scrollViewRef}
                height="100%"
                scrollByThumb={true} // Enable scroll by thumb
            >
                <form onSubmit={handleFormSubmit}>
                    <Form css={combinedStyles} formData={formData} ref={formRef}
                          onFieldDataChanged={handleDataChanged}
                          onContentReady={handleContentReady}
                          onOptionChanged={hangleOptionChanged}
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
                                height: "50px", readOnly: true, elementAttr: {
                                    class: "textAreaENCname"
                                }
                            }}
                        />
                        <Item
                            dataField="type_dvisheniya"
                            visible={true}
                            editorType="dxSelectBox"
                            label={{text: "Тип движения"}}
                            validationRules={validateRules.type_dvisheniya}
                            editorOptions={{
                                dataSource: [{name: "Приход"}, {name: 'Расход'}],
                                valueExpr: 'name',
                                displayExpr: 'name',
                                placeholder: 'Выбирите Тип движения',  // Текст по умолчанию в поле ввода
                                searchEnabled: true,           // Включает возможность поиска
                                value: "Расход",
                                disabled: true,
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
                            dataField="comment"
                            editorType="dxTextArea"
                            label={{text: "Комментарий"}}
                            validationRules={validateRules.comment}
                            editorOptions={{
                                height: "100px"
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
            </ScrollView>
            {errorList && <Alert severity="error">{`${errorList}`}</Alert>}
        </Popup>
    </React.Fragment>);
};
