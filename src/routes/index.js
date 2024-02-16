import React from "react";
import { Switch, Route } from "react-router-dom";

//Layouts

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected, AccessRoute } from "./AuthProtected";

const Index = () => {
  const availablePublicRoutesPaths = publicRoutes.map((r) => r.path);
  const availableAuthRoutesPath = authProtectedRoutes.map((r) => r.path);
  return (
    <React.Fragment>
      <Switch>
        <Route path={availablePublicRoutesPaths.flat()}>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <Route
                path={route.path}
                component={route.component}
                key={idx}
                exact={true}
              />
            ))}
          </Switch>
        </Route>

        <Route path={availableAuthRoutesPath.flat()}>
          <AuthProtected>
            <Switch>
              {authProtectedRoutes.map((route, idx) => (
                <AccessRoute
                  path={route.path}
                  component={route.component}
                  key={idx}
                  exact={true}
                  permission={route.permission}
                />
              ))}
            </Switch>
          </AuthProtected>
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default Index;
