import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Autocomplete, Stack} from "@mui/material";
import {css} from "@emotion/react";
import {useAsyncValue, useNavigate} from "react-router-dom";

import {useCreateDvishMTR} from "../hook/useReactQuery";

import * as Yup from 'yup'
import {useFormik} from 'formik';

const initialValues = {
    rudnik: '',
    my_date: '',
    enc: '',
    type_dvisheniya: '',
    count: '',
    istochnik: '',
    type_rabot: '',
    nomer_incidenta: '',
    sdo: '',
    user: '',
    comment: '',
}


const validationSchema = Yup.object({
    rudnik: Yup.object().required("Обязательно для выбора!"),
    enc: Yup.object().required('Обязательно для ввода'),
    type_dvisheniya: Yup.object().required('Обязательно для ввода'),
    istochnik: Yup.object().required('Обязательно для ввода'),
    type_rabot: Yup.object().required('Обязательно для ввода'),
    count: Yup.number()
        .required('Обязательно для ввода!')
        .min(1, "Должно быть больше 0"),
    my_date: Yup.string().required('Обязательно для ввода'),
});


export default function FormDialog({_open , _openSet, dummy}) {
    const navigate = useNavigate()
    const onSuccess = (data) => {
        console.log("Запрос выполенен")
        const currentPath = window.location.pathname;
        navigate(currentPath, {replace: true});
        formik.resetForm()
    }

    const {mutate: addItemDvishMTR, isError, error, isLoading, isSuccess} = useCreateDvishMTR({onSuccess: onSuccess})

    const [disableIstochnik, setDisableIstochnik] = useState(false)
    // кнопка для вызова формы добавления
    const onSubmit = (values, {setFieldError}) => {
        const newArr = {}
        Object.entries(values).forEach(([key, value], index) => {
            if (typeof value === "object" && value.hasOwnProperty("label")) {
                newArr[key] = value.id
            } else {
                newArr[key] = value
            }

        });
        addItemDvishMTR(newArr)
    }

    const formik = useFormik({
        initialValues, onSubmit, validationSchema
    });

    // ЕСЛИ ВСЕ ХОРОШО И ПРИШЕЛ ПОЛОЖИТЕЛЬНЫЙ ОТВЕТ С СЕРВЕРА очищаем ФОРМУ

    // вносим ошибки с сервера в поля для отображения
    useEffect(() => {
        const errorServer = isError ? error.response.data.errors : null
        const newErrors = {}
        if (errorServer) {
            Object.entries(errorServer).forEach(([key, value]) => {
                newErrors[key] = value[0];
            });
            formik.setErrors(newErrors)
        }

    }, [isError])
    console.log(formik.errors)

    const data = useAsyncValue()
    const [open, setOpen] = useState(_open || false);

    const [list, setList] = useState({
        rudnik: [],
        enc: [],
        type_dvisheniya: [{label: "Приход", id: "Приход"}, {label: "Расход", id: "Расход"}],
        istochnik: [],
        type_rabot: [],
    })

    // применяется для открытия и закрытия модального окна
    useEffect(() => {
        setOpen(_open)
        _openSet(_open)
    }, [dummy])


    // Создаем списки для отобржаения все полей с автозаполнением
    useEffect(() => {
        Object.keys(data).map(key => {
            if (key in list) {
                setList(prevState => ({
                    ...prevState, [key]: [...data[key].map(item => ({label: item.name, id: item.id}))]
                }));
            }
        });
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
        _openSet(true)
    };
    const handleClose = () => {
        setOpen(false);
        _openSet(false)
    };


    const dialogWindow = css`
      max-width: 800px !important;
      max-height: 1000px !important;
      height: 800px !important;
      width: 500px !important;
    `;

// Определяем стили для InputLabel
// Определяем стили для InputLabel
    const inputLabelStyles = css`
      .MuiInputLabel-root { // Селектор для стандартного состояния label
        font-size: 1rem; // Размер шрифта по умолчанию
      }

      .MuiInputLabel-shrink { // Селектор для стандартного состояния label
        font-size: 1.2rem; // Размер шрифта по умолчанию
        -webkit-transform: translate(10px, -13px) scale(.75);

      }

      &.Mui-focused .MuiInputLabel-root {
        font-size: 1.2rem; // Размер шрифта по умолчанию
        -webkit-transform: translate(10px, -13px) scale(.75);
      }`


    return (<React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
            Open form dialog
        </Button>
        <Dialog
            open={open}
            //onClose={handleClose}
            PaperProps={{
                component: 'form', onSubmit: (event) => {
                    formik.handleSubmit(event)
                    // handleClose();
                },
            }}
        >
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent css={dialogWindow}>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <Stack paddingTop={4} spacing={3}>
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => (value.id ? option.id === value.id : true)}
                        id="rudnik"
                        name="rudnik"
                        label="Рудник/Склад"
                        fullWidth
                        disablePortal
                        value={formik.values.rudnik}
                        options={list['rudnik']}
                        onBlur={formik.handleBlur}
                        onChange={(event, newValue) => {
                            // Обновляем поле rudnik в state формы, используя метод setFieldValue
                            formik.setFieldValue("rudnik", newValue);
                        }}
                        renderInput={(params) => <TextField {...params} css={inputLabelStyles}
                                                            error={Boolean(formik.errors.rudnik && formik.touched.rudnik)}
                                                            helperText={formik.errors.rudnik && formik.touched.rudnik ? formik.errors.rudnik : null}
                                                            label="Рудник/Склад"/>}

                    />
                    <TextField
                        //autoFocus
                        id="my_date"
                        name="my_date"
                        label="Дата"
                        InputLabelProps={{
                            shrink: true, sx: {
                                // Применим стиль напрямую через sx prop
                                fontSize: '1.20rem', // Размер шрифта по умолчанию
                                '&.Mui-focused': { // Увеличим размер шрифта, когда поле в фокусе
                                    fontSize: '1.20rem',
                                }
                            }
                        }}
                        InputProps={{
                            inputProps: {
                                readOnly: false,
                            }
                        }}
                        css={inputLabelStyles}
                        type="date"
                        fullWidth
                        {...formik.getFieldProps('my_date')}
                        error={Boolean(formik.errors?.my_date && formik.touched?.my_date)}
                        helperText={formik.errors.my_date && formik.touched.my_date ? formik.errors.my_date : null}
                    />

                    <Autocomplete
                        isOptionEqualToValue={(option, value) => value.id ? option.id === value.id : true}
                        id="enc"
                        name="enc"
                        label="ЕНС"
                        fullWidth
                        disablePortal
                        value={formik.values.enc}
                        options={list['enc']}

                        onBlur={formik.handleBlur}
                        onChange={(event, newValue) => {
                            // Обновляем поле rudnik в state формы, используя метод setFieldValue
                            formik.setFieldValue("enc", newValue);
                        }}
                        renderInput={(params) => <TextField {...params} css={inputLabelStyles} label="ЕНС"
                                                            error={Boolean(formik.errors.enc && formik.touched.enc)}
                                                            helperText={formik.errors.enc && formik.touched.enc ? formik.errors.enc : null}/>}

                    />

                    <Autocomplete
                        isOptionEqualToValue={(option, value) => value.id ? option.id === value.id : true}
                        id="type_dvisheniya"
                        name="type_dvisheniya"
                        label="Тип движение"
                        fullWidth
                        disablePortal
                        options={list['type_dvisheniya']}
                        value={formik.values.type_dvisheniya}
                        onBlur={formik.handleBlur}
                        onChange={(event, newValue) => {
                            // Обновляем поле rudnik в state формы, используя метод setFieldValue
                            formik.setFieldValue("type_dvisheniya", newValue);
                            if (newValue?.label === "Расход") {
                                let newIstochnik = list.istochnik.find(key => key.label === "Участковый склад");
                                formik.setFieldValue("istochnik", newIstochnik);
                                setDisableIstochnik(true)
                            } else {
                                formik.setFieldValue("istochnik", null);
                                setDisableIstochnik(false)
                            }
                        }}
                        renderInput={(params) => <TextField {...params} css={inputLabelStyles}
                                                            label="Тип движение"
                                                            error={Boolean(formik.errors.type_dvisheniya && formik.touched.type_dvisheniya)}
                                                            helperText={formik.errors.type_dvisheniya && formik.touched.type_dvisheniya ? formik.errors.type_dvisheniya : null}/>}

                    />
                    <TextField
                        css={inputLabelStyles}
                        //autoFocus
                        id="count"
                        name="count"
                        label="Количество"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps('count')}
                        error={Boolean(formik.errors.count && formik.touched.count)}
                        helperText={formik.errors.count && formik.touched.count ? formik.errors.count : null}
                    />
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => value.id ? option.id === value.id : true}
                        id="istochnik"
                        name="istochnik"
                        label="Источник"
                        fullWidth
                        disablePortal
                        value={formik.values.istochnik}
                        onBlur={formik.handleBlur}
                        options={list['istochnik']}
                        disabled={disableIstochnik}
                        onChange={(event, newValue) => {
                            // Обновляем поле rudnik в state формы, используя метод setFieldValue
                            formik.setFieldValue("istochnik", newValue);
                        }}
                        renderInput={(params) => <TextField {...params} css={inputLabelStyles} label="Источник"
                                                            error={Boolean(formik.errors.istochnik && formik.touched.istochnik)}
                                                            helperText={formik.errors.istochnik && formik.touched.istochnik ? formik.errors.istochnik : null}
                        />}
                    />

                    <Autocomplete
                        isOptionEqualToValue={(option, value) => value.id ? option.id === value.id : true}
                        id="type_rabot"
                        name="type_rabot"
                        label="Тип работ"
                        fullWidth
                        disablePortal
                        value={formik.values.type_rabot}
                        onBlur={formik.handleBlur}
                        options={list['type_rabot']}
                        onChange={(event, newValue) => {
                            // Обновляем поле rudnik в state формы, используя метод setFieldValue
                            formik.setFieldValue("type_rabot", newValue);
                        }}
                        renderInput={(params) => <TextField {...params} css={inputLabelStyles} label="Тип работ"
                                                            error={Boolean(formik.errors.type_rabot && formik.touched.type_rabot)}
                                                            helperText={formik.errors.type_rabot && formik.touched.type_rabot ? formik.errors.type_rabot : null}
                        />}

                    />
                    <TextField
                        css={inputLabelStyles}
                        //autoFocus
                        id="sdo"
                        name="sdo"
                        label="СДО/оборудование"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps('sdo')}
                        error={Boolean(formik.errors.sdo && formik.touched.sdo)}
                        helperText={formik.errors.sdo && formik.touched.sdo ? formik.errors.sdo : null}
                    />
                    <TextField
                        css={inputLabelStyles}
                        //autoFocus
                        id="nomer_incidenta"
                        name="nomer_incidenta"
                        label="INC|RITM"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps('nomer_incidenta')}
                        error={Boolean(formik.errors.nomer_incidenta && formik.touched.nomer_incidenta)}
                        helperText={formik.errors.nomer_incidenta && formik.touched.nomer_incidenta ? formik.errors.nomer_incidenta : null}
                    />
                    <TextField
                        css={inputLabelStyles}
                        id="comment"
                        name='comment'
                        label="Комментарий"
                        multiline
                        rows={4}
                        variant="filled"
                        fullWidth
                        {...formik.getFieldProps('comment')}
                        error={Boolean(formik.errors.comment && formik.touched.comment)}
                        helperText={formik.errors.comment && formik.touched.comment ? formik.errors.comment : null}
                    />
                    <input type="hidden" id="user" name="user" value="2"/>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
                <Button disabled={!formik.isValid || !formik.dirty} type="submit">Сохранить</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>);
}