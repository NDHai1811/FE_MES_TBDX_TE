import { Button } from "antd";
import image from "../assets/images/403.jpg";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ForbiddenPage = () => {
    return (<div style={{height: '100vh', width: '100vw', zIndex: 999999, top: 0, left: 0, position: 'fixed', backgroundColor:'white', textAlign: 'center'}}>
        <Button icon={<ArrowLeftOutlined/>} onClick={()=>window.history.back()} style={{position:'absolute', top: 10, left: 10}} type="text">Quay lại</Button>
        <img src={image} style={{objectFit:'contain', width: '80%', height: '100%'}}/>
    </div>
    );
}
export default ForbiddenPage;