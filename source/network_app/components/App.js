import React from 'react';

import { makeStyles, alpha } from '@material-ui/core/styles';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  InputBase,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';


import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    [theme.breakpoints.up('sm')]: {
      minHeight: 52
    }
  },
  title: {
    display: 'none',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      marginRight: theme.spacing(3)
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '160px',
      '&:focus': {
        width: '240px',
      },
    },
  },
  empty_space: {
    flexGrow: 1,
    height: 1,
    width: "100%",
    flexShrink: 1
  },
  avatar: {
    borderRadius: theme.shape.borderRadius,
    imageRendering: 'pixelated'
  },
  avatar_button: {
    padding: 0,
    paddingLeft: theme.spacing(2)
    // width: '40px !important',
    // minWidth: 'unset'
  },
  profile_name: {
    marginRight: theme.spacing(2),
    fontWeight: 400
  }
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
    <>
      {/* <Header> */}

      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.title} variant="h4" noWrap>
            ВДеле
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase classes={{input: classes.input}} placeholder="Поиск…" color="secondary"
              inputProps={{ 'aria-label': 'search' }} />
          </div>
          <div className={classes.empty_space} />
          <div>
            <Button onClick={onClickAvatar} className={classes.avatar_button}>
              <span className={classes.profile_name}>{window.user_info.nick}</span>
              <Avatar className={classes.avatar} alt="personal photo" src={`/profile_photos/${window.user_info.photo_name}`} />
            </Button>
            <Menu onClose={onCloseAvatar} open={!!state.menuAvatar}
              anchorEl={state.menuAvatar}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem>Профиль</MenuItem>
              <MenuItem>Мои проекты</MenuItem>
              <MenuItem>Мои организации</MenuItem>
              <MenuItem>Выйти</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>


      {/* </Header> */}

    </>
  );
}