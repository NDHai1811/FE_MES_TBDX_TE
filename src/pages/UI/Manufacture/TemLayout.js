import React from "react";
import styled from "styled-components";
import "./style.css";
import { QRCode } from "antd";

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
              <td colSpan={5}>
                <div className="d-flex justify-content-center flex-column w-100 text-center">
                  <QRCode
                      style={{ display: 'flex', width:'100%', alignSelf:'center', textAlign:'center' }}
                      value={detail}
                      bordered={false}
                      size={300}
                      type="svg"
                    />
                  <div className="flex-column">
                    <h3 style={{ marginLeft: "8px",fontSize:'28px',marginTop:'18px' }}>{detail}</h3>
                  </div>
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
