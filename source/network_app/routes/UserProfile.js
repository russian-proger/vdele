import React from 'react';
import { useLocation, useParams } from 'react-router-dom'

export default function Main() {
  const location = useLocation();
  const params = useParams();
  console.log(params);
  return (
    <main>Profile: {params.user_id}</main>
  );
}