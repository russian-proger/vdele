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
  MenuItem,
  Modal,
  Paper,
  Select,
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
import * as expressions from '../../../server/utils/expressions';
import ModalCreateTask from './ModalCreateTask';

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

var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,'
  , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
  , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
  , format = function(s, c) { 	    	 
    return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) 
  }
  , downloadURI = function(uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      link.click();
  }

  return function(table, name, fileName) {
    if (!table.nodeType) table = document.getElementById(table)
      var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
    var resuri = uri + base64(format(template, ctx))
    downloadURI(resuri, fileName);
  }
})(); 

function Participants(props) {
  const [state, setState] = React.useState({
    users: [],
    loading: true,
    user_nick: ''
  });

  React.useEffect(() => {
    Core.Network.getProjectParticipants(window.project_info.id).then(res => {
      setState({...state, users: res.data, loading: false});
    })
  }, []);

  function addUser() {
    Core.Network.addParticipantToProject(state.user_nick, window.project_info.id).then(res => {
      if (res.result) {
        alert("???????????????????????? ?????????????? ???????????????? ?? ????????????");
        return setState({...state,
          users: [...state.users, res.data],
          user_nick: ''
        });
      } else if (res.reason == 0) alert("???????????????????????? ?? ?????????? ?????????? ???? ????????????????????");
      else if (res.reason == 1) alert("???????????????????????? ?????? ???????????????? ???????????????????? ??????????????");
      else alert("?????????????????????? ????????????");
      setState({...state, user_nick: ''});
    });
  }

  function deleteUser(user_id, nick) {
    if (!confirm(`???? ??????????????, ?????? ???????????? ?????????????? ???????????????????????? ?? ?????????? "${nick}"?`)) return;
    Core.Network.deleteParticipantFromProject(user_id, window.project_info.id).then(res => {
      if (res.result) {
        alert("???????????????????????? ???????????? ?? ??????????????");
        setState({...state,
          users: state.users.filter(v => v.id != user_id)
        });
      }
      else if (res.reason == 0) alert("???????????????????????? ?????? ???????????? ?? ??????????????");
      else alert("?????????????????????? ????????????");
    });
  }

  function exportUsers() {
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <td>??????????????</td>
          <td>??????</td>
          <td>??????????????</td>
          <td>Email</td>
        </tr>
      </thead>
      <tbody>
        ${state.users.map(user => {
          return `
          <tr>
            <td>${user.nick}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.mail}</td>
          </tr>`;
        }).join('')}
      </tbody>
    `;
    tableToExcel(table, '???????????? ????????????????????', "???????????? ????????????????????.xls");
  }

  function updateUserProjectRight(user_id, right) {
    Core.Network.updateUserProjectRight(window.project_info.id, user_id, right).then(v => {
      setState({...state,
        users: [...state.users.filter(v => v.id != user_id), v.data]
      });
    });
  }

  if (state.loading) return <CircularProgress />

  return (
<>
  <Typography style={{marginLeft: 25}}>???????????????? ????????????????????????</Typography>
    <Toolbar>
      <TextField disabled={window.user_info.rights.right_id > 1} fullWidth onChange={ev => setState({...state, user_nick: ev.currentTarget.value})} value={state.user_nick} variant="outlined" label="?????????????? ????????????????????????"></TextField>
      <Box m={2} display="flex" justifyContent="flex-end">
        <Button disabled={window.user_info.rights.right_id > 1} variant="contained" size="large" onClick={() => addUser()}>????????????????</Button>
      </Box>  
    </Toolbar>
  {window.user_info.rights.right_id <= 1 &&
    <Box mt={2} mr={3} display="flex" justifyContent="flex-end"><Button onClick={() => exportUsers()}>?????????????? ???????????????????? EXCEL</Button></Box>
  }
  <List
    subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        ??????????????????
      </ListSubheader>
    }>
    { state.users.map((user, x) => (
    <React.Fragment key={x}>
      <Divider/>
      <ListItem>
        <ListItemAvatar>
          <IconButton onClick={() => window.open(`/profile/${user.id}`, '_self')}>
            <Avatar src={`/profile_photos/${user.photoName}`} />
          </IconButton>
        </ListItemAvatar>
        <ListItemText>{user.firstName} {user.lastName}</ListItemText>
        <ListItemSecondaryAction>
          {user.right != null &&
            <Select value={user.right}
              disabled={user.right == 0 || user.id == window.user_info.id || window.user_info.rights.right_id >= user.right}
              onChange={ev => updateUserProjectRight(user.id, ev.target.value)}
            >  
              {user.right == 0 && <MenuItem value={0}>??????????????????</MenuItem>}
              <MenuItem value={1}>????????????????</MenuItem>
              <MenuItem value={2}>????????????????</MenuItem>
            </Select>
          }
        { window.user_info.rights.right_id <= 1 &&
          <IconButton onClick={() => deleteUser(user.id, user.nick)} disabled={user.id == window.user_info.id || window.user_info.rights.right_id >= user.right}>
            <DeleteIcon />
          </IconButton>
        }
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
    ))
    }
  </List>
</>
  )
}

function TaskViewer(props) {
  const [state, setState] = React.useState({
    loading: true,
  })

  React.useEffect(() => {
    Core.Network.getTask(props.task_id).then(res => {
      setState({...state, loading: false, task: res.data});
    })
  }, []);

  if (state.loading) return <CircularProgress />

  const incrementStatus = () => {
    props.OnSetStatus(state.task.id, ++state.task.status);
  }
  const decrementStatus = () => {
    props.OnSetStatus(state.task.id, --state.task.status);
  }

  return (
    <Grid container style={{height: '440px'}}>
      <Grid item style={{width: '445px'}}>
        <Box m={3}>
          <Typography variant="h6">{state.task.name}</Typography>
          <Typography variant="body2">{state.task.description}</Typography>
        </Box>
      </Grid>
      <Grid item style={{width: '250px', borderLeft: '1px solid #d9d9d9', paddingLeft: '5px'}}>
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              ????????????????
            </ListSubheader>
          }
        >
          {window.user_info.rights.right_id <= 1 &&
            <Box m={1}>
              <Button fullWidth disabled={state.task.status <= 0 } variant="contained" onClick={decrementStatus}>
                ?????????????????????? ??????????
              </Button>
            </Box>
          }
          {window.user_info.rights.right_id <= 1 &&
            <Box m={1}>
              <Button fullWidth disabled={state.task.status >= 2 } variant="contained" onClick={incrementStatus}>
                ?????????????????????? ????????????
              </Button>
            </Box>
          }
          {window.user_info.rights.right_id <= 1 &&
            <Box m={1}>
              <Button fullWidth color="secondary" variant="contained" onClick={() => props.OnDelete()}>
                ??????????????
              </Button>
            </Box>
          }
        </List>
      </Grid>
    </Grid>
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

  const [_count, forceUpdate] = React.useReducer(x => x + 1, 0);

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
    let name = '';
    while (!expressions.orgname_expr.test(name)) {
      name = prompt('?????????????? ?????????? ?????? ??????????????');
    }
    if (name) {
      Core.Network.changeProjectName(window.project_info.id, name).then(() => {
        window.project_info.name = name;
        forceUpdate();
      })
    }
  }

  function createWorkspace() {
    let name = '';
    while (!expressions.orgname_expr.test(name)) {
      name = prompt('?????????????? ?????? ????????????????????????');
    }

    if (name !== null) {
      Core.Network.createProjectWorkspace(window.project_info.id, name).then(res => {
        setProjectInfo({...projectInfo,
          workspaces: [...projectInfo.workspaces, res.data]
        });
      })
    }
  }

  function deleteWorkspace(ws_id) {
    if (confirm("???? ?????????????????????????? ???????????? ???????????????")) {
      Core.Network.deleteProjectWorkspace(ws_id).then(() => {
        setProjectInfo({...projectInfo,
          workspaces: projectInfo.workspaces.filter(v => v.id != ws_id),
          tasks: projectInfo.tasks.filter(v => v.WorkspaceId != ws_id)
        })
      })
    }
  }

  function onChangeWorkspace(currentWorkspace) {
    setState({...state, currentWorkspace});
  }

  function createTask(taskName, taskDescription) {
    Core.Network.createTask(state.currentWorkspace, taskName, taskDescription).then(res => {
      setModal({name: ''});
      setProjectInfo({...projectInfo,
        tasks: [...projectInfo.tasks, res.data]
      });
    });
  }

  function openTask(task_id) {
    setModal({name: 'task_view', task_id});
  }

  function removeProject() {
    if (confirm("???? ??????????????, ?????? ???????????? ?????????????? ?????????????")){
      Core.Network.deleteProject(window.project_info.id).then(() => {
        window.open(`/profile/${window.user_info.id}`, '_self');
      });
    }
  }

  function deleteTask(task_id) {
    if (confirm("???? ??????????????, ?????? ???????????? ?????????????? ?????? ???????????????")) {
      Core.Network.deleteTask(task_id).then(() => {
        setModal({name: ''});
        setProjectInfo({...projectInfo,
          tasks: projectInfo.tasks.filter(v => v.id != task_id)
        });
      });
    }
  }

  function setTaskStatus(task_id, status) {
    let task = projectInfo.tasks.find(v => v.id == task_id);
    task.status = status;
    Core.Network.updateTask(task_id, task).then((res) => {
      setProjectInfo({...projectInfo,
        tasks: [...projectInfo.tasks.filter(v => v.id != task_id), res.data]
      });
    });
  }

  const tasks = projectInfo.tasks && projectInfo.tasks.filter(task => state.currentWorkspace == -1 || task.WorkspaceId == state.currentWorkspace);
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
                    ????????????????
                  </ListSubheader>
                }
              >
              { window.user_info.rights.right_id <= 1 &&
                <ListItem button onClick={changeName}>
                  <ListItemIcon>
                    <CreateIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="???????????????? ??????" />
                </ListItem>
              }
                <ListItem button onClick={() => setModal({name: 'participants'})}>
                  <ListItemIcon>
                    <GroupIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="??????????????????" />
                </ListItem>
              { window.user_info.rights.right_id == 0 &&
                <ListItem button onClick={() => removeProject()}>
                  <ListItemIcon>
                    <DeleteIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="?????????????? ????????????" />
                </ListItem>
              }
              </List>
              <Divider/>
              <List dense
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    ?????????????? ????????????????????????
                  </ListSubheader>
                }
              >
              { projectInfo.workspaces !== null &&
              <>
              {window.user_info.rights.right_id <= 1 &&
                <ListItem button onClick={createWorkspace}>
                  <ListItemIcon>
                    <AddBoxIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText>????????????????</ListItemText>
                </ListItem>
              }
                <Divider/><br/>
                <ListItem className={classes.wsItem} button onClick={() => onChangeWorkspace(-1)} selected={state.currentWorkspace == -1}>
                  <ListItemIcon>
                    <WifiTetheringIcon />
                  </ListItemIcon>
                  <ListItemText>?????????? ????????????????????????</ListItemText>
                </ListItem>
                {projectInfo.workspaces.map((ws, x) => (
                  <ListItem className={classes.wsItem} button onClick={() => onChangeWorkspace(ws.id)} selected={state.currentWorkspace == ws.id} key={ws.id}>
                    <ListItemIcon>
                      <GroupWorkIcon />
                    </ListItemIcon>
                    <ListItemText primary={ws.name} />
                    <ListItemSecondaryAction>
                      {window.user_info.rights.right_id <= 1 &&
                        <IconButton onClick={() => deleteWorkspace(ws.id)} aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      }
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
            { ["?? ??????????????", "?? ????????????????", "??????????????????"].map((title, state_id) => (
              <Grid key={state_id} item sm={4}>
                <Paper className={classes.tasksList}>
                  <Typography variant="h6" style={{padding: 5, paddingLeft: 20, fontSize: '16px'}}>{title}</Typography>
                  { tasks.filter(task => task.status == state_id).map((task, x) => (
                    <div onClick={() => openTask(task.id)} key={x} className="task">{task.name}</div>
                  )) }
                  {!state_id && state.currentWorkspace != -1 && window.user_info.rights.right_id <= 1 &&
                  <>
                  <Divider />
                  <Button onClick={() => setModal({name: "task_creating", })} size="small" style={{width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0}}><AddIcon style={{marginRight: 5, fontSize: '22px'}} /> ???????????????? ??????????????</Button>
                  </>
                  }
                </Paper>
              </Grid>
            ))}
            </Grid>
          }
          </Container>
        </Grid>
      </Grid>
      <Modal open={modal.name == "participants"} onClose={() => setModal({name: ''})}>
        <div className="modal_window_wrapper">
          <div className="modal_window">
            <Typography align="center" variant="h5">??????????????????</Typography>
            <Divider/><br/>
            <Participants />
          </div>
        </div>
      </Modal>
      <Modal open={modal.name == "task_view"} onClose={() => setModal({name: ''})}>
        <div className="modal_window_wrapper">
          <div className="modal_window">
            <Typography align="center" variant="h5">???????????????? ????????????</Typography>
            <Divider/><br/>
            <TaskViewer task_id={modal.task_id}
              OnSetStatus={(task_id, status) => setTaskStatus(task_id, status)}
              OnDelete={() => {deleteTask(modal.task_id)}} />
          </div>
        </div>
      </Modal>
      
      <ModalCreateTask
         open={modal.name == "task_creating"} onClose={() => setModal({name: ''})}
         onCreateTask={(taskName, taskDescription) => createTask(taskName, taskDescription)}
      />
    </>
  );
}