import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Divider, Button, Table, Modal, Select, Steps, Input, Radio } from 'antd';
import { withRouter, Link } from "react-router-dom";
import DataDetail from '../../../components/DataDetail';
import '../style.scss';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Manufacture1 from './Manufacture1';
import Manufacture2 from './Manufacture2';
import Manufacture3 from './Manufacture3';
import Manufacture4 from './Manufacture4';
import Manufacture5 from './Manufacture5';
const Manufacture = (props) => {
    document.title = "Sản xuất";
    const {machine_id} = useParams();
    const history = useHistory();
    useEffect(()=>{
        const screen = JSON.parse(localStorage.getItem('screen'));
        localStorage.setItem('screen', JSON.stringify({...screen, manufacture: machine_id ?? ''}))
        if(!machine_id){history.push('/manufacture/S01')}
    }, [machine_id])
    return (
            <React.Fragment>
                <Manufacture1/>
                {/* {line === '9' && <Manufacture1/>}
                {line === '21' && <Manufacture4/>}
                {['10', '11', '12', '13'].includes(line) && <Manufacture2/>}
                {line === '15' && <Manufacture3/>}
                {['22', '14'].includes(line) && <Manufacture5/>} */}
            </React.Fragment>
    );
};

export default withRouter(Manufacture);