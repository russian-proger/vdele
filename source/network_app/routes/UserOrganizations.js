import React from 'react';

import { useLocation, useParams, useNavigate, Routes, Route, Link } from 'react-router-dom'

import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';

import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';

import Core from '../core/Core';
import { isSubString } from '../tools/string';

const useStyles = makeStyles((theme) => ({
  search: {
    flexGrow: 1,
    marginRight: theme.spacing(3)
  },
  org_button: {
    width: '100%',
    height: 72,
    justifyContent: 'flex-start'
  },
  avatar: {
    borderRadius: theme.shape.borderRadius,
    imageRendering: 'pixelated',
    marginRight: theme.spacing(2),
    border: '1px solid #ccc'
  },
  org_name_wrapper: {
    height: 56,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
}));

const green_theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      light: green[50],
      main: green[500],
      dark: green[700],
      contrastText: '#ffffff',
    },
  }
});

export default function UserOrganizations(props) {
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const my_profile = (params.user_id == window.user_info.id);
  const [state, setState] = React.useState({
    _orgs: [],
    orgs: [],
    search_text: ''
  });
  
  React.useState(() => {
    Core.Network.getUserOrganizations(window.user_info.id).then(res => {
      setState({...state, _orgs: res.data, orgs: res.data});
    });
  }, []);

  function onChangeSearchText(ev) {
    const search_text = ev.currentTarget.value;
    let orgs = state._orgs;
    
    if (search_text.length != 0) {
      orgs = state._orgs.filter(org => isSubString(search_text, org.name));
    }

    setState({...state, search_text, orgs});
  }

  function openOrganization(org_id) {
    navigate(`/organization/${org_id}`);
  }

  const pad = (s) => (s < 10) ? '0' + s : s;

  return (
  <>
    <Toolbar>
      <TextField onChange={onChangeSearchText} value={state.search_text} size="small" className={classes.search} label="Поиск" variant="outlined" />
      {my_profile &&
        <ThemeProvider theme={green_theme}>
          <Button onClick={() => navigate('/new_organization')} variant="contained" color="primary">Создать</Button>
        </ThemeProvider>
      }
    </Toolbar>
    {state.orgs.map((org, id) => {
      const createdDate = new Date(org.createdAt)
      return (
        <div key={id}>
          <Divider/><br/>
            <Toolbar>
              <Button onClick={() => openOrganization(org.id)} className={classes.org_button} key={id}>
                <div>
                  <Avatar className={classes.avatar} src={`/organization_photos/${org.logo_name}`} />
                </div>
                <div className={classes.org_name_wrapper}>
                  <Typography variant="h6" style={{fontSize:'20px', marginBottom: 7}}>{org.name} <span style={{fontWeight: 400, fontSize: '12px'}}><sup>{["публичный", "приватный"][+org.isPublic]}</sup></span></Typography>
                  <Typography variant="body1" style={{fontSize: '14px'}}>{["Владелец", "Менеджер", "Работник"][org.right_id]}</Typography>
                </div>
                <div style={{flexGrow: 1}}></div>
                <Typography variant="body1" style={{fontSize: '14px'}}>Создано <b>{createdDate.getFullYear()}.{pad(createdDate.getMonth() + 1)}.{pad(createdDate.getDate() + 1)}</b></Typography>
              </Button>
            </Toolbar>
          <br/>
        </div>
      );
    })}
  </>
  );
}