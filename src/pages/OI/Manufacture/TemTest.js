import React from "react";
import Barcode from "react-barcode";
import styled from "styled-components";
import "./style.css";
import dayjs from "dayjs";
import { QRCode, Space } from "antd";
import logolight from "../../../assets/images/logo.jpg";

const PageBreakWrapper = styled.div`
  && {
    page-break-after: always;
  }
`;

const PrintTemplate = ({ detail }) => {
  return (
    <div>
      <div className="print-only">
        <table>
          <thead>
            <tr>
              <th style={{ width: "20%" }}></th>
              <th style={{ width: "20%" }}></th>
              <th style={{ width: "20%" }}></th>
              <th style={{ width: "20%" }}></th>
              <th style={{ width: "20%" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={12}>
                <div className="d-flex justify-content-center flex-column w-100 text-center">
                  <QRCode
                      style={{ display: 'flex', width:'100%', alignSelf:'center', textAlign:'center' }}
                      value={detail.id}
                      bordered={false}
                      size={450}
                      type="svg"
                    />
                  <div className="flex-column" style={{alignSelf:'center', textAlign:'center', display: 'flex', justifyContent:'center', alignContent:'center', verticalAlign:'middle', height:'100%', width:'100%'}}>
                    <h1 style={{ fontSize:'60px', alignSelf:'center', textAlign:'center', display: 'flex', justifyContent:'center', alignContent:'center', verticalAlign:'middle', height:'100%'  }}>{detail?.id}</h1>
                    {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                  </div>
                  {/* <div className="flex-column">
                    <img src={logolight} width={70} style={{ marginRight: "10px",marginLeft:'10px',marginTop:'10px' }}/>
                  </div> */}
                  {/* <Barcode value={detail.lot_id} format="CODE128" height={32} width={1.5} fontSize={16} /> */}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PageBreakWrapper>&nbsp;</PageBreakWrapper>
    </div>
  );
};
export default class TemTest extends React.Component {
  render() {
    let printingPages = [];
    const { listCheck } = this.props;
    // for (const detail of listCheck) {
    listCheck.forEach((detail, index) => {
      const tempTemplate = <PrintTemplate detail={detail} key={index} />;
      printingPages.push(tempTemplate);
    });

    // }
    return <div>{printingPages}</div>;
  }
}
