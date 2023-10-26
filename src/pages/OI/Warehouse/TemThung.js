import React from "react";
import Barcode from "react-barcode";
import styled from "styled-components";
import './style.css';
import { QRCode, Space } from "antd";

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
              <th style={{ width: "30%" }}></th>
              <th style={{ width: "20%" }}></th>
              <th style={{ width: "30%" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4}>
                <div className="d-flex justify-content-between">
                  <div className="flex-column">
                    <h5 style={{ marginLeft: '8px' }}>NO:</h5>
                    <h5 style={{ marginLeft: '8px' }}>{detail.lot_id}</h5>
                  </div>

                  {/* <Barcode value={detail.lot_id} format="CODE128" height={32} width={1.5} fontSize={16} /> */}
                  <QRCode style={{marginRight:'12px'}} value={detail.lot_id} bordered={false} size={100} type="svg" />

                </div>
              </td>
            </tr>
            <tr>
              <td>Mã SP</td>
              <td>{detail.product_id}</td>
              <td>Số lượng</td>
              <td>{detail.so_luong}</td>
            </tr>
            <tr>
              <td>Ver/His</td>
              <td>{(detail?.his && detail?.ver) && detail?.ver + '/' + detail?.his}</td>
              <td>Lô SX</td>
              <td>{detail.lo_sx}</td>
            </tr>
            <tr>
              <td>Công đoạn thực hiện</td>
              <td>{detail.cd_thuc_hien ? detail.cd_thuc_hien : 'Kho'}</td>
              <td>Thời gian SX</td>
              <td>{detail.tg_sx}</td>
            </tr>
            <tr>
              <td>Ngày sản xuất</td>
              <td>{detail.ngay_sx}</td>
              <td>Mã Pallet/thùng</td>
              <td>{detail.lot_id}</td>
            </tr>
            <tr>
              <td>Công đoạn tiếp theo</td>
              <td>{detail.cd_tiep_theo ? detail.cd_tiep_theo : 'Kho'}</td>
              <td>Người sản xuất</td>
              <td>{detail.nguoi_sx ? detail.nguoi_sx : ''}</td>
            </tr>
            <tr>
              <td colSpan={4}>
                Ghi chú
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PageBreakWrapper>&nbsp;</PageBreakWrapper>
    </div>
  );
};
export default class TemThung extends React.Component {
  render() {
    let printingPages = [];
    const { listCheck } = this.props;
    for (const detail of listCheck) {
      const tempTemplate = <PrintTemplate detail={detail} />;
      printingPages.push(tempTemplate);
    }
    return (
      <div>
        {printingPages}
      </div>
    );
  }
}
