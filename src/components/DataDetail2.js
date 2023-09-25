import { Col, Row, Card } from "antd";

const DataDetail2 = (props)=>{
    const {infoPO = [], onClick = null} = props;
    
    return (
        <Row style={{ borderWidth: '1px 0', borderColor: '#2462A3', borderStyle:'solid', background: '#fff', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', flex:1, }}
        onClick={onClick}>
            {
                  infoPO.map(item=>{
                        return <Col style={{width:'19%'}}>
                                    <Card.Grid className="mb-2" style={{color:'#2462A3', textAlign:"center"}}><strong>{item?.title}</strong></Card.Grid>
                                    <Card.Grid style={{color:'#2462A3', textAlign:"center", backgroundColor:'#D9D9D9'}}>{item?.value}</Card.Grid>
                              </Col>
                  })
            }
        </Row>
    )
}

export default DataDetail2;