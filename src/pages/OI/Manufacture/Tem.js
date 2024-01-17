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
                    value={detail.lo_sx}
                    bordered={false}
                    size={85}
                    type="svg"
                  />
                  <div className="flex-column">
                    <h3 style={{ fontSize: '20px', marginTop: '18px' }}>TEM DỢN SÓNG</h3>
                    {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                  </div>
                  <div className="flex-column">
                    <img src={logolight} width={85} style={{ marginRight: "5px", marginLeft: '5px', marginTop: '0px' }} />
                    {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                  </div>
                  {/* <Barcode value={detail.lot_id} format="CODE128" height={32} width={1.5} fontSize={16} /> */}
                </div>
              </td>
            </tr>
            <tr>
              <td className="text-center" colSpan={2} style={{ fontSize: '12px' }}>Khách hàng</td>
              <td className="text-center" colSpan={2} style={{ fontSize: '12px' }}>Đơn hàng</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Lô sx</td>
            </tr>
            <tr>
              <td className="text-center" colSpan={2}><b>{detail.khach_hang}</b></td>
              <td className="text-center" colSpan={2}><b>{detail.mdh}</b></td>
              <td>{detail.lo_sx}</td>
            </tr>
            <tr>
              <td className="text-center" style={{ fontSize: '12px' }}>Dài</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Rộng</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Cao</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Lot</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Số lượng:</td>
            </tr>
            <tr>
              <td className="text-center" >{detail.dai}</td>
              <td className="text-center">{detail.rong}</td>
              <td className="text-center">{detail.cao}</td>
              <td className="text-center">{detail.lo_sx}</td>
              <td className="text-center"><b>{detail.san_luong_kh}</b></td>
            </tr>
            <tr>
              <td className="text-center" style={{ fontSize: '12px' }}>Khổ</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Dài</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Số dao</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Xả</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Số lớp</td>
            </tr>
            <tr>
              <td className="text-center">{detail.kho}</td>
              <td className="text-center">{detail.dai_tam}</td>
              <td className="text-center">{detail.so_dao}</td>
              <td className="text-center">{detail.so_ra}</td>
              <td className="text-center">{detail.so_lop}</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ fontSize: '12px' }}>Ghi chú sản phẩm</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Số pallet</td>
            </tr>
            <tr>
              <td colSpan={4}>{detail.note_3}</td>
              <td className="text-center">{detail.lo_sx}</td>
            </tr>
            <tr>
              <td className="text-center" colSpan={2} style={{ fontSize: '12px' }}>Nhóm máy</td>
              <td className="text-center" colSpan={3}><b>{detail.nhom_may}</b></td>
            </tr>
            <tr>
              <td className="text-center" style={{ fontSize: '12px' }}>Ngày SX</td>
              <td className="text-center" colSpan={2}>{detail.thoi_gian_bat_dau}</td>
              <td className="text-center" style={{ fontSize: '12px' }}>Ca SX</td>
              <td>{detail.ca_sx}</td>
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
    // for (const detail of listCheck) {
    listCheck.forEach((detail, index) => {
      const tempTemplate = <PrintTemplate detail={detail} key={index} />;
      printingPages.push(tempTemplate);
    });

    // }
    return <div>{printingPages}</div>;
  }
}
