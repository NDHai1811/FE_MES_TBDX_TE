import React from "react";
import Barcode from "react-barcode";
import styled from "styled-components";
import './tem.css';
import dayjs from "dayjs";
import { useProfile } from '../../../components/hooks/UserHooks';
import { QRCode } from "antd";

const PageBreakWrapper = styled.div`
  && {
    page-break-after: always;
  }
`;

const PrintTemplate = ({ detail }) => {
  const { userProfile } = useProfile();
  return (
    <div>
      <div className="print-only">
        <table style={{ backgroundColor: 'yellow' }}>
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
                <div className="d-flex justify-content-between mt-0 mb-0">
                  <div className="flex-column">
                    <h5 style={{ marginLeft: '8px' }}>NO:</h5>
                    <h6 style={{ marginLeft: '8px' }}>{detail.lot_id}</h6>
                  </div>
                  
                  {/* <Barcode value={detail.lot_id} format="CODE128" height={32} width={1.5} fontSize={16} /> */}
                  <QRCode style={{marginRight:'12px'}} value={detail.lot_id} bordered={false} size={100} type="svg"/>
                  
                </div>
              </td>
            </tr>
            <tr>
              <td>Tên SP</td>
              <td>{detail.ten_sp}</td>
              <td>Số lượng</td>
              <td style={{textAlign:'center'}}>{detail.sl_tem_vang}</td>
            </tr>
            <tr>
              <td>Ver/His</td>
              <td>{(detail.his && detail.ver) && detail.ver + '/' + detail.his}</td>
              <td>Lô SX</td>
              <td style={{textAlign:'center'}}>{detail.lsx}</td>
            </tr>
            <tr>
              <td>Công đoạn thực hiện</td>
              <td>{detail.cd_thuc_hien ? detail.cd_thuc_hien : 'Trước bảo ôn'}</td>
              <td>Thời gian SX</td>
              <td>{dayjs().format('DD/MM/YYYY')} <br/> {dayjs().format('HH:mm:ss')}</td>
            </tr>
            <tr>
              <td>Ngày sản xuất</td>
              <td>{dayjs().format('DD/MM/YYYY')}</td>
              <td>Mã Pallet/thùng</td>
              <td>{detail.lot_id}</td>
            </tr>
            <tr>
              <td rowSpan={2}>Công đoạn tiếp theo</td>
              <td rowSpan={2}>{detail.cd_tiep_theo ? detail.cd_tiep_theo : 'Chọn'}</td>
              <td>Người sản xuất</td>
              <td>{detail.nguoi_sx ? detail.nguoi_sx : ''}</td>
            </tr>
            <tr>
              <td>QC kiểm tra</td>
              <td>{detail.nguoi_qc ? detail.nguoi_qc : ''}</td>
            </tr>
            <tr>
              <td colSpan={4}>
                Tình trạng lỗi: {detail.ghi_chu}
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                Phương án xử lý: Công đoạn sau kiểm tra 100% loại bỏ lỗi
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                Ghi chú:
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
