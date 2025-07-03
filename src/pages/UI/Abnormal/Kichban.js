import React, { useState, useRef } from "react";
import {
  Button,
  Table,
  Card,
  Checkbox,
  message,
  Modal,
  Space,
  InputNumber,
  Form,
  Input,
} from "antd";
import "../style.scss";
import {
  getListLsxUseMaterial,
  getListMaterialLog,
  getListScenario,
  updateScenario,
} from "../../../api";
import { useEffect } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const siderStyle = {
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#fff",
  width: "100%",
};
const Kichban = (props) => {
  document.title = "UI - Kịch bản bất thường";
  const [openMdlNhap, setOpenMdlNhap] = useState(false);
  const [openMdlEdit, setOpenMdlEdit] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [listPalletCheck, setListPalletCheck] = useState([]);
  const [listCheck, setListCheck] = useState([]);
  const [valueImport, setValueImport] = useState([]);
  const [valueImportLsx, setValueImportLsx] = useState([]);
  const [titleMdlEdit, setTitleMdlEdit] = useState("Cập nhật");
  const [form] = Form.useForm();
  const setValueInput = (id, value) => {
    const check = valueImport.find((old_value) => old_value.id === id);
    if (check) {
      const new_value = valueImport.map((old_value) => {
        if (old_value.id === id) {
          old_value.sl_thuc_xuat = value;
        }
        return old_value;
      });
      setValueImport(new_value);
    } else {
      setValueImport([...valueImport, { id: id, sl_thuc_xuat: value }]);
    }
  };
  const setValueInputLsx = (id, lo_sx, value) => {
    const check = valueImportLsx.find((old_value) => old_value.lo_sx === lo_sx);
    if (check) {
      const new_value = valueImportLsx.map((old_value) => {
        if (old_value.lo_sx === lo_sx) {
          old_value.sl_pallet = value;
          const arr = [];
          for (var i = 0; i < value; i++) {
            arr.push({ key: i, value: "" });
          }
          old_value.value_pallet = arr;
        }
        return old_value;
      });
      setValueImportLsx(new_value);
    } else {
      const arr = [];
      for (var i = 0; i < value; i++) {
        arr.push({ key: i, value: "" });
      }
      setValueImportLsx([
        ...valueImportLsx,
        { id: id, lo_sx: lo_sx, sl_pallet: value, value_pallet: arr },
      ]);
    }
  };
  const setValueInputDetail = (lo_sx, key, value) => {
    const check = valueImportLsx.find((old_value) => old_value.lo_sx === lo_sx);
    if (check) {
      const new_value = valueImportLsx.map((old_value) => {
        if (old_value.lo_sx === lo_sx) {
          old_value.value_pallet.map((old) => {
            if (old.key === key) {
              old.value = value;
            }
            return old;
          });
        }
        return old_value;
      });
      setValueImportLsx(new_value);
    }
  };

  const columns = [
    {
      title: "Checkbox",
      dataIndex: "name1",
      key: "name1",
      render: (value, item, index) => (
        <Checkbox
          value={item.lot_id ? item.lot_id : item.id}
          onChange={onChangeChecbox}
        ></Checkbox>
      ),
    },
    {
      title: "Hạng mục",
      dataIndex: "hang_muc",
      key: "hang_mucmanvl",
    },
    {
      title: "Tiêu chuẩn",
      dataIndex: "tieu_chuan",
      key: "tieu_chuan",
    },
    {
      title: "Tiêu chuẩn Max",
      dataIndex: "tieu_chuan_max",
      key: "tieu_chuan_max",
    },
    {
      title: "Tiêu chuẩn Min",
      dataIndex: "tieu_chuan_min",
      key: "tieu_chuan_min",
    },
    {
      title: "Tiêu chuẩn kiểm soát trên",
      dataIndex: "tieu_chuan_kiem_soat_tren",
      key: "tieu_chuan_kiem_soat_tren",
    },
    {
      title: "Tiêu chuẩn kiểm soát dưới",
      dataIndex: "tieu_chuan_kiem_soat_duoi",
      key: "tieu_chuan_kiem_soat_duoi",
    },
  ];
  useEffect(() => {
    const new_data = dataTable.filter((datainput) =>
      listPalletCheck.includes(datainput.lot_id)
    );
    setListCheck(new_data);
  }, [listPalletCheck]);
  const onChangeChecbox = (e) => {
    if (e.target.checked) {
      if (!listPalletCheck.includes(e.target.value)) {
        setListPalletCheck((oldArray) => [...oldArray, e.target.value]);
      }
    } else {
      if (listPalletCheck.includes(e.target.value)) {
        setListPalletCheck((oldArray) =>
          oldArray.filter((datainput) => datainput !== e.target.value)
        );
      }
    }
  };
  const loadListTable = async () => {
    const res = await getListScenario();
    setDataTable(res);
  };
  useEffect(() => {
    console.log(listPalletCheck);
  }, [listPalletCheck]);
  useEffect(() => {
    (async () => {
      loadListTable();
    })();
  }, []);
  function isNumeric(value) {
    return /^-?\d+$/.test(value);
  }
  const onFinish = async (values) => {
    const res = await updateScenario(values);
    setOpenMdlEdit(false);
    loadListTable();
  };
  const editRecord = async () => {
    setTitleMdlEdit("Cập nhật");
    if (listPalletCheck.length > 1) {
      message.info("Chỉ chọn 1 bản ghi để chỉnh sửa");
    } else if (listPalletCheck.length == 0) {
      message.info("Chưa chọn bản ghi cần chỉnh sửa");
    } else if (!isNumeric(listPalletCheck[0])) {
      message.info("Mã giấy đã chia pallet");
    } else {
      const result = dataTable.find(
        (record) => record.id === listPalletCheck[0]
      );
      form.setFieldsValue({
        id: listPalletCheck[0],
        tieu_chuan: result.tieu_chuan,
        tieu_chuan_max: result.tieu_chuan_max,
        tieu_chuan_min: result.tieu_chuan_min,
        tieu_chuan_kiem_soat_tren: result.tieu_chuan_kiem_soat_tren,
        tieu_chuan_kiem_soat_duoi: result.tieu_chuan_kiem_soat_duoi,
      });
      setOpenMdlEdit(true);
    }
  };
  return (
    <React.Fragment>
      <Card
        className="mt-3"
        title="Kịch bản bất thường"
        extra={
          <Space>
            <Button type="primary" onClick={editRecord}>
              Cập nhật
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={dataTable}
          bordered
          pagination={false}
        />
      </Card>
      <Modal
        title={titleMdlEdit}
        open={openMdlEdit}
        onCancel={() => setOpenMdlEdit(false)}
        footer={null}
      >
        <Form
          style={{ margin: "0 15px" }}
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item name="id" className="mb-3 d-none">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Tiêu chuẩn" name="tieu_chuan" className="mb-3">
            <Input placeholder="Nhập tiêu chuẩn"></Input>
          </Form.Item>
          <Form.Item
            label="Tiêu chuẩn Max"
            name="tieu_chuan_max"
            className="mb-3"
          >
            <Input placeholder="Nhập tiêu chuẩn Max"></Input>
          </Form.Item>
          <Form.Item
            label="Tiêu chuẩn Min"
            name="tieu_chuan_min"
            className="mb-3"
          >
            <Input placeholder="Nhập tiêu chuẩn Min"></Input>
          </Form.Item>
          <Form.Item
            label="Tiêu chuẩn kiểm soát trên"
            name="tieu_chuan_kiem_soat_tren"
            className="mb-3"
          >
            <Input placeholder="Nhập tiêu chuẩn kiểm soát trên"></Input>
          </Form.Item>
          <Form.Item
            label="Tiêu chuẩn kiểm soát dưới"
            name="tieu_chuan_kiem_soat_duoi"
            className="mb-3"
          >
            <Input placeholder="Nhập tiêu chuẩn kiểm soát dưới"></Input>
          </Form.Item>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit">
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(Kichban);
