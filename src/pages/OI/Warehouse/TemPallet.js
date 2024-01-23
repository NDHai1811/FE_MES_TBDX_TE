import React from "react";
import styled from "styled-components";
import "./style.css";
import { QRCode } from "antd";
import logolight from "../../../assets/images/logo.jpg";

const PageBreakWrapper = styled.div`
  && {
    page-break-after: always;
  }
`;

const PrintTemplate = ({ info }) => {
  return (
    <div>
      <div className="print-only">
        <table>
          <thead>
            <tr>
              <th style={{ width: "33%" }}></th>
              <th style={{ width: "33%" }}></th>
              <th style={{ width: "33%" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ lineHeight: '120px!important' }}>
              <td colSpan={3}>
                <div className="d-flex justify-content-between" style={{ height: '120px!important' }}>
                  <QRCode
                    style={{ marginRight: "5px" }}
                    value={info[0]?.pallet_id}
                    bordered={false}
                    size={120}
                    type="svg"
                  />
                  <div className="flex-column">
                    <h3
                      style={{
                        marginLeft: "8px",
                        fontSize: '32px',
                        marginTop: '38px'
                      }}
                    >
                      TEM GỘP
                    </h3>
                  </div>
                  <div className="flex-column">
                    <img
                      src={logolight}
                      width={110}
                      style={{
                        marginRight: "10px",
                        marginLeft: "10px",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr style={{ lineHeight: '25px' }}>
              <td colSpan={3}><span style={{ marginLeft: '10px' }}>Khách hàng:</span> <b>{info[0]?.khach_hang}</b></td>
            </tr>
            <tr style={{ lineHeight: '20px' }}>
              <td className="text-center">MDH</td>
              <td className="text-center">MQL</td>
              <td className="text-center">Số lượng</td>
            </tr>
            {info.map(function (detail) {
              return (
                <>
                  <tr style={{ lineHeight: '20px' }}>
                    <td className="text-center">{detail.mdh}</td>
                    <td className="text-center">{detail.mql}</td>
                    <td className="text-center">{detail.so_luong}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      <PageBreakWrapper>&nbsp;</PageBreakWrapper>
    </div>
  );
};
export default class TemPallet extends React.Component {
  render() {
    let printingPages = [];
    const { info } = this.props;
    // for (const detail of listCheck) {
    for (let i = 0; i < 3; i++) {
      const tempTemplate = <PrintTemplate info={info} />;
      printingPages.push(tempTemplate);
    }
    // }
    return <div>{printingPages}</div>;
  }
}
