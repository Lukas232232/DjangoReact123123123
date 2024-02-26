import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme, makeStyles } from '@mui/styles';


import { css } from '@emotion/react'



// Создаем стили с различными размерами шрифта
const styles = {
  smallFont: css`
	font-size: 36px;
	`
  ,
  mediumFont: css`
	font-size: 16px;
	`
  ,
  largeFont: css`
	font-size: 20px;
	`
};


export default function ListingForm(){
  	return (
	  	<div css={styles.smallFont}>аывлдаодфыаовдла</div>
	);
}

