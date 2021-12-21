import React from 'react';
import { useLocation, useParams, useNavigate, Routes, Route, Link } from 'react-router-dom'

import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@material-ui/core';

import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import ApartmentIcon from '@material-ui/icons/Apartment';

import { makeStyles } from '@material-ui/core/styles';

import Core from '../core/Core';
import { int_expr } from '../tools/expressions';

const useStyles = makeStyles((theme) => ({
  root_container: {
    marginTop: theme.spacing(2)
  },
  profile_image: {
    width: '100%',
    imageRendering: 'pixelated',
    borderRadius: theme.shape.borderRadius,
    boxSizing: 'border-box'
  },
  name: {
    fontSize: '26px',
    fontWeight: 700,
    margin: 0
  },
  nickname: {
    fontSize: '21px',
    fontWeight: 400,
    margin: 0,
    marginBottom: theme.spacing(3)
  },
  created_date: {
    fontSize: '14px',
  }
}));

const pages = ['projects', 'organizations'];

const IconTab = (Icon, text) => (
  <span style={{display: 'flex'}}><Icon style={{marginRight: 7}} fontSize="small" />{text}</span>
);

export default function Main() {
  const [_count, forceUpdate] = React.useReducer(x => x + 1, 0);
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pageID = Math.max(pages.indexOf(params.page), 0);

  
  const my_profile = (params.user_id == window.user_info.id);
  const [state, setState] = React.useState({
    userExists: true,
    userInfo: null
  });

  React.useEffect(() => {
    if (!my_profile) {
      if (int_expr.test(params.user_id)) {
        Core.Network.getUser(params.user_id) .then(res => {
          if (!res.data) setState({...state, userExists: false});
          else setState({...state, userInfo: res.data});
        });
      } else {
        setState({...state, userExists: false});
      }
    } else {
      setState({...state, userInfo: window.user_info})
    }
  }, [params.user_id]);

  if (!state.userExists) return (
    <Typography style={{marginTop: 100}} variant="h5" align="center">Такой страницы не существует :(</Typography>
  );

  if (state.userInfo == null) {
    return (
      <CircularProgress />
    )
  }

  const createdDate = new Date(state.userInfo.created_dt)
  const pad = (s) => (s < 10) ? '0' + s : s;

  return (
    <Container className={classes.root_container} maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box>
            <img className={classes.profile_image} src={`/profile_photos/${state.userInfo.photo_name}`} />
          </Box>

          <Typography className={classes.name}><b>{state.userInfo.first_name} {state.userInfo.last_name}</b></Typography>
          <Typography className={classes.nickname}>{state.userInfo.nick}</Typography>
          <Typography className={classes.created_date}>Дата создания: {createdDate.getFullYear()}.{pad(createdDate.getMonth() + 1)}.{pad(createdDate.getDate() + 1)}</Typography>

        </Grid>
        <Grid item xs={9}>
          <Paper>
            <Tabs
              indicatorColor="primary"
              value={pageID}
              onChange={(ev, ind) => navigate(`/profile/${state.userInfo.id}/${pages[ind]}`) || forceUpdate()}>
              <Tab id="profile-tab-1" label={IconTab(WorkOutlineIcon, "Проекты")} />
              <Tab id="profile-tab-2" label={IconTab(ApartmentIcon, "Организации")} />
            </Tabs>
            <Divider />
            <br/><br/>
            <Toolbar>
              <Button></Button>
            </Toolbar>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}