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
              <td colSpan={5}>
                <div className="d-flex justify-content-between" style={{ margin: '0px' }}>
                  <QRCode
                    style={{ marginRight: "5px" }}
                    value={detail.qr_code}
                    bordered={false}
                    size={120}
                    type="svg"
                  />
                  <div className="flex-column">
                    <h3 style={{ fontSize: '32px', marginTop: '28px' }}>TEM DỢN SÓNG</h3>
                    {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                  </div>
                  <div className="flex-column">
                    <img src={logolight} width={120} style={{ marginRight: "5px", marginLeft: '5px', marginTop: '0px' }} />
                    {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                  </div>
                  {/* <Barcode value={detail.lot_id} format="CODE128" height={32} width={1.5} fontSize={16} /> */}
                </div>
              </td>
            </tr>
            <tr>
              <td className="text-center" colSpan={2} style={{ fontSize: '12px' }}>KHÁCH HÀNG</td>
              <td className="text-center" colSpan={2} style={{ fontSize: '12px' }}>ĐƠN HÀNG</td>
              <td className="text-center" style={{ fontSize: '12px' }}>LÔ SX</td>
            </tr>
            <tr>
              <td className="text-center" colSpan={2} style={{ fontWeight: '700', fontSize: '26px' }}>{detail.khach_hang}</td>
              <td className="text-center" colSpan={2} style={{ fontWeight: '700', fontSize: '26px' }}>{detail.mdh}</td>
              <td style={{ fontWeight: '700' }}>{detail.lo_sx}</td>
            </tr>
            <tr>
              <td className="text-center" style={{ fontSize: '12px' }}>DÀI</td>
              <td className="text-center" style={{ fontSize: '12px' }}>RỘNG</td>
              <td className="text-center" style={{ fontSize: '12px' }}>CAO</td>
              <td className="text-center" style={{ fontSize: '12px' }}>LOT</td>
              <td className="text-center" style={{ fontSize: '12px' }}>SỐ LƯỢNG</td>
            </tr>
            <tr>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.dai}</td>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.rong}</td>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.cao}</td>
              <td className="text-center" style={{ fontWeight: '500', fontSize: '26px' }}>{detail.lo_sx}</td>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.san_luong_kh}</td>
            </tr>
            <tr>
              <td className="text-center" style={{ fontSize: '12px' }}>KHỔ</td>
              <td className="text-center" style={{ fontSize: '12px' }}>DÀI</td>
              <td className="text-center" style={{ fontSize: '12px' }}>SỐ DAO</td>
              <td className="text-center" style={{ fontSize: '12px' }}>XẢ</td>
              <td className="text-center" style={{ fontSize: '12px' }}>SỐ LỚP</td>
            </tr>
            <tr>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.kho}</td>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.dai_tam}</td>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.so_dao}</td>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.so_ra}</td>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.so_lop}</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ fontSize: '12px' }}>GHI CHÚ SÓNG</td>
              <td className="text-center" style={{ fontSize: '12px' }}>SỐ PALLET</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ fontWeight: '700', fontSize: '26px' }}>{detail.note_3}</td>
              <td className="text-center" style={{ fontWeight: '700', fontSize: '26px' }}>{detail.thu_tu_uu_tien}</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ fontSize: '12px'}}>GHI CHÚ TBDX</td>
              <td colSpan={1} style={{ fontSize: '12px' }} className="text-center">ĐỢT</td>
            </tr>
            <tr>
              <td className="text-center" colSpan={4} style={{ fontWeight: '700', fontSize: '26px' }}>{detail.note_2}</td>
              <td className="text-center" colSpan={1} style={{ fontWeight: '700', fontSize: '26px' }}>{detail.dot}</td>
            </tr>
            <tr>
              <td className="text-center" style={{ fontSize: '12px' }}>NGÀY SX</td>
              <td className="text-center" style={{ fontSize: '12px', fontWeight: '700' }} colSpan={2}>{detail.thoi_gian_bat_dau}</td>
              <td className="text-center" style={{ fontSize: '12px' }}>CA SX</td>
              <td style={{ fontSize: '12px', fontWeight: '700' }}>{detail.ca_sx}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <PageBreakWrapper>&nbsp;</PageBreakWrapper>
    </div>
  );
};
export default class Tem extends React.Component {
  render() {
    let printingPages = [];
    const { listCheck } = this.props;
    listCheck.forEach((detail, index) => {
      const tempTemplate = <PrintTemplate detail={detail} key={index} />;
      printingPages.push(tempTemplate);
    });
    return <div>{printingPages}</div>;
  }
}
