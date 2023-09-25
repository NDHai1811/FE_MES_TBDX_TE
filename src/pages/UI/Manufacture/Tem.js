import React from "react";
import Barcode from "react-barcode";
import styled from "styled-components";
import './style.css';
import dayjs from "dayjs";
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
                  <QRCode value={detail.lot_id} bordered={false} size={100}/>
                  
                </div>
              </td>
            </tr>
            <tr>
              <td>Tên SP</td>
              <td>{detail.ten_sp}</td>
              <td>Số lượng</td>
              <td style={{textAlign:'center'}}>{detail.soluongtp}</td>
            </tr>
            <tr>
              <td>Ver/His</td>
              <td>{(detail?.his && detail?.ver) && detail?.ver+'/'+detail?.his}</td>
              <td>Lô SX</td>
              <td style={{textAlign:'center'}}>{detail.lsx}</td>
            </tr>
            <tr>
              <td>Công đoạn thực hiện</td>
              <td>{detail.cd_thuc_hien ? detail.cd_thuc_hien : 'Trước bảo ôn'}</td>
              <td>Thời gian SX</td>
              <td>{dayjs().format('DD/MM/YYYY HH:mm:ss')}</td>
            </tr>
            <tr>
              <td>Ngày sản xuất</td>
              <td>{dayjs().format('DD/MM/YYYY')}</td>
              <td>Mã Pallet/thùng</td>
              <td>{detail.lot_id}</td>
            </tr>
            <tr>
              <td>Công đoạn tiếp theo</td>
              <td>{detail.cd_tiep_theo ? detail.cd_tiep_theo : 'OQC'}</td>
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
export default class Tem extends React.Component {
  render() {
    let printingPages = [];
    const { listCheck } = this.props;
    // for (const detail of listCheck) {
      listCheck.forEach((detail, index)=>{
        const tempTemplate = <PrintTemplate detail={detail} key={index}/>;
        printingPages.push(tempTemplate);
      })
      
    // }
    return (
      <div>
        {printingPages}
      </div>
    );
  }
}
