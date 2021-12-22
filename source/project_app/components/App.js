// Framework Libs
import React from 'react';

// Material UI
import { makeStyles, alpha } from '@material-ui/core/styles';

// Components
import Header from './Header';

// Routes

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Typography
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupIcon from '@material-ui/icons/Group';
import CreateIcon from '@material-ui/icons/Create';
import AddBoxIcon from '@material-ui/icons/AddBox';

import Core from '../core/Core';
import * as expressions from '../../../server/expressions';

const useStyles = makeStyles((theme) => ({
  rootGrid: {
    position: 'relative',
    height: 'calc(100% - 45px)'
  },
  leftPanel: {
    background: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
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
    height: 'calc(100% - 20px)'
  },
  tasksGrid: {
    height: '100%'
  },
  tasksList: {
    marginTop: 10,
    height: '100%'
  },
  wsItem: {
    minHeight: 38
  }
}));

export default function App(_props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    currentWorkspace: -1
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
        }, 1000);
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

  const tasks = projectInfo.tasks && projectInfo.tasks.filter(task => state.currentWorkspace == -1 || task.workspace_id == state.currentWorkspace);
  console.log(tasks);

  return (
    <>
      <Header />
      <Grid className={classes.rootGrid} container>
        <Grid item style={{width: 250}}>
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
                <ListItem button onClick={changeName}>
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
              <List
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
                    <GroupWorkIcon />
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
                  <Typography variant="h6" style={{fontSize: '14px'}}>{title}</Typography>
                  <div className="task-root">
                    
                  </div>
                </Paper>
              </Grid>
            ))

            }
              
              {/* <Grid item sm={4}>
                <Paper className={classes.tasksList}>
                  <Typography variant="h6" align="center">На проверке</Typography>
                </Paper>
              </Grid>
              <Grid item sm={4}>
                <Paper className={classes.tasksList}>
                  <Typography variant="h6" align="center">Выполнено</Typography>
                </Paper>
              </Grid> */}
            </Grid>
          }
          </Container>
        </Grid>
        <Grid item style={{width: 250}}>
          <div className={classes.rightPanel}>
            <div className={classes.relWrapper}>
              <Box m={1}>
                <Typography variant="h6" align="center">История действий</Typography>
                <Divider /><br/>
                
              </Box>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}