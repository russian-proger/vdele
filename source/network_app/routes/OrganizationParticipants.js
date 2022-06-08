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
  Typography,
  Select, 
  MenuItem,
  IconButton
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
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

function UserAdder(props) {
  const params = useParams();
  const [state, setState] = React.useState({
    user_nick: ''
  });

  function addUser() {
    Core.Network.addParticipantToOrganization(state.user_nick, params.org_id).then(res => {
      if (res.result) {
        alert("Пользователь успешно добавлен в организацию");
        props.onAdd(res.data);
        return setState({...state,
          user_nick: ''
        });
      } else if (res.reason == 0) alert("Пользователя с таким ником не существует");
      else if (res.reason == 1) alert("Пользователь уже является участником проекта");
      else alert("Неизвестная ошибка");
      setState({...state, user_nick: ''});
    });
  }

  return (
    <Toolbar>
      <TextField disabled={props.right > 1} fullWidth onChange={ev => setState({...state, user_nick: ev.currentTarget.value})} value={state.user_nick} variant="outlined" label="Никнейм пользователя"></TextField>
      <Box m={2} display="flex" justifyContent="flex-end">
        <Button disabled={props.right > 1} variant="contained" size="large" onClick={() => addUser()}>Добавить</Button>
      </Box>  
    </Toolbar>
  )
}

export default function OrganizationProjects(props) {
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    users: [],
    _users: [],
    search_text: '',
    right: 3
  });
  
  React.useState(() => {
    Core.Network.getOrganizationParticipants(params.org_id).then(res => {
      let right = 3;
      let u = res.data.find(v => v.id == window.user_info.id);
      if (u) right = u.right;

      setState({...state, _users: res.data, users: res.data, right});
      console.log(right);
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

  function addUser(user) {
    console.log(user);
    setState({...state,
      users: [...state.users, user],
    });
  }

  function updateUserOrganizationRight(user_id, right) {
    Core.Network.updateUserOrganizationRight(params.org_id, user_id, right).then(v => {
      setState({...state,
        users: [...state.users.filter(v => v.id != user_id), v.data]
      });
    });
  }

  function deleteUser(user_id, nick) {
    if (!confirm(`Вы уверены, что хотите удалить пользователя с ником "${nick}"?`)) return;
    Core.Network.deleteParticipantFromOrganization(user_id, params.org_id).then(res => {
      if (res.result) {
        alert("Пользователь удалён с проекта");
        setState({...state,
          users: state.users.filter(v => v.id != user_id)
        });
      }
      else if (res.reason == 0) alert("Пользователь уже удалён с проекта");
      else alert("Неизвестная ошибка");
    });
  }


  const pad = (s) => (s < 10) ? '0' + s : s;
  return (
  <>
    {/* <Toolbar>
      <TextField onChange={onChangeSearchText} value={state.search_text} size="small" className={classes.search} label="Поиск" variant="outlined" />
      { props.rights && props.rights.right_id != 2 &&
        <ThemeProvider theme={green_theme}>
          <Button onClick={() => navigate('/new_organization_project', {state: props.orgInfo})} variant="contained" color="primary">Добавить</Button>
        </ThemeProvider>
      }
    </Toolbar> */}

    <UserAdder onAdd={user => addUser(user)} right={state.right}/>

    {state.users.map((user, id) => {
      const createdDate = new Date(user.created_dt)
      return (
        <div key={id}>
          <Divider/><br/>
            <Toolbar>
              <Box className={classes.participant_button} key={id}>
                <IconButton onClick={() => navigate(`/profile/${user.id}`)}>
                  <Avatar src={`/profile_photos/${user.photoName}`} />
                </IconButton>
                <div className={classes.participant_name_wrapper}>
                  <Typography variant="h6" style={{fontSize:'20px', marginBottom: 7}}>{user.firstName} {user.lastName}</Typography>
                  {/* <Typography variant="body1" style={{fontSize: '14px'}}>{["Владелец", "Менеджер", "Работник"][user.right]}</Typography> */}
                </div>
                <div style={{flexGrow: 1}}></div>
                {/* <Typography variant="body1" style={{fontSize: '14px'}}>Создано <b>{createdDate.getFullYear()}.{pad(createdDate.getMonth() + 1)}.{pad(createdDate.getDate() + 1)}</b></Typography> */}

                {user.right != null &&
                  <Select value={user.right}
                    disabled={user.right == 0 || user.id == window.user_info.id || state.right >= user.right}
                    onChange={ev => updateUserOrganizationRight(user.id, ev.target.value)}
                  >  
                    {user.right == 0 && <MenuItem value={0}>Создатель</MenuItem>}
                    <MenuItem value={1}>Менеджер</MenuItem>
                    <MenuItem value={2}>Участник</MenuItem>
                  </Select>
                }
              { state.right <= 1 &&
                <IconButton onClick={() => deleteUser(user.id, user.nick)} disabled={user.id == window.user_info.id || state.right >= user.right}>
                  <DeleteIcon />
                </IconButton>
              }
              </Box>
            </Toolbar>
          <br/>
        </div>
      );
    })}
  </>
  );
}