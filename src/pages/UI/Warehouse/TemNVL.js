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
                                        value={detail['material_id']}
                                        bordered={false}
                                        size={80}
                                        type="svg"
                                    />
                                    <div className="flex-column">
                                        <h3 style={{ marginLeft: "8px", fontSize: '28px', marginTop: '18px' }}>TEM CUỘN</h3>
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
                            <td className="text-center">MÃ CUỘN TBDX</td>
                            <td>{detail['material_id']}</td>
                        </tr>
                        <tr>
                            <td className="text-center">MÃ VẬT TƯ</td>
                            <td className="text-center"><b>{detail['ma_vat_tu']}</b></td>
                        </tr>
                        <tr>
                            <td className="text-center">NHÀ CUNG CẤP</td>
                            <td >{detail['so_luong']}</td>
                        </tr>
                        <tr>
                            <td className="text-center">MÃ CUỘN NCC:</td>
                            <td >{detail['ma_cuon_ncc']}</td>
                        </tr>
                        <tr>
                            <td className="text-center">fsc</td>
                            <td>{detail['fsc'] ? "X" : ""}</td>
                        </tr>
                        <tr>
                            <td className="text-center">KHỔ GIẤY</td>
                            <td >{detail['kho_giay']}</td>
                        </tr>
                        <tr>
                            <td className="text-center">ĐỊNH LƯỢNG</td>
                            <td >{detail['dinh_luong']}</td>
                        </tr>
                        <tr>
                            <td className="text-center">SỐ KG</td>
                            <td >{detail['so_kg']}</td>
                        </tr>
                        <tr>
                            <td className="text-center">NGÀY NHẬP KHO</td>
                            <td >{detail['updated_at'] ? dayjs(detail['updated_at']).format('DD/MM/YYYY HH:mm:ss') : ''}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <PageBreakWrapper>&nbsp;</PageBreakWrapper>
        </div>
    );
};
export default class TemNVL extends React.Component {
    render() {
        let printingPages = [];
        const { listCheck } = this.props;
        // for (const detail of listCheck) {
        listCheck.forEach((detail, index) => {
            const tempTemplate = <PrintTemplate detail={detail} key={index + 1} />;
            printingPages.push(tempTemplate);
        });

        // }
        return <div>{printingPages}</div>;
    }
}
