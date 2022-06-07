// Framework Libs
import React from 'react';

// Material UI
import { makeStyles, alpha } from '@material-ui/core/styles';


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

import Core from '../core/Core';
import * as expressions from '../../../server/utils/expressions';

export default function ModalCreateTask(props) {
  const [state, setState] = React.useState({
    newTaskName: '',
    newTaskDescription: ''
  });

  const createTask = () => {
    props.onCreateTask(state.newTaskName, state.newTaskDescription);
    setState({newTaskName: '', newTaskDescription: ''})
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className="modal_window_wrapper">
        <div className="modal_window">
          <Typography align="center" variant="h5">Новая задача</Typography>
          <Divider/><br/>
          <Box m={1}>
            <TextField onChange={(ev) => setState({...state, newTaskName: ev.currentTarget.value})} value={state.newTaskName} style={{width: '100%'}} label="Название задания" variant="outlined" /><br/><br/>
            <TextField onChange={(ev) => setState({...state, newTaskDescription: ev.currentTarget.value})} value={state.newTaskDescription} style={{width: '100%'}} multiline label="Описание" variant="outlined" />
          </Box>

          <Box m={1} display='flex' justifyContent='flex-end'>
            <Button onClick={() => createTask()} color="primary" variant="contained">Создать</Button>
          </Box>
        </div>
      </div>
    </Modal>
  );
}