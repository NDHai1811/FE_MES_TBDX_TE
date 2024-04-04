import React from "react";
import styled from "styled-components";
import "./style.css";
import { QRCode } from "antd";
import logolight from "../../../assets/images/logo.jpg";
import dayjs from "dayjs";

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
              <th style={{ width: "25%" }}></th>
              <th style={{ width: "25%" }}></th>
              <th style={{ width: "25%" }}></th>
              <th style={{ width: "25%" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ lineHeight: '120px!important' }}>
              <td colSpan={4}>
                <div className="d-flex justify-content-between" style={{ height: '120px!important' }}>
                  <div>
                    <QRCode
                      style={{ marginRight: "5px" }}
                      value={info[0]?.pallet_id}
                      bordered={false}
                      size={120}
                      type="svg"
                    />
                    <span>{info[0]?.pallet_id}</span>
                  </div>
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
              <td colSpan={2}><span style={{ marginLeft: '10px' }}>Khách hàng:</span> <b>{info[0]?.khach_hang} {info[0]?.customer_id}</b></td>
              <td colSpan={2}><span style={{ marginLeft: '10px' }}>Ngày:</span> <b>{dayjs(info[0]?.created_at).format('DD/MM/YYYY')}</b></td>
            </tr>
            <tr style={{ lineHeight: '20px' }}>
              <td className="text-center">STT</td>
              <td className="text-center">MDH</td>
              <td className="text-center">MQL</td>
              <td className="text-center">Số lượng</td>
            </tr>
            {info.map(function (detail, index) {
              return (
                <>
                  <tr style={{ lineHeight: '20px' }}>
                    <td className="text-center">{index + 1}</td>
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
    const { listCheck } = this.props;
    let printingPages = [];
    for (const info of listCheck) {
      const tempTemplate = <PrintTemplate info={info} />;
      printingPages.push(tempTemplate);
    }
    return <div>{printingPages}</div>;
  }
}
