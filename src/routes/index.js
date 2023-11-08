import React from 'react';
import { Switch, Route, useLocation } from "react-router-dom";

//Layouts
import VerticalLayout from "../layouts/index";
//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected, AccessRoute } from './AuthProtected';
import NonAuthLayout from '../layouts/NonAuthLayout';
import { useProfile } from '../components/hooks/UserHooks';

const Index = () => {
    const location = useLocation();
    const { userProfile } = useProfile();
    const availablePublicRoutesPaths = publicRoutes.map((r) => r.path);
    const availableAuthRoutesPath = authProtectedRoutes.map((r) => r.path);
    return (
        <React.Fragment>
            <Switch>
                <Route path={availablePublicRoutesPaths}>
                    {/* <VerticalLayout>
                    <NonAuthLayout> */}
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
                    {/* </NonAuthLayout>
                    </VerticalLayout> */}
                </Route>

                <Route path={availableAuthRoutesPath}>
                    <AuthProtected>
                        <VerticalLayout>
                            <Switch>
                                {authProtectedRoutes.map((route, idx) => (
                                    <AccessRoute
                                        path={route.path}
                                        component={route.component}
                                        key={idx}
                                        exact={true}
                                    />
                                ))}
                            </Switch>
                        </VerticalLayout>
                    </AuthProtected>
                </Route>
            </Switch>
        </React.Fragment>
    );
};

export default Index;