// Framework Libs
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Material UI
import { makeStyles, alpha } from '@material-ui/core/styles';

// Components
import Header from './Header';

// Routes
import Main from '../routes/Main';
import UserProfile from '../routes/UserProfile';
import NewOrganization from '../routes/NewOrganization';
import NewProject from '../routes/NewProject';

const useStyles = makeStyles((theme) => ({
}));

export default function App(_props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    menuAvatar: null
  });

  function onClickAvatar(event) {
    setState({...state, menuAvatar: event.currentTarget});
  }

  function onCloseAvatar() {
    setState({...state, menuAvatar: null});
  }
  
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/profile/:user_id" element={<UserProfile />}></Route>
        <Route path="/profile/:user_id/:page" element={<UserProfile />}></Route>
        <Route path="/new_organization" element={<NewOrganization />}></Route>
        <Route path="/new_project" element={<NewProject />}></Route>
      </Routes>
    </BrowserRouter>
  );
}