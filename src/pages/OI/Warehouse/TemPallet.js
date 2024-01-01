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
              <th style={{ width: "50%" }}></th>
              <th style={{ width: "50%" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="d-flex justify-content-between">
                  <QRCode
                    style={{ marginRight: "5px" }}
                    value={info[0]?.pallet_id}
                    bordered={false}
                    size={80}
                    type="svg"
                  />
                  <div className="flex-column">
                    <h3
                      style={{
                        marginLeft: "8px",
                        fontSize: "28px",
                        marginTop: "18px",
                      }}
                    >
                      TEM GỘP NHẬP KHO
                    </h3>
                  </div>
                  <div className="flex-column">
                    <img
                      src={logolight}
                      width={70}
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
            <tr>
              <td colSpan={2}>Khách hàng: {info[0]?.khach_hang}</td>
            </tr>
            <tr>
              <td className="text-center">Mã quản lý</td>
              <td className="text-center">Số lượng</td>
            </tr>
            {info.map(function (detail) {
              return (
                <tr>
                  <td>{detail.mql}</td>
                  <td>{detail.so_luong}</td>
                </tr>
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
    const tempTemplate = <PrintTemplate info={info} />;
    printingPages.push(tempTemplate);
    // }
    return <div>{printingPages}</div>;
  }
}
