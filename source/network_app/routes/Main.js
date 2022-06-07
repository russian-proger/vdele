import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  placeholder: {
    width: '100%',
    height: 'calc(100vh - 100px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'gray',
    fontSize: '25px',
    fontFamily: 'Roboto'
  }
}));

export default function Main() {
  const classes = useStyles();

  return (
    <main>
      <div className={classes.placeholder}>
        Лучшие проекты в одном месте
      </div>
    </main>
  );
}