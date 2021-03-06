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
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  RadioGroup,
  Radio,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';

import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';

import { createTheme, makeStyles, } from '@material-ui/core/styles';

import Core from '../core/Core';
import { projname_expr } from '../tools/expressions';

import SuccessButton from '../components/SuccessButton';

const useStyles = makeStyles((theme) => ({
  root_container: {
    marginTop: theme.spacing(7)
  },
  avatar: {
    borderRadius: theme.shape.borderRadius,
    imageRendering: 'pixelated',
    marginRight: theme.spacing(2)
  },
  project_field: {
    minWidth: 350
  },
  radio: {
  }
}));

const PrivacyLabel = (Icon, color, label1, label2) => (
  <div style={{display: 'flex', alignItems: 'center'}}>
    <Icon fontSize="large" style={{color, marginRight: 7}} />
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Typography style={{fontSize: '16px'}} variant="h6">{label1}</Typography>
      <Typography variant="body2">{label2}</Typography>
    </div>
  </div>
);

export default function Main() {
  const [_count, forceUpdate] = React.useReducer(x => x + 1, 0);
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();


  const [state, setState] = React.useState({
    projectName: '',
    privacy: "public",
    creating: false
  });

  function onCreate() {
    setState({...state, creating: true});
    Core.Network.createUserProject(state.projectName, state.privacy).then(() => {
      setTimeout(() => {
        navigate(`/profile/${window.user_info.id}/projects`);
      }, 500);
    });
  }

  const isValid = projname_expr.test(state.projectName);

  return (
    <Container className={classes.root_container} maxWidth="md">
      <Typography variant="h5">???????????????? ???????????? ??????????????</Typography>
      <Typography style={{color: '#555555'}} variant="body2">???????????? ???????????????? ???????????? ?????????? ??????????????????????, ???????????? ???? ?????????????? ???????????????? ?????????????????????????? ?????????????? ??????????????</Typography>
      <br/><Divider/><br/>
      <Paper style={{paddingBottom: '1px'}}>
        <Toolbar>
          <Avatar className={classes.avatar} src={`profile_photos/${window.user_info.photo_name}`} />
          <Typography variant="body1">{window.user_info.nick}</Typography>
          <Typography style={{marginRight: 15, marginLeft: 15}} variant="h4">/</Typography>
          <TextField onChange={(ev) => setState({...state, projectName: ev.currentTarget.value})} className={classes.project_field} size="small" id="outlined-basic" label="???????????????? ??????????????" variant="outlined" value={state.projectName} />
        </Toolbar>
        <br/><Divider/>
        <Box m={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">??????????????????????</FormLabel><br/>
            <RadioGroup aria-label="privacy" value={state.privacy} onChange={(ev, privacy) => setState({...state, privacy})}>
              <FormControlLabel value="public" control={<Radio className={classes.radio} color="primary" />} label={PrivacyLabel(PublicIcon, '#555555', "??????????????????", "?????????? ???????? ??????????????????????????")} />
              <div style={{width:1, height:7}}/>
              <FormControlLabel value="private" control={<Radio className={classes.radio} color="primary" />} label={PrivacyLabel(LockIcon, '#9a6700', "??????????????????", "?????????? ???????????? ???????????????????? ??????????????")} />
            </RadioGroup>
          </FormControl>
        </Box>
      </Paper>
      <br/>
      <SuccessButton disabled={!isValid || state.creating} onClick={onCreate}>
        {"?????????????? ????????????"}
        {state.creating && <CircularProgress style={{marginLeft: 10}} size={25} />}
      </SuccessButton>
    </Container>
  );
}