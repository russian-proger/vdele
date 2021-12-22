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
  Container,
  Divider,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';

import Core from '../core/Core';

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
    width: 250,
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
    borderRadius: 0
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
  }
}));

export default function App(_props) {
  const classes = useStyles();



  React.useEffect(() => {
    Core.Network.getProjectTasks(window.project_info.id).then(res => {
      console.log(res);
    })
  }, []);
  


  const  PanelButton = (props) => (
    <Button color="secondary" variant="contained" className={classes.panelButton} {...props}>{props.children}</Button>
  )

  const WorkButton = (props) => (
    <Button size="large" variant="text" className={classes.workButton} {...props}>{props.children}</Button>
  );

  function changeName() {
    prompt('Введите имя пространства');
  }

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
                <Typography variant="h6" style={{fontSize: '17px'}} color="textSecondary">Действия</Typography>
                <PanelButton onClick={changeName}>Изменить имя</PanelButton>
                <PanelButton onClick={changeName}>Участники</PanelButton>
                <br/><br/><Divider /><br/>
                <Typography variant="h6" style={{fontSize: '17px'}} color="textSecondary">Рабочие пространства</Typography>
                <WorkButton color="primary">все задачи</WorkButton><Divider />
                <WorkButton>workspace 1</WorkButton><Divider />
                <WorkButton>workspace 2</WorkButton><Divider />
                <PanelButton variant="contained" color="primary">Добавить</PanelButton><Divider />
              </Box>
            </div>
          </div>
        </Grid>
        <Grid item sm>
          <Container className={classes.tasksContainer}>
            <Grid className={classes.tasksGrid} container spacing={3}>
              <Grid item sm={4}>
                <Paper className={classes.tasksList}>
                  <Typography variant="h6" align="center">В очереди</Typography>
                </Paper>
              </Grid>
              <Grid item sm={4}>
                <Paper className={classes.tasksList}>
                  <Typography variant="h6" align="center">На проверке</Typography>
                </Paper>
              </Grid>
              <Grid item sm={4}>
                <Paper className={classes.tasksList}>
                  <Typography variant="h6" align="center">Выполнено</Typography>
                </Paper>
              </Grid>
            </Grid>
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