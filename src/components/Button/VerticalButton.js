import { QrcodeOutlined } from "@ant-design/icons";
import { Button } from "antd";

const VerticalButton = (props) =>{
    const {
        text = 'Scan QR',
        style = null,
        icon = null,
        color = '#1677ff',
    } = props;
    return (
        <Button type="primary" 
        style={ style ?? {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 'auto',
            width: '100px !important',
            minWidth:100,
            backgroundColor:color,
        }}>{icon}<span style={{margin: 0}}>{text}</span></Button>
    )
}

export default VerticalButton;