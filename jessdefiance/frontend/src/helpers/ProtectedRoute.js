import React from "react";
import { Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  console.log(localStorage.getItem('access-token') !== null);
  return <Route {...rest} render={(props) => (
    localStorage.getItem('access-token') !== null
      ? <Component {...props} />
      : <Redirect to='/login'/>
  )}/>
};
