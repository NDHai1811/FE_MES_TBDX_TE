import React, { useState, useRef, useEffect } from "react";
import {
  Layout,
  Divider,
  Button,
  Table,
  Modal,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Upload,
  message,
  Select,
  Col,
  Row,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import "../style.scss";
import { baseURL } from "../../../config";
import {
  createWareHouseExport,
  deleteWareHouseExport,
  getListLot,
  getListWarehouseExportPlan,
  store,
  testUpdateTable,
  updateWareHouseExport,
} from "../../../api";
import EditableTable from "../../../components/Table/EditableTable";
import dayjs from "dayjs";
import {
  getCustomers,
  getDataFilterUI,
  getProducts,
} from "../../../api/ui/main";
const { RangePicker } = DatePicker;

const { Sider } = Layout;
const WarehouseExportPlan = (props) => {
  document.title = "UI - Kế hoạch xuất kho";
  const [data, setData] = useState([]);
  const [listCheck, setListCheck] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listIdProducts, setListIdProducts] = useState([]);
  const [listNameProducts, setListNameProducts] = useState([]);
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });
  const onChangeChecbox = (e) => {
    if (e.target.checked) {
      if (!listCheck.includes(e.target.value)) {
        setListCheck((oldArray) => [...oldArray, e.target.value]);
      }
    } else {
      if (listCheck.includes(e.target.value)) {
        setListCheck((oldArray) =>
          oldArray.filter((datainput) => datainput !== e.target.value)
        );
      }
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     var res = await getDataFilterUI({ khach_hang: params.khach_hang });
  //     if (res.success) {
  //       setListNameProducts(
  //         res.data.product.map((e) => {
  //           return { ...e, label: e.name, value: e.id };
  //         })
  //       );
  //       // setListLoSX(Object.values(res.data.lo_sx).map(e => {
  //       //         return { label: e, value: e }
  //       // }));
  //     }
  //   })();
  // }, [params.khach_hang]);

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteWareHouseExport(listCheck);
      setListCheck([]);
      loadListTable();
    } else {
      message.info("Chưa chọn bản ghi cần xóa");
    }
  };

  const columns = [
    {
      title: "Chọn",
      dataIndex: "name1",
      key: "name1",
      align: "center",
      fixed: "left",
      render: (value, item, index) => (
        <Checkbox
          value={item.id}
          onChange={onChangeChecbox}
          checked={listCheck.includes(item.id) ? true : false}
        ></Checkbox>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      // editable: true,
      fixed: "left",
    },
    {
      title: "Ngày xuất hàng",
      dataIndex: "ngay_xuat_hang",
      key: "ngay_xuat_hang",
      align: "center",
      // editable: true,
      fixed: "left",
    },
    {
      title: "Số lượng nợ đơn hàng",
      align: "center",
      children: [
        {
          title: "Mã hàng",
          dataIndex: "product_id",
          key: "product_id",
          align: "center",
          fixed: "left",
        },
        {
          title: "Tên sản phẩm",
          dataIndex: "ten_san_pham",
          key: "ten_san_pham",
          align: "center",
          fixed: "left",
        },
        {
          title: "PO pending",
          dataIndex: "po_pending",
          key: "po_pendding",
          align: "center",
          fixed: "left",
        },
        {
          title: "SL yêu cầu giao",
          dataIndex: "sl_yeu_cau_giao",
          key: "sl_yeu_cau_giao",
          align: "center",
          fixed: "left",
        },
      ],
      key: "abc",
    },
    {
      title: "ĐVT",
      dataIndex: "dvt",
      key: "dvt",
      align: "center",
    },
    {
      title: "Tổng kg",
      dataIndex: "tong_kg",
      key: "tong_kg",
      align: "center",
    },
    {
      title: "Quy cách đóng thùng/bó",
      dataIndex: "quy_cach",
      key: "quy_cach",
      align: "center",
    },
    {
      title: "SL thùng chẵn",
      dataIndex: "sl_thung_chan",
      key: "sl_thung_chan",
      align: "center",
    },
    {
      title: "Số lượng hàng lẻ",
      dataIndex: "sl_hang_le",
      key: "sl_hang_le",
      align: "center",
    },
    {
      title: "Tồn kho",
      dataIndex: "ton_kho",
      key: "ton_kho",
      align: "center",
    },
    {
      title: "Xác nhận SX",
      dataIndex: "xac_nhan_sx",
      key: "xac_nhan_sx",
      align: "center",
    },
    {
      title: "SL thực xuất",
      dataIndex: "sl_thuc_xuat",
      key: "sl_thuc_xuat",
      align: "center",
    },
    // {
    //     title: 'SL chênh lệch',
    //     dataIndex: 'sl_chenh_lech',
    //     key: 'sl_chenh_lech',
    // },
    {
      title: "Cửa xuất hàng",
      dataIndex: "cua_xuat_hang",
      key: "cua_xuat_hang",
      align: "center",
      // editable: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "dia_chi",
      key: "dia_chi",
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      align: "center",
    },
  ];
  const mergedKey = "khach_hang";
  const mergeColumn = ["khach_hang", "cua_xuat_hang", "dia_chi", "ghi_chu"];
  const mergeValue = mergeColumn.map((e) => {
    return { key: e, set: new Set() };
  });
  // useEffect(() => {
  //   (async () => {
  //     var res1 = await getCustomers();
  //     setListCustomers(
  //       res1.data.map((e) => {
  //         return { ...e, label: e.name, value: e.id };
  //       })
  //     );
  //   })();
  // }, []);
  const isEditing = (col, record) => {
    return col.editable === true && listCheck.includes(record.id);
  };
  const customColumns = columns.map((e) => {
    if (mergeColumn.includes(e.key)) {
      console.log(e);
      return {
        ...e,
        onCell: (record) => {
          const props = {
            record,
            ...e,
            editable: isEditing(e, record),
            handleSave,
          };
          const set = mergeValue.find((s) => s.key === e.key)?.set;
          if (set?.has(record[mergedKey])) {
            return { rowSpan: 0, ...props };
          } else {
            const rowCount = data.filter(
              (data) => data[mergedKey] === record[mergedKey]
            ).length;
            set?.add(record[mergedKey]);
            return { rowSpan: rowCount, ...props };
          }
        },
      };
    } else {
      return {
        ...e,
        onCell: (record) => {
          const props = {
            record,
            ...e,
            editable: isEditing(e, record),
            handleSave,
          };
          return props;
        },
      };
    }
  });
  const handleSave = async (row) => {
    setData((prev) =>
      prev.map((e) => {
        if (e.id === row.id) {
          return row;
        } else {
          return e;
        }
      })
    );
  };
  const loadListTable = async () => {
    const res = await getListWarehouseExportPlan(params);
    setData(
      res.sort((a, b) => {
        if (a[mergedKey] < b[mergedKey]) {
          return -1;
        }
        if (a[mergedKey] > b[mergedKey]) {
          return 1;
        }
        return 0;
      })
    );
  };
  useEffect(() => {
    (async () => {
      loadListTable();
    })();
  }, []);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Upload file thành công",
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Upload file lỗi",
    });
  };

  const btn_click = () => {
    loadListTable();
  };

  const [titleMdlEdit, setTitleMdlEdit] = useState("Cập nhật");
  const onEdit = () => {
    if (listCheck.length > 1) {
      message.info("Chỉ chọn 1 bản ghi để chỉnh sửa");
    } else if (listCheck.length == 0) {
      message.info("Chưa chọn bản ghi cần chỉnh sửa");
    } else {
      const result = data.find((record) => record.id === listCheck[0]);
      form.setFieldsValue(result);
      setOpenMdlEdit(true);
      setTitleMdlEdit("Cập nhật");
    }
  };
  const onInsert = () => {
    setTitleMdlEdit("Thêm mới");
    form.resetFields();
    setOpenMdlEdit(true);
  };
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    if (values.id) {
      const res = await updateWareHouseExport(values);
    } else {
      const res = await createWareHouseExport(values);
    }
    setOpenMdlEdit(false);
    loadListTable();
  };
  const [openMdlEdit, setOpenMdlEdit] = useState(false);
  return (
    <React.Fragment>
      {contextHolder}
      <Sider
        style={{
          backgroundColor: "white",
          height: "100vh",
          overflow: "auto",
          float: "left",
          paddingTop: "15px",
        }}
      >
        <Divider>Thời gian truy vấn</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} /> */}
            <Space direction="vertical" style={{ width: "100%" }}>
              <DatePicker
                allowClear={false}
                placeholder="Bắt đầu"
                style={{ width: "100%" }}
                onChange={(value) =>
                  setParams({ ...params, date: [value, params.date[1]] })
                }
                value={params.date[0]}
              />
              <DatePicker
                allowClear={false}
                placeholder="Kết thúc"
                style={{ width: "100%" }}
                onChange={(value) =>
                  setParams({ ...params, date: [params.date[0], value] })
                }
                value={params.date[1]}
              />
            </Space>
          </Form>
        </div>
        <Divider>Điều kiện truy vấn</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <Form.Item label="Khách hàng" className="mb-3">
              <Select
                allowClear
                showSearch
                placeholder="Chọn khách hàng"
                onChange={(value) =>
                  setParams({ ...params, khach_hang: value })
                }
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={listCustomers}
              />
            </Form.Item>
            <Form.Item label="Tên sản phẩm" className="mb-3">
              <Select
                allowClear
                showSearch
                onChange={(value) => {
                  setParams({ ...params, ten_sp: value });
                }}
                placeholder="Nhập tên sản phẩm"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={listNameProducts}
              />
            </Form.Item>
            {/* <Form.Item label="Lô Sản xuất" className='mb-3'>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Nhập lô sản xuất"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value)=>{
                                    setParams({...params, lo_sx: value})
                                }}
                                options={listLoSX}
                                />
                        </Form.Item> */}
          </Form>
        </div>
        <div
          style={{
            padding: "10px",
            textAlign: "center",
          }}
          layout="vertical"
        >
          <Button type="primary" onClick={btn_click} style={{ width: "80%" }}>
            Truy vấn
          </Button>
        </div>
      </Sider>
      <Row style={{ padding: "8px", height: "100vh" }} gutter={[8, 8]}>
        <Card
          title="UI kế hoạch xuất kho"
          extra={
            <Space>
              <Upload
                showUploadList={false}
                name="file"
                action={baseURL + "/api/upload-ke-hoach-xuat-kho"}
                headers={{
                  authorization: "authorization-text",
                }}
                onChange={(info) => {
                  setLoading(true);
                  if (info.file.status === "error") {
                    error();
                    setLoading(false);
                  } else if (info.file.status === "done") {
                    if (info.file.response.success === true) {
                      loadListTable();
                      success();
                      setLoading(false);
                    } else {
                      loadListTable();
                      message.error(info.file.response.message);
                      setLoading(false);
                    }
                  }
                }}
              >
                <Button type="primary" loading={loading}>
                  Upload excel
                </Button>
              </Upload>
              <Button type="primary" onClick={deleteRecord}>
                Delete
              </Button>
              <Button type="primary" onClick={onEdit}>
                Edit
              </Button>
              <Button type="primary" onClick={onInsert}>
                Insert
              </Button>
            </Space>
          }
          style={{ width: "100%" }}
        >
          <EditableTable
            bordered
            columns={customColumns}
            dataSource={data}
            scroll={{
              x: "130vw",
              y: "55vh",
            }}
            pagination={false}
            size="small"
            setDataSource={setData}
            onEditEnd={() => null}
          />
          {/* <Table bordered columns={columns} dataSource={data} pagination={false} size='small'
                        scroll={
                            {
                                x: '150vw',
                                y: '55vh',
                            }
                        } /> */}
        </Card>
      </Row>
      <Modal
        title={titleMdlEdit}
        open={openMdlEdit}
        onCancel={() => setOpenMdlEdit(false)}
        footer={null}
        width={800}
      >
        <Form
          style={{ margin: "0 15px" }}
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col span={12} className="d-none">
              <Form.Item name="id" className="mb-3 d-none">
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Khách hàng"
                name="khach_hang"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập khách hàng"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày xuất hàng(YYYY-MM-DD HH:mm:ss)"
                name="ngay_xuat_hang"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập ngày xuất hàng"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mã hàng"
                name="product_id"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập mã hàng"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="ten_san_pham"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập tên sản phẩm"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="PO pending"
                name="po_pending"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder=""></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng yêu cầu giao"
                name="sl_yeu_cau_giao"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Đơn vị tính"
                name="dvt"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập đơn vị tính"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tổng kg" name="tong_kg" className="mb-3">
                <Input placeholder="Nhập tổng kg"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Quy cách"
                name="quy_cach"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập quy cách"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng thùng chẵn"
                name="sl_thung_chan"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập số lượng thùng chẵn"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng hàng lẻ"
                name="sl_hang_le"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập số lượng hàng lẻ"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tồn kho"
                name="ton_kho"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập tồn kho"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Xác nhận sản xuất"
                name="xac_nhan_sx"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder=""></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng chênh lệch"
                name="sl_chenh_lech"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập số lượng chênh lệch"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng thực xuất"
                name="sl_thuc_xuat"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Số lượng thực xuất"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Cửa xuất hàng"
                name="cua_xuat_hang"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder=""></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Địa chỉ" name="dia_chi" className="mb-3">
                <Input placeholder=""></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ghi chú" name="ghi_chu" className="mb-3">
                <Input placeholder=""></Input>
              </Form.Item>
            </Col>
          </Row>
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

export default WarehouseExportPlan;
