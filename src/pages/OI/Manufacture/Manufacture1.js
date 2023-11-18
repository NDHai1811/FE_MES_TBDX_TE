import React, { useEffect, useState, useRef } from "react";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Row, Col, Button, Table, Spin, Checkbox, DatePicker } from "antd";

import DataDetail from "../../../components/DataDetail";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import SelectButton from "../../../components/Button/SelectButton";
import {
  getInfoPallet,
  inTem,
  scanPallet,
  getOverAll,
} from "../../../api/oi/manufacture";
import { useReactToPrint } from "react-to-print";
import Tem from "../../UI/Manufacture/Tem";
import { getMachines } from "../../../api/oi/equipment";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";

const Manufacture1 = (props) => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();
  const history = useHistory();

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLot, setSelectedLot] = useState();
  const [listCheck, setListCheck] = useState([]);
  const [row1, setRow1] = useState([
    {
      title: "KH ca",
      value: 0,
    },
    {
      title: "Sản lượng ca",
      value: 0,
    },
    {
      title: "% KH ca",
      value: 0,
    },
    {
      title: "Tổng Phế",
      value: 0,
      bg: "#fb4b50",
    },
  ]);
  const [row2, setRow2] = useState([
    {
      title: "Mã lot",
      value: "-",
    },
    {
      title: "S.L thực",
      value: "-",
    },
    {
      title: "Phế SX",
      value: "-",
    },
    {
      title: "Số lg 1 MQL",
      value: "-",
    },
    {
      title: "Số m còn lại",
      value: "-",
    },
    {
      title: "T/g hoàn thành",
      value: "-",
    },
  ]);


  useEffect(() => {
    getOverAllDetail();
  }, [machine_id]);

  useEffect(() => {
    getMachineList();
  }, []);

  const getOverAllDetail = () => {
    setLoading(true);
    getOverAll({ machine_id })
      .then((res) => {
        const { kh_ca, so_luong, ht_kh_ca, phe_sx } = res.data?.[0] || {};
        setRow1([
          {
            title: "KH ca",
            value: kh_ca || 0,
          },
          {
            title: "Sản lượng ca",
            value: so_luong || 0,
          },
          {
            title: "% KH ca",
            value: ht_kh_ca || 0,
          },
          {
            title: "Tổng Phế",
            value: phe_sx || 0,
            bg: "#fb4b50",
          },
        ]);
      })
      .catch((err) => {
        console.error("Get over all error: ", err);
      })
      .finally(() => setLoading(false));
  };

  const getMachineList = () => {
    getMachines()
      .then((res) => {
        setOptions(res.data);
        history.push("/manufacture/" + res.data?.[0]?.value);
      })
      .catch((err) => console.log("Get machines error: ", err));
  };

  const onChangeLine = (value) => {
    history.push("/manufacture/" + value);
  };

  const onScan = async (result) => {
    var res = await scanPallet({ lot_id: result, line_id: machine_id });
    if (res.success) {
      if (row2[0].value !== "") {
        setRow2([
          {
            title: "Mã lot",
            value: "",
          },
          {
            title: "Tên sản phẩm",
            value: "",
          },
          {
            title: "UPH (Ấn định)",
            value: "",
          },
          {
            title: "UPH (Thực tế)",
            value: "",
          },
          {
            title: "SL đầu ra (KH)",
            value: "",
          },
          {
            title: "SL đầu ra (TT)",
            value: "",
          },
          {
            title: "SL đầu ra (TT OK)",
            value: "",
          },
        ]);
      }
      const infoPallet = await getInfoPallet({ line_id: machine_id });
      if (infoPallet.success) {
        // setData(infoPallet.data);
      }
    }
  };

  const rowClassName = (record, index) => {
    if (index === 0) {
      return "table-row-green";
    }
    if (index === 1 || index === 2) {
      return "";
    }
    return record.status === 0 ? "table-row-green" : "table-row-grey";
  };

  const onClickRow = (row) => {
    setSelectedLot(row);
  };

  useEffect(() => {
    if (selectedLot) {
      setRow2([
        {
          title: "Số Lot",
          value: selectedLot.lot_id,
        },
        {
          title: "KH ĐH",
          value: selectedLot.ten_sp,
        },
        {
          title: "Sản lượng",
          value: selectedLot.uph_an_dinh,
        },
        {
          title: "HT ĐH",
          value: selectedLot.uph_thuc_te,
        },
        {
          title: "Phế SX",
          value: selectedLot.sl_dau_ra_kh,
        },
      ]);
    } else {
      // setRow2([
      //     {
      //         title: 'Mã Palet',
      //         value: ''
      //     },
      //     {
      //         title: 'Tên sản phẩm',
      //         value: ''
      //     },
      //     {
      //         title: 'UPH (Ấn định)',
      //         value: ''
      //     },
      //     {
      //         title: 'UPH (Thực tế)',
      //         value: ''
      //     },
      //     {
      //         title: 'SL đầu ra (KH)',
      //         value: ''
      //     },
      //     {
      //         title: 'SL đầu ra (TT)',
      //         value: ''
      //     },
      //     {
      //         title: 'SL đầu ra (TT OK)',
      //         value: ''
      //     },
      // ]);
      setListCheck([]);
    }
  }, [selectedLot]);
  const columns = [
    {
      title: "Lô SX",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: "15%",
      render: (value, record, index) => <Checkbox></Checkbox>,
    },
    {
      title: "Mã Lot",
      dataIndex: "lot_id",
      key: "lot_id",
      align: "center",
      width: "14%",
    },
    {
      title: "Sl/Lot",
      dataIndex: "dinh_muc",
      key: "dinh_muc",
      align: "center",
      width: "14%",
    },
    {
      title: "Quy cách",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
      width: "14%",
    },
    {
      title: "Sản lượng",
      dataIndex: "sl_ok",
      key: "sl_ok",
      align: "center",
      width: "14%",
    },
    {
      title: "S.L sau QC",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
      width: "14%",
    },
    {
      title: "Phế QC",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
      width: "14%",
    },
    {
      title: "Phế SX",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
      width: "14%",
    },
  ];
  const componentRef1 = useRef();
  const handlePrint = async () => {
    if (selectedLot) {
      var res = await inTem({
        lot_id: selectedLot.lot_id,
        line_id: machine_id,
      });
      if (res.success) {
        let list = [];
        const data = Array.isArray(res.data) ? res.data : [res.data];
        data.forEach((lot) => {
          const newItems = lot.lot_id.map((e, index) => ({
            ...selectedLot,
            lot_id: e,
            soluongtp: lot.so_luong[index],
            product_id: selectedLot.ma_hang,
            lsx: selectedLot.lo_sx,
            cd_thuc_hien: options.find((e) => e.value === parseInt(machine_id))
              ?.label,
            cd_tiep_theo:
              machine_id === "22"
                ? "Bế"
                : options[
                    options.findIndex((e) => e.value === parseInt(machine_id)) +
                      1
                  ]?.label,
          }));
          list = [...list, ...newItems];
        });
        setListCheck(list);
      }
    }
  };

  const print = useReactToPrint({
    content: () => componentRef1.current,
  });
  useEffect(() => {
    if (listCheck.length > 0) {
      print();
    }
  }, [listCheck]);
  var interval;
  // useEffect(() => {
  //     interval = setInterval(async () => {
  //         const infoPallet = await getInfoPallet({ line_id: machine_id });
  //         if (infoPallet.success) {
  //             // setData(infoPallet.data.map(e => {
  //             //     return { ...e }
  //             // }))
  //         }
  //     }, 10000);
  //     return () => clearInterval(interval);
  // }, [machine_id]);
  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Row className="mt-3" gutter={[2, 12]}>
          <Col span={5}>
            <SelectButton
              options={options}
              label="Công đoạn"
              value={machine_id}
              onChange={onChangeLine}
            />
          </Col>
          <Col span={19}>
            <DataDetail data={row1} />
          </Col>
          <Col span={24}>
            <DataDetail data={row2} />
          </Col>
          <Row
            className="mt-1"
            gutter={20}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Col span={9}>
              <DatePicker
                placeholder="Từ ngày"
                style={{ width: "100%" }}
                format={COMMON_DATE_FORMAT}
              />
            </Col>
            <Col span={9}>
              <DatePicker
                placeholder="Đến ngày"
                style={{ width: "100%" }}
                format={COMMON_DATE_FORMAT}
              />
            </Col>
            <Col span={3}>
              <Button
                size="medium"
                type="primary"
                style={{ width: "100%" }}
                icon={<QrcodeOutlined />}
              />
            </Col>
            <Col span={3}>
              <Button
                size="medium"
                type="primary"
                style={{ width: "100%" }}
                onClick={handlePrint}
                icon={<PrinterOutlined />}
              />
              <div className="report-history-invoice">
                <Tem listCheck={listCheck} ref={componentRef1} />
              </div>
            </Col>
          </Row>
          <Col span={24}>
            <Table
              scroll={{
                x: window.screen.width,
              }}
              size="small"
              rowClassName={rowClassName}
              pagination={false}
              bordered
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => onClickRow(record),
                };
              }}
              columns={columns}
              dataSource={data}
            />
          </Col>
        </Row>
      </Spin>
    </React.Fragment>
  );
};

export default Manufacture1;
