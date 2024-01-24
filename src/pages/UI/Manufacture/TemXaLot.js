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
                                        value={detail.qr_code}
                                        bordered={false}
                                        size={120}
                                        type="svg"
                                    />
                                    <div className="flex-column">
                                        <h3 style={{ marginLeft: "8px", fontSize: '38px', marginTop: '38px' }}>TEM XẢ LÓT</h3>
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
                            <td colSpan={2} className="text-center" style={{ fontSize: '14px' }}>KHÁCH HÀNG</td>
                            <td colSpan={2} className="text-center" style={{ fontSize: '14px' }}>ĐƠN HÀNG</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>STT</td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="text-center">{detail.khach_hang}</td>
                            <td colSpan={2} className="text-center">{detail.mdh}</td>
                            <td className="text-center">{detail.thu_tu_uu_tien}</td>
                        </tr>
                        <tr>
                            <td className="text-center" style={{ fontSize: '14px' }}>DAI</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>RONG</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>CAO</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>LOT</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>SỐ LƯỢNG</td>
                        </tr>
                        <tr>
                            <td className="text-center">{detail.dai}</td>
                            <td className="text-center">{detail.rong}</td>
                            <td className="text-center">{detail.cao}</td>
                            <td className="text-center">LOT</td>
                            <td className="text-center">{detail.sl_kh}</td>
                        </tr>
                        <tr>
                            <td className="text-center" style={{ fontSize: '14px' }}>KHỔ</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>DÀI</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>SỐ DAO</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>XẢ</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>SỐ LỚP</td>
                        </tr>
                        <tr>
                            <td className="text-center">{detail.kho}</td>
                            <td className="text-center">{detail.dai_tam}</td>
                            <td className="text-center">{detail.so_dao}</td>
                            <td className="text-center">{detail.so_ra}</td>
                            <td className="text-center">{detail.so_lop}</td>
                        </tr>
                        <tr>
                            <td colSpan={4} style={{ fontSize: '14px', paddingLeft: '10px' }}>GHI CHÚ SẢN PHẨM</td>
                            <td className="text-center" style={{ fontSize: '14px' }}>SỐ PALLET</td>
                        </tr>
                        <tr>
                            <td colSpan={4} style={{ paddingLeft: '15px' }}>{detail.note_3}</td>
                            <td ></td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ fontSize: '14px', paddingLeft: '10px' }}>NHÓM MÁY</td>
                            <td colSpan={3} style={{ paddingLeft: '10px' }}>GT</td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: '14px', paddingLeft: '10px' }}>NGÀY SX</td>
                            <td colSpan={2} style={{ paddingLeft: '10px' }}>{detail.thoi_gian_bat_dau}</td>
                            <td style={{ fontSize: '14px', paddingLeft: '10px' }}>CA SX</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <PageBreakWrapper>&nbsp;</PageBreakWrapper>
        </div>
    );
};
export default class TemXaLot extends React.Component {
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
