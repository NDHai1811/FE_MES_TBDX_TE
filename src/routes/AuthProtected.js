import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "../components/hooks/UserHooks";

import { logoutUser } from "../store/actions";

import { setUserProfile } from "../store/actions";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile } = useProfile();
  useEffect(() => {
    if (userProfile) {
      dispatch(setUserProfile(JSON.parse(localStorage.getItem("authUser"))));
      setAuthorization(userProfile.token);
    } else if (!userProfile) {
      dispatch(logoutUser());
    }
  }, [userProfile, dispatch]);

  /*
    redirect is un-auth access protected routes via url
    */

  if (!userProfile) {
    return (
      <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {" "}
            <Component {...props} />{" "}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
