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
  project_button: {
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
  project_name_wrapper: {
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

export default function UserProjects(props) {
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const my_profile = (params.user_id == window.user_info.id);
  const [state, setState] = React.useState({
    projects: [],
    _projects: [],
    search_text: ''
  });
  
  React.useState(() => {
    Core.Network.getUserProjects(window.user_info.id).then(res => {
      setState({...state, _projects: res.data, projects: res.data});
    });
  }, []);

  function onChangeSearchText(ev) {
    const search_text = ev.currentTarget.value;
    let projects = state._projects;
    
    if (search_text.length != 0) {
      projects = state._projects.filter(project => isSubString(search_text, project.name));
    }

    setState({...state, search_text, projects});
  }


  const pad = (s) => (s < 10) ? '0' + s : s;

  return (
  <>
    <Toolbar>
      <TextField onChange={onChangeSearchText} value={state.search_text} size="small" className={classes.search} label="Поиск" variant="outlined" />
      { my_profile &&
        <ThemeProvider theme={green_theme}>
          <Button onClick={() => navigate('/new_project')} variant="contained" color="primary">Создать</Button>
        </ThemeProvider>
      }
    </Toolbar>
    {state.projects.map((project, id) => {
      const createdDate = new Date(project.createdAt)
      return (
        <div key={id}>
          <Divider/><br/>
            <Toolbar>
              <Button onClick={() => window.open(`/project/${project.id}`, '_self')} className={classes.project_button} key={id}>
                <div className={classes.project_name_wrapper}>
                  <Typography variant="h6" style={{fontSize:'20px', marginBottom: 7}}>{project.name} <span style={{fontWeight: 400, fontSize: '12px'}}><sup>{["приватный", "публичный"][project.public]}</sup></span></Typography>
                  <Typography variant="body1" style={{fontSize: '14px'}}>{["Владелец", "Менеджер", "Работник"][project.right_id]}</Typography>
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