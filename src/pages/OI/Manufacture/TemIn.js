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
                                <div className="d-flex justify-content-between">
                                    <QRCode
                                        style={{ marginRight: "5px" }}
                                        value={detail.lot_id}
                                        bordered={false}
                                        size={80}
                                        type="svg"
                                    />
                                    <div className="flex-column">
                                        <h3 style={{ marginLeft: "8px", fontSize: '28px', marginTop: '18px' }}>TEM TỔ IN</h3>
                                        {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                                    </div>
                                    <div className="flex-column">
                                        <img src={logolight} width={70} style={{ marginRight: "10px", marginLeft: '10px', marginTop: '10px' }} />
                                        {/* <h5 style={{ marginLeft: "8px" }}>{detail.lot_id}</h5> */}
                                    </div>
                                    {/* <Barcode value={detail.lot_id} format="CODE128" height={32} width={1.5} fontSize={16} /> */}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">Khách hàng</td>
                            <td>{detail.khach_hang}</td>
                            <td className="text-center">Số Đ.H:</td>
                            <td>{detail.order_id}</td>
                        </tr>
                        <tr>
                            <td className="text-center"><b>Quy cách</b></td>
                            <td className="text-center" colSpan={3}><b>{detail.quy_cach}</b></td>
                        </tr>
                        <tr>
                            <td className="text-center">Số lượng</td>
                            <td >{detail.so_luong}</td>
                            <td className="text-center">MQL TBDX</td>
                            <td >{detail.mql}</td>
                        </tr>
                        <tr>
                            <td className="text-center">Order:</td>
                            <td colSpan={3}>{detail.order}</td>
                        </tr>
                        <tr>
                            <td className="text-center">GMO</td>
                            <td colSpan={3}>{detail.gmo}</td>
                        </tr>
                        <tr>
                            <td className="text-center">PO</td>
                            <td colSpan={3}>{detail.po}</td>
                        </tr>
                        <tr>
                            <td className="text-center">Style</td>
                            <td colSpan={3}>{detail.style}</td>
                        </tr>
                        <tr>
                            <td className="text-center">Style No</td>
                            <td colSpan={3}>{detail.style_no}</td>
                        </tr>
                        <tr>
                            <td className="text-center">Color</td>
                            <td colSpan={3}>{detail.color}</td>
                        </tr>
                        <tr>
                            <td className="text-center">Ngày SX</td>
                            <td colSpan={3}>{detail.ngay_sx}</td>
                        </tr>
                        <tr>
                            <td className="text-center">N.Viên S.X</td>
                            <td>{detail.nhan_vien_sx}</td>
                            <td className="text-center">Máy in:</td>
                            <td>{detail.machine_id}</td>
                        </tr>
                        <tr>
                            <td className="text-center">Ghi chú</td>
                            <td colSpan={3}></td>
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
        listCheck.forEach((detail, index) => {
            const tempTemplate = <PrintTemplate detail={detail} key={index} />;
            printingPages.push(tempTemplate);
        });

        // }
        return <div>{printingPages}</div>;
    }
}
