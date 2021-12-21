import React from 'react';
import { useLocation, useParams } from 'react-router-dom'

import {CircularProgress} from '@material-ui/core';

export default function Main() {
  const location = useLocation();
  const params = useParams();

  
  const my_profile = (params.user_id == window.user_info.id);
  const [userInfo, setUserInfo] = React.useState(my_profile ? window.user_info : null);

  React.useEffect(() => {
    if (userInfo == null) {
      
    }
  }, []);


  if (userInfo == null) {
    return (
      <CircularProgress />
    )
  }
  return (
    <main>{userInfo}</main>
  );
}