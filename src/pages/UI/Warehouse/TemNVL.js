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
                            <td colSpan={3}>
                                <div className="d-flex justify-content-center">
                                    <QRCode
                                        value={detail['material_id']}
                                        bordered={false}
                                        size={180}
                                        type="svg"
                                    />
                                </div>
                            </td>
                            <td colSpan={2}>
                                <div className="text-center">
                                    <img src={logolight} width={120} style={{ marginRight: "10px", marginLeft: '10px', marginTop: '10px' }} />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={5} style={{height: 180}}>
                                <h3 style={{ marginLeft: "8px", fontSize: '90px', marginTop: '0', textAlign: 'center', fontWeight: 'bold' }}>
                                    {detail['material_id']}
                                </h3>
                            </td>
                        </tr>
                        <tr style={{ height: 55 }}>
                            <td className="text-center" colSpan={2}>LOẠI GIẤY</td>
                            <td className="text-center" colSpan={3}>{detail['loai_giay']}</td>
                        </tr>
                        <tr style={{ height: 55 }}>
                            <td className="text-center" colSpan={2}>KHỔ GIẤY</td>
                            <td className="text-center" colSpan={3}>{detail['kho_giay']}</td>
                        </tr>
                        <tr style={{ height: 55 }}>
                            <td className="text-center" colSpan={2}>ĐỊNH LƯỢNG</td>
                            <td className="text-center" colSpan={3}>{detail['dinh_luong']}</td>
                        </tr>
                        <tr style={{ height: 55 }}>
                            <td className="text-center" colSpan={2}>SỐ KG</td>
                            <td className="text-center" colSpan={3}>{detail['so_kg']}</td>
                        </tr>
                        <tr style={{ height: 55 }}>
                            <td className="text-center" colSpan={2}>MÃ CUỘN NCC:</td>
                            <td className="text-center" colSpan={3}>{detail['ma_cuon_ncc']}</td>
                        </tr>
                        {/* <tr style={{ height: 55 }}>
                            <td className="text-center" colSpan={2}>NGÀY NHẬP KHO</td>
                            <td className="text-center" colSpan={3}>{detail['updated_at'] ? dayjs(detail['updated_at']).format('DD/MM/YYYY HH:mm:ss') : ''}</td>
                        </tr> */}
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
