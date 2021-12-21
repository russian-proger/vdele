import React from 'react';
import { useLocation, useParams, useNavigate, Routes, Route, Link } from 'react-router-dom'

import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@material-ui/core';

import { createTheme, makeStyles, } from '@material-ui/core/styles';

import Core from '../core/Core';
import { int_expr } from '../tools/expressions';

const useStyles = makeStyles((theme) => ({
  root_container: {
    marginTop: theme.spacing(2)
  },
}));


export default function Main() {
  const [_count, forceUpdate] = React.useReducer(x => x + 1, 0);
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pageID = Math.max(pages.indexOf(params.page), 0);

  
  const my_profile = (params.user_id == window.user_info.id);
  const [state, setState] = React.useState({

  });

  return (
    <Container className={classes.root_container} maxWidth="lg">
      
    </Container>
  );
}