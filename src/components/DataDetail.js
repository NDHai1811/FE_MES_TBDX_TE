import { Card, Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";


const DataDetail = (props)=>{
    const {data = [], onClick = null, boldBlack = true} = props;
    const [gridStyle, setGridStyle] = useState();
    useEffect(()=>{
        setGridStyle({
            width: data.length > 0 ? (100/data.length)+'%' : '100%',
            textAlign: 'center',
        })
    }, [data])
    return (
        <Card>
        {data.map((val, index)=>{
            let radiusLeft = '0px';
            let radiusRight = '0px';
            let _borderRight = '2px';
            if(index === 0) radiusLeft = '8px';
            if(index === (data.length - 1)) {
                radiusRight = '8px';
            }
            return <Card.Grid style={{...gridStyle, padding: 0, borderInlineEnd: index === data.length - 1 ? 'none' : '0.5px solid #d9d9d9'}} hoverable={val?.onClick ? true : false} onClick={val?.onClick} key={index}>
                <div style={{ flex:1, height:'100%', display:'flex', boxShadow:'20px black'}} key={index}>
                    <div style={{flex:1, flexDirection:'column', display:'flex', textAlign:'center', backgroundColor: val?.color ? val?.color : '#EBEBEB', fontWeight:'600', color: val?.color ? 'white' : 'unset'}}>
                        <span style={{padding:'5px',borderTopLeftRadius:radiusLeft,borderTopRightRadius:radiusRight, color: 'white', flex:1, backgroundColor: val?.bg ?? '#0454a2', minHeight:40}} className="align-items-center d-flex justify-content-center">{val?.title}</span>
                        <span style={{overflow:'auto',minHeight:'fit-content',padding:'5px',borderBottomLeftRadius:radiusLeft,borderBottomRightRadius:radiusRight, flex:1, backgroundColor:'white', fontWeight:boldBlack == true ? '700' : '500', color:boldBlack == true ? 'black' : '#929292', backgroundColor: val?.cell_color ?? 'white'}} className="align-items-center d-flex justify-content-center">{val?.value}</span>
                    </div>
                </div>
            </Card.Grid>
            
        })}
        </Card>
    )
}

export default DataDetail;