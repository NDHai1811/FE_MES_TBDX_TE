import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Footer from './Footer';
import Header from './Header';
import HeaderUI from './HeaderUI';
import UserCard from '../components/UserCard';
import './layoutStyle.scss';

const Layout = (props) => {
    return (
        <React.Fragment>
            { window.location.pathname === '/login' &&
            <div id="layout-wrapper" style={{height:'100%'}}>
                <div className="main-content" style={{backgroundColor: '#e3eaf0', minHeight:'100%'}}>
                    {props.children}
                </div>
            </div>}
            { !window.location.pathname.toLocaleLowerCase().includes('/ui') ?
                    !window.location.pathname.toLocaleLowerCase().includes('/dashboard') && !window.location.pathname.toLocaleLowerCase().includes('/screen') ?
                    <div id="layout-wrapper" style={{height:'100%'}}> 
                        <Header/>
                        <div className="main-content" style={{paddingInline: '0.5em', minHeight:'100%'}}>
                            <div style={{display:'flex', justifyContent:'space-between' }}>
                                <UserCard/>
                            </div>
                            <div style={{marginBottom:60}}>{props.children}</div>
                        </div>
                        <Footer />
                    </div> 
                    :
                    <div>{props.children}</div>
                :
                <div id="layout-wrapper" style={{height:'100%', minHeight:'100vh'}}>
                    <HeaderUI/>   
                    <div>{props.children}</div>
                </div>
            } 
        </React.Fragment>
    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default withRouter(Layout);