import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import HeaderUI from "./HeaderUI";
import UserCard from "../components/UserCard";
import "./layoutStyle.scss";

const Layout = (props) => {
  return (
    <React.Fragment>
      <div id="layout-wrapper" style={{ height: "100%", display: 'flex', flexFlow: 'column' }}>
        {window.location.pathname === "/login" && (
          <div
            className="main-content"
            style={{ backgroundColor: "#e3eaf0", minHeight: "100%" }}
          >
            {props.children}
          </div>
        )}
        {window.location.pathname.toLocaleLowerCase().includes("/oi/") ? (
          <>
            <Header />
            <div
              className="main-content"
              style={{
                paddingInline: "0.5em",
                minHeight: "100%",
              }}
            >
                <UserCard />
              <div style={{ marginBottom: 60 }}>{props.children}</div>
            </div>
            <Footer />
          </>
        ) : window.location.pathname.toLocaleLowerCase().includes("/ui/") ? (
          <>
            <HeaderUI />
            <div className="content-below-header">{props.children}</div>
          </>
        ) : (
          props.children
        )}
      </div>
    </React.Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.object,
};

export default withRouter(Layout);
