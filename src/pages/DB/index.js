import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import DBTinhHinhSanXuat from "../../pages/DB/TinhHinhSanXuat";
import DBHieuSuatThietBi from "../../pages/DB/HieuSuatThietBi";
import DBCanhBaoBatThuong from "../../pages/DB/CanhBaoBatThuong";
const DashBoard = (props) => {
    document.title = "Dashboard";
    const {screen} = useParams();
    const history = useHistory();
    const dashboard = [
        {
            key: '0',
            title: 'Tình hình sản xuất',
            link: '/dashboard/tinh-hinh-san-xuat',
            component: <DBTinhHinhSanXuat/>
        },
        // {
        //     key: '1',
        //     title: 'Hiệu suất thiết bị',
        //     link: '/dashboard/hieu-suat-thiet-bi',
        //     component: <DBHieuSuatThietBi/>
        // },
        {
            key: '1',
            title: 'Cảnh báo bất thường',
            link: '/dashboard/canh-bao-bat-thuong',
            component: <DBCanhBaoBatThuong/>
        },
    ]
    let interval;
    useEffect(()=>{
        interval = setInterval(()=>{
            if(screen && screen < dashboard[dashboard.length-1].key){
                history.push('/dashboard-slide/'+(parseInt(dashboard.find(e=>e.key === screen).key)+1));
            }else{
                history.push('/dashboard-slide/0');
            }
        }, 30000);
        return ()=>clearInterval(interval)
    }, [screen])
    const [component, setComponent] = useState();
    useEffect(()=>{
        if(screen){
            setComponent(dashboard.find(e=>e.key === screen))
        }else{
            history.push('/dashboard-slide/0');
        }
    }, [screen])
    return (
        <React.Fragment>
            {component?.component}
        </React.Fragment>
    );
};

export default withRouter(DashBoard);