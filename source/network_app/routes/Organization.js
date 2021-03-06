import React from 'react';
import { useLocation, useParams, useNavigate, Routes, Route, Link } from 'react-router-dom'

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@material-ui/core';

import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import PeopleIcon from '@material-ui/icons/People';

import { createTheme, makeStyles, } from '@material-ui/core/styles';


import Core from '../core/Core';
import { int_expr } from '../tools/expressions';

import DestructButton from '../components/DestructButton';
import SuccessButton from '../components/SuccessButton';

import OrganizationProjects from './OrganizationProjects';
import OrganizationParticipants from './OrganizationParticipants';

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
    marginTop: theme.spacing(3),
    fontSize: '14px',
  }
}));

const pages = ['projects', 'participants'];

const IconTab = (Icon, text) => (
  <span style={{display: 'flex'}}><Icon style={{marginRight: 7}} fontSize="small" />{text}</span>
);

function TabPanel({ index, value, children }) {
  if (index != value) {
    return <></>;
  }

  return children || <></>;
}

export default function Main() {
  const [_count, forceUpdate] = React.useReducer(x => x + 1, 0);
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pageID = Math.max(pages.indexOf(params.page), 0);

  
  const [state, setState] = React.useState({
    orgExists: true,
    orgForbidden: false,
    orgInfo: null,
    loading: true,
    right: null,
    pageID: 0
  });

  React.useEffect(() => {
    if (int_expr.test(params.org_id)) {
      Core.Network.getOrganization(params.org_id) .then(res => {
        if (res.data === undefined) {
          setState({...state, orgExists: false, loading: false});
        } else if (res.data === null) {
          setState({...state, orgForbidden: true, loading: false});
        } else {
          setState({...state, orgInfo: res.data, right: res.data.right, loading: false})
        }
      });
    } else {
      setState({...state, userExists: false, loading: false});
    }
  }, [params.user_id]);

  if (state.loading) {
    return <LinearProgress />;
  } else if (!state.orgExists) {
    return <Typography style={{marginTop: 100}} variant="h5" align="center">?????????? ?????????????????????? ???? ????????????????????</Typography>;
  } else if (state.orgForbidden) {
    return <Typography style={{marginTop: 100}} variant="h5" align="center">???????????? ?????????????????????? ???????????????????? ?????? ??????????????????</Typography>;
  }

  const createdDate = new Date(state.orgInfo.createdAt)
  const pad = (s) => (s < 10) ? '0' + s : s;
  console.log(state.right);

  function enterToOrganization() {
    Core.Network.enterToOrganization(state.orgInfo.id).then(res => {
      setState({...state,
        right: 2
      });
    });
  }

  function leaveFromOrganization() {
    Core.Network.leaveFromOrganization(state.orgInfo.id).then(res => {
      setState({...state,
        right: 3
      });
    });
  }
  
  function deleteOrganization() {
    if (confirm(`???? ??????????????, ?????? ???????????? ?????????????? ?????????????????????? "${state.orgInfo.name}"?`)) {
      Core.Network.removeOrganization(state.orgInfo.id).then(res => {
        navigate('/');
      });
    }
  }

  return (
    <Container className={classes.root_container} maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Box>
            <img className={classes.profile_image} src={`/organization_photos/${state.orgInfo.photoName}`} />
          </Box>

          <Typography className={classes.name}><b>??????????????????????</b></Typography>
          <Typography className={classes.nickname}><b>{state.orgInfo.name}</b></Typography>
          {state.right == 0 &&
            <DestructButton onClick={() => deleteOrganization()} style={{width: '100%'}}>??????????????</DestructButton>
          }
          {state.right >= 1 && state.right <= 2 &&
            <DestructButton onClick={() => leaveFromOrganization()} style={{width: '100%'}}>????????????????</DestructButton>
          }
          {state.right == 3 &&
            <SuccessButton onClick={() => enterToOrganization()} style={{width: '100%'}}>????????????????</SuccessButton>
          }
          <Typography className={classes.created_date}>???????? ????????????????: {createdDate.getFullYear()}.{pad(createdDate.getMonth() + 1)}.{pad(createdDate.getDate() + 1)}</Typography>

        </Grid>
        <Grid item xs={9}>
          <Paper>
            <Tabs
              indicatorColor="primary"
              value={pageID}
              onChange={(ev, ind) => navigate(`/organization/${state.orgInfo.id}/${pages[ind]}`) || forceUpdate()}>
              <Tab id="profile-tab-1" label={IconTab(WorkOutlineIcon, "??????????????")} />
              <Tab id="profile-tab-2" label={IconTab(PeopleIcon, "??????????????????")} />
            </Tabs>
            <Divider />
            <TabPanel index={0} value={pageID}>
              <OrganizationProjects right={state.right} orgInfo={state.orgInfo} />
            </TabPanel>

            <TabPanel index={1} value={pageID}>
              <OrganizationParticipants right={state.right} orgInfo={state.orgInfo} />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}