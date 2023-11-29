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
                <div className="d-flex justify-content-between">
                  <QRCode
                      style={{ marginRight: "5px" }}
                      value={detail.lot_id}
                      bordered={false}
                      size={80}
                      type="svg"
                    />
                  <div className="flex-column">
                    <h3 style={{ marginLeft: "8px",fontSize:'28px',marginTop:'18px' }}>TEM TỔ DỢN SÓNG</h3>
                    {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                  </div>
                  <div className="flex-column">
                    <img src={logolight} width={70} style={{ marginRight: "10px",marginLeft:'10px',marginTop:'10px' }}/>
                    {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                  </div>
                  {/* <Barcode value={detail.lot_id} format="CODE128" height={32} width={1.5} fontSize={16} /> */}
                </div>
              </td>
            </tr>
            <tr>
              <td className="text-center" colSpan={2}>Khách hàng</td>
              <td className="text-center" colSpan={2}>Đơn hàng</td>
              <td className="text-center">Lô sx</td>
            </tr>
            <tr>
              <td className="text-center" colSpan={2}><b>{detail.khach_hang}</b></td>
              <td className="text-center" colSpan={2}><b>{detail.ma_don_hang}</b></td>
              <td>{detail.lo_sx}</td>
            </tr>
            <tr>
              <td className="text-center">Dài</td>
              <td className="text-center">Rộng</td>
              <td className="text-center">Cao</td>
              <td className="text-center">Lot</td>
              <td className="text-center">Số lượng:</td>
            </tr>
            <tr>
              <td className="text-center">{detail.dai}</td>
              <td className="text-center">{detail.rong}</td>
              <td className="text-center">{detail.cao}</td>
              <td className="text-center">{detail.lot_id}</td>
              <td className="text-center"><b>{detail.so_luong}</b></td>
            </tr>
            <tr>
              <td className="text-center">Khổ</td>
              <td className="text-center">Dài</td>
              <td className="text-center">Số dao</td>
              <td className="text-center">Xả</td>
              <td className="text-center">Số lớp</td>
            </tr>
            <tr>
              <td className="text-center">{detail.kho}</td>
              <td className="text-center">{detail.dai}</td>
              <td className="text-center">{detail.so_dao}</td>
              <td className="text-center"></td>
              <td className="text-center">{detail.so_lop}</td>
            </tr>
            <tr>
              <td className="text-center" colSpan={4}>Ghi chú sản phẩm</td>
              <td className="text-center">Số pallet</td>
            </tr>
            <tr>
              <td colSpan={4}>Không có</td>
              <td className="text-center"></td>
            </tr>
            <tr>
              <td className="text-center" colSpan={2}>Nhóm máy</td>
              <td className="text-center" colSpan={3}><b>{detail.nhom_may}</b></td>
            </tr>
            <tr>
              <td className="text-center">Ngày sản xuất</td>
              <td className="text-center" colSpan={2}>{detail.ngay_sx}</td>
              <td className="text-center">Ca sản xuất</td>
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
