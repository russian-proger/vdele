// Framework Libs
import React from 'react';

// Material UI
import { makeStyles, alpha } from '@material-ui/core/styles';

// Components
import Header from './Header';

// Routes

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Modal,
  Paper,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupIcon from '@material-ui/icons/Group';
import CreateIcon from '@material-ui/icons/Create';
import AddBoxIcon from '@material-ui/icons/AddBox';
import WifiTetheringIcon from '@material-ui/icons/WifiTethering';

import Core from '../core/Core';
import * as expressions from '../../../server/expressions';

const useStyles = makeStyles((theme) => ({
  rootGrid: {
    position: 'relative',
    height: 'calc(100% - 45px)'
  },
  leftPanel: {
    background: 'white',
    position: 'fixed',
    left: 0,
    top: 45,
    borderRight: '1px solid grey',
    width: 300,
    height: '100%'
  },
  rightPanel: {
    background: 'white',
    position: 'absolute',
    right: 0,
    top: 0,
    borderLeft: '1px solid grey',
    width: 250,
    height: '100%'
  },
  relWrapper: {
    position: 'relative',
    width: '100%',
  },
  panelButton: {
    width: '100%',
    marginTop: 10
  },
  workButton: {
    width: '100%',
    justifyContent: 'flex-start',
    textAlign: 'left',
    fontSize: '13px',
    borderRadius: 0,
    textTransform: 'none'
  },
  tasksContainer: {
    height: '100%'
  },
  tasksGrid: {
  },
  tasksList: {
    marginTop: 10,
    background: "#eee",
    paddingBottom: 1
  },
  wsItem: {
    minHeight: 38
  }
}));

function Participants(props) {
  const [state, setState] = React.useState({
    users: [],
    loading: true,
    user_nick: ''
  })

  React.useEffect(() => {
    Core.Network.getProjectParticipants(window.project_info.id).then(res => {
      setState({...state, users: res.data, loading: false});
    })
  }, []);

  function addUser() {
    Core.Network.addParticipantToProject(state.user_nick, window.project_info.id).then(res => {
      if (res.result) {
        alert("Пользователь успешно добавлен в проект");
      } else if (res.reason == 0) alert("Пользователя с таким ником не существует");
      else if (res.reason == 1) alert("Пользователь уже является участником проекта");
      else alert("Неизвестная ошибка");
      setState({...state, user_nick: ''});
      console.log(res);
    });
  }

  function deleteUser(user_id, nick) {
    if (!confirm(`Вы уверены, что хотите удалить пользователя с ником "${nick}"?`)) return;
    Core.Network.deleteParticipantFromProject(user_id, window.project_info.id).then(res => {
      if (res.result) alert("Пользователь удалён с проекта");
      else if (res.reason == 0) alert("Пользователь уже удалён с проекта");
      else alert("Неизвестная ошибка");
    });
  }

  if (state.loading) return <CircularProgress />

  return (
<>
  <Typography style={{marginLeft: 25}}>Добавить пользователя</Typography>
  <Toolbar>
    <TextField onChange={ev => setState({...state, user_nick: ev.currentTarget.value})} value={state.user_nick} variant="outlined" label="Никнейм пользователя"></TextField>
    <Button onClick={() => addUser()}>Добавить</Button>
  </Toolbar>
  <List
    subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Участники
      </ListSubheader>
    }>
    { state.users.map((user, x) => (
      <ListItem key={x}>
        <ListItemAvatar>
          <IconButton onClick={() => window.open(`/profile/${user.id}`, '_self')}>
            <Avatar src={`/profile_photos/${user.photo_name}`} />
          </IconButton>
        </ListItemAvatar>
        <ListItemText>{user.first_name} {user.second_name}</ListItemText>
        <ListItemSecondaryAction>
          <IconButton onClick={() => deleteUser(user.id, user.nick)} disabled={user.id == window.user_info.id}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))
    }
  </List>
</>
  )
}

function TaskViewer(props) {
  const [state, setState] = React.useState({

    loading: true,
    user_nick: ''
  })

  React.useEffect(() => {
    Core.Network.getTask(props.task_id).then(res => {
      setState({...state, loading: false, task: res.data});
    })
  }, []);

  if (state.loading) return <CircularProgress />

  return (
    <Box m={3}>
      <Typography variant="h6">{state.task.name}</Typography>
      <Typography variant="body2">{state.task.description}</Typography>
    </Box>
  )
}

