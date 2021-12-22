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
  participant_button: {
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
  participant_name_wrapper: {
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

export default function OrganizationProjects(props) {
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    users: [],
    _users: [],
    search_text: ''
  });
  
  React.useState(() => {
    Core.Network.getOrganizationParticipants(params.org_id).then(res => {
      console.log(res);
      setState({...state, _users: res.data, users: res.data});
    });
  }, []);

  function onChangeSearchText(ev) {
    const search_text = ev.currentTarget.value;
    let users = state._users;
    
    if (search_text.length != 0) {
      users = state._users.filter(user => isSubString(search_text, user.first_name+user.last_name));
    }

    setState({...state, search_text, users});
  }


  const pad = (s) => (s < 10) ? '0' + s : s;
  return (
  <>
    <Toolbar>
      <TextField onChange={onChangeSearchText} value={state.search_text} size="small" className={classes.search} label="Поиск" variant="outlined" />
      { props.rights && props.rights.right_id != 2 &&
        <ThemeProvider theme={green_theme}>
          <Button onClick={() => navigate('/new_organization_project', {state: props.orgInfo})} variant="contained" color="primary">Создать</Button>
        </ThemeProvider>
      }
    </Toolbar>
    {state.users.map((user, id) => {
      const createdDate = new Date(user.created_dt)
      return (
        <div key={id}>
          <Divider/><br/>
            <Toolbar>
              <Button onClick={() => navigate(`/profile/${user.id}`)} className={classes.participant_button} key={id}>
                <div>
                  <Avatar className={classes.avatar} src={`/profile_photos/${user.photo_name}`} />
                </div>
                <div className={classes.participant_name_wrapper}>
                  <Typography variant="h6" style={{fontSize:'20px', marginBottom: 7}}>{user.first_name} {user.last_name}</Typography>
                  <Typography variant="body1" style={{fontSize: '14px'}}>{["Владелец", "Менеджер", "Работник"][user.right_id]}</Typography>
                </div>
                <div style={{flexGrow: 1}}></div>
                {/* <Typography variant="body1" style={{fontSize: '14px'}}>Создано <b>{createdDate.getFullYear()}.{pad(createdDate.getMonth() + 1)}.{pad(createdDate.getDate() + 1)}</b></Typography> */}
              </Button>
            </Toolbar>
          <br/>
        </div>
      );
    })}
  </>
  );
}