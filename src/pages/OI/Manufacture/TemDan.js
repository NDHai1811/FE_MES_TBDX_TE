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
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={4}>
                                <div className="d-flex justify-content-between" style={{ marginBottom: '15px' }}>
                                    <QRCode
                                        style={{ marginRight: "5px" }}
                                        value={detail.qr_code}
                                        bordered={false}
                                        size={120}
                                        type="svg"
                                    />
                                    <div className="flex-column">
                                        <h3 style={{ marginLeft: "8px", fontSize: '32px', marginTop: '38px' }}>TEM THÀNH PHẨM</h3>
                                        {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                                    </div>
                                    <div className="flex-column">
                                        <img src={logolight} width={110} style={{ marginRight: "10px", marginLeft: '10px', marginTop: '10px' }} />
                                        {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                                    </div>
                                    {/* <Barcode value={detail.lot_id} format="CODE128" height={32} width={1.5} fontSize={16} /> */}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td ><b>Khách hàng</b></td>
                            <td> <span style={{ marginLeft: '10px' }}>{detail.khach_hang}</span></td>
                            <td><b>Số Đ.H:</b></td>
                            <td><span style={{ marginLeft: '10px' }}>{detail.mdh}</span></td>
                        </tr>
                        <tr>
                            <td><b>Quy cách</b></td>
                            <td className="text-center" colSpan={3}><b>{detail.quy_cach}</b></td>
                        </tr>
                        <tr>
                            <td><b>Số lượng</b></td>
                            <td ><span style={{ marginLeft: '10px' }}>{detail.so_luong}</span></td>
                            <td><b>MQL TBDX</b></td>
                            <td ><span style={{ marginLeft: '10px' }}>{detail.mql}</span></td>
                        </tr>
                        <tr>
                            <td><b>Order:</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{detail.order}</span></td>
                        </tr>
                        <tr>
                            <td><b>GMO</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{detail.gmo}</span></td>
                        </tr>
                        <tr>
                            <td><b>PO</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{detail.po}</span></td>
                        </tr>
                        <tr>
                            <td><b>Style</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{detail.style}</span></td>
                        </tr>
                        <tr>
                            <td><b>Style No</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{detail.style_no}</span></td>
                        </tr>
                        <tr>
                            <td><b>Color</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{detail.color}</span></td>
                        </tr>
                        <tr>
                            <td><b>Ngày SX</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{dayjs().format('DD/MM/YYYY')}</span></td>
                        </tr>
                        <tr>
                            <td><b>N.Viên S.X</b></td>
                            <td><span style={{ marginLeft: '10px' }}>{detail.nhan_vien_sx}</span></td>
                            <td ><b>Máy:</b></td>
                            <td><span style={{ marginLeft: '10px' }}>{detail.machine_id}</span></td>
                        </tr>
                        <tr>
                            <td><b>Nơi giao</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{detail.xuong_giao}</span></td>
                        </tr>
                        <tr>
                            <td><b>Ghi chú</b></td>
                            <td colSpan={3}><span style={{ marginLeft: '10px' }}>{detail.note}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <PageBreakWrapper>&nbsp;</PageBreakWrapper>
        </div>
    );
};
export default class TemIn extends React.Component {
    render() {
        let printingPages = [];
        const { listCheck } = this.props;
        // for (const detail of listCheck) {
        const listTem = [];
        listCheck.forEach((detail, index) => {
            if (detail.sl_tem && detail.sl_tem > 0) {
                for (let i = 0; i < detail.sl_tem; i++) {
                    listTem.push(detail);
                }
            } else {
                listTem.push(detail);
            }
        });
        listTem.forEach((detail, index) => {
            const tempTemplate = <PrintTemplate detail={detail} key={index} />;
            printingPages.push(tempTemplate);
        });
        return <div>{printingPages}</div>;
    }
}