export default function App(_props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    currentWorkspace: -1,
    newTaskName: '',
    newTaskDescription: ''
  });

  const [modal, setModal] = React.useState({
    name: ''
  });

  const [projectInfo, setProjectInfo] = React.useState({
    workspaces: null,
    tasks: null,
    allTasks: null
  });


  React.useEffect(() => {
    let workspaces = null;
    let tasks      = null;
    Core.Network.getProjectWorkspaces(window.project_info.id)
      .then(res => {
        workspaces = res.data;
        return Core.Network.getProjectTasks(window.project_info.id);
      })
      .then(res => {
        tasks = res.data;
        setTimeout(() => {
          setProjectInfo({
            ...projectInfo,
            workspaces, tasks
          });
        }, 100);
      })
  }, []);
  

  function changeName() {
    prompt('Введите имя пространства');
  }

  function createWorkspace() {
    let name = '';
    while (!expressions.orgname_expr.test(name)) {
      name = prompt('Введите имя пространства');
      console.log(name);
    }

    if (name !== null) Core.Network.createProjectWorkspace(window.project_info.id, name);
  }

  function deleteWorkspace(ws_id) {
    if (confirm("Вы действительно хотите удалить?")) {
      Core.Network.deleteProjectWorkspace(ws_id);
    }
  }

  function onChangeWorkspace(currentWorkspace) {
    setState({...state, currentWorkspace});
  }

  function createTask() {
    Core.Network.createTask(state.currentWorkspace, state.newTaskName, state.newTaskDescription);
    setModal({name: ''});
    setState({...state, newTaskName: '', newTaskDescription: ''});
  }

  function openTask(task_id) {
    setModal({name: 'task_view', task_id});
  }

  const tasks = projectInfo.tasks && projectInfo.tasks.filter(task => state.currentWorkspace == -1 || task.workspace_id == state.currentWorkspace);

  return (
    <>
      <Header />
      <Grid className={classes.rootGrid} container>
        <Grid item style={{width: 300}}>
          <div className={classes.leftPanel}>
            <div className={classes.relWrapper}>
              <Box m={1}>
                <Typography variant="h6" align="center">{window.project_info.name}</Typography>
                <br/><Divider /><br/>
              </Box>
              <List
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Действия
                  </ListSubheader>
                }
              >
                <ListItem button onClick={changeName}>
                  <ListItemIcon>
                    <CreateIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Изменить имя" />
                </ListItem>
                <ListItem button onClick={() => setModal({name: 'participants'})}>
                  <ListItemIcon>
                    <GroupIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Участники" />
                </ListItem>
                <ListItem button onClick={changeName}>
                  <ListItemIcon>
                    <DeleteIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Удалить проект" />
                </ListItem>
              </List>
              <Divider/>
              <List dense
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Рабочие пространства
                  </ListSubheader>
                }
              >
              { projectInfo.workspaces !== null &&
              <>
                <ListItem button onClick={createWorkspace}>
                  <ListItemIcon>
                    <AddBoxIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText>Добавить</ListItemText>
                </ListItem>
                <Divider/><br/>
                <ListItem className={classes.wsItem} button onClick={() => onChangeWorkspace(-1)} selected={state.currentWorkspace == -1}>
                  <ListItemIcon>
                    <WifiTetheringIcon />
                  </ListItemIcon>
                  <ListItemText>Общее пространство</ListItemText>
                </ListItem>
                {projectInfo.workspaces.map((ws, x) => (
                  <ListItem className={classes.wsItem} button onClick={() => onChangeWorkspace(ws.id)} selected={state.currentWorkspace == ws.id} key={ws.id}>
                    <ListItemIcon>
                      <GroupWorkIcon />
                    </ListItemIcon>
                    <ListItemText primary={ws.name} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => deleteWorkspace(ws.id)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </>
              }
              </List>
                
              { projectInfo.workspaces === null &&
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 25}}>
                  <CircularProgress />
                </div>
              }
            </div>
          </div>
        </Grid>
        <Grid item sm>
          <Container className={classes.tasksContainer}>
          { projectInfo.tasks === null &&
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 25}}>
              <CircularProgress />
            </div>
          }
          { projectInfo.tasks !== null &&
            <Grid className={classes.tasksGrid} container spacing={3}>
            { ["В очереди", "На проверке", "Выполнено"].map((title, state_id) => (
              <Grid key={state_id} item sm={4}>
                <Paper className={classes.tasksList}>
                  <Typography variant="h6" style={{padding: 5, paddingLeft: 20, fontSize: '16px'}}>{title}</Typography>
                  { tasks.filter(task => task.state_id == state_id).map((task, x) => (
                    <div onClick={() => openTask(task.id)} key={x} className="task">{task.name}</div>
                  )) }
                  {!state_id && state.currentWorkspace != -1 &&
                  <>
                  <Divider />
                  <Button onClick={() => setModal({name: "task_creating", })} size="small" style={{width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0}}><AddIcon style={{marginRight: 5, fontSize: '22px'}} /> Добавить задание</Button>
                  </>
                  }
                </Paper>
              </Grid>
            ))}
            </Grid>
          }
          </Container>
        </Grid>
        {/* <Grid item style={{width: 250}}>
          <div className={classes.rightPanel}>
            <div className={classes.relWrapper}>
              <Box m={1}>
                <Typography variant="h6" align="center">История действий</Typography>
                <Divider /><br/>
                
              </Box>
            </div>
          </div>
        </Grid> */}
      </Grid>
      <Modal open={modal.name == "participants"} onClose={() => setModal({name: ''})}>
        <div className="modal_window_wrapper">
          <div className="modal_window">
            <Typography align="center" variant="h5">Участники</Typography>
            <Divider/><br/>
            <Participants />
          </div>
        </div>
      </Modal>
      <Modal open={modal.name == "task_view"} onClose={() => setModal({name: ''})}>
        <div className="modal_window_wrapper">
          <div className="modal_window">
            <Typography align="center" variant="h5">Просмотр задачи</Typography>
            <Divider/><br/>
            <TaskViewer task_id={modal.task_id} />
          </div>
        </div>
      </Modal>
      <Modal open={modal.name == "task_creating"} onClose={() => setModal({name: ''})}>
        <div className="modal_window_wrapper">
          <div className="modal_window">
            <Typography align="center" variant="h5">Новая задача</Typography>
            <Divider/><br/>
            <Box m={1}>
              <TextField onChange={(ev) => setState({...state, newTaskName: ev.currentTarget.value})} value={state.newTaskName} style={{width: '100%'}} label="Название задания" variant="outlined" /><br/><br/>
              <TextField onChange={(ev) => setState({...state, newTaskDescription: ev.currentTarget.value})} value={state.newTaskDescription} style={{width: '100%'}} multiline label="Описание" variant="outlined" />
            </Box>

            <Button onClick={() => createTask()} color="primary" variant="contained">Создать</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}