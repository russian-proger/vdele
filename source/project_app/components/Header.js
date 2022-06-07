import React from 'react';

import { alpha, makeStyles } from '@material-ui/core/styles';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';


const useStyles = makeStyles((theme) => ({
  toolbar: {
    [theme.breakpoints.up('sm')]: {
      minHeight: 45
    }
  },
  title: {
    display: 'none',
    flexShrink: 0,
    fontSize: '24px',
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
  inputRoot: {
    color: 'inherit'
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
  },
  separator: {
    height: 1,
    width: '100%',
    background: alpha(theme.palette.common.black, 0.15),
    marginTop: 5,
    marginBottom: 5
  },
  link: {
    color: 'unset',
    textDecoration: 'unset'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

export default function Header() {
  const classes  = useStyles();

  const [state, setState] = React.useState({
    menuAvatar: null
  });

  function onClickAvatar(event) {
    setState({...state, menuAvatar: event.currentTarget});
    return true;
  }

  function onCloseAvatar() {
    setState({...state, menuAvatar: null});
    return true;
  }

  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton> */}
        <Typography className={classes.title} variant="h6" noWrap>
          ВДеле | Проект
        </Typography>
        <div className={classes.empty_space} />
        <div>
          <Button onClick={onClickAvatar} className={classes.avatar_button} color="inherit">
            <span className={classes.profile_name}>{window.user_info.nick}</span>
            <Avatar className={classes.avatar} alt="personal photo" src={`/profile_photos/${window.user_info.photoName}`} />
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
            <Typography align='center'>{window.user_info.first_name} {window.user_info.last_name}</Typography>
            <div className={classes.separator} />
            {/* <MenuItem onClick={() => window.open(`/profile/${window.user_info.id}`, '_self')}>Профиль</MenuItem> */}
            <MenuItem onClick={() => window.open(`/profile/${window.user_info.id}/projects`, '_self')}>Мои проекты</MenuItem>
            <MenuItem onClick={() => window.open(`/profile/${window.user_info.id}/organizations`, '_self')}>Мои организации</MenuItem>
            <div className={classes.separator} />
            <MenuItem onClick={() => window.open('/quit', '_self')}>Выйти</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}