import { Layout, Menu } from "antd"
import logolight from "../../../assets/images/logo.png";
const { Header }  =Layout;
const headerStyle = {
    textAlign: 'center',
    color: '#2462a3',
    display: '-webkit-inline-box',
    height: 60,
    paddingInline: '0',
    lineHeight: '32px',
    backgroundColor: '#2462a3',
    width:'100%',
    justifyContent: 'space-between'
};
const items = [{
    key: 2,
    label: 'Sản xuất'
},
{
    key: 3,
    label: 'Chất lượng'
},
{
    key: 4,
    label: 'Kho'
}, {
    key: 5,
    label: 'Thiết bị'
}]
const UIHeader = (props)=>{
    return (
        <Header style={headerStyle}>
            <div className="demo-logo" style={{ display: 'flex'}} >
                <img style={{ height: '80%', margin: 'auto' }} src={logolight} />
            </div>
            <Menu
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    background: '#2462a3',
                    color: '#fff',
                    fontWeight: '600'

                }}
                items={items}
            />
        </Header>
    )
    
}
export default UIHeader;