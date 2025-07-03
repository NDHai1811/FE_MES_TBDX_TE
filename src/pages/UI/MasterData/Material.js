import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Tag,
  Layout,
  Divider,
  Button,
  Form,
  Input,
  theme,
  Select,
  AutoComplete,
  Upload,
  message,
  Checkbox,
  Space,
  Modal,
  Spin,
  Popconfirm,
  InputNumber,
  Typography,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createMaterial,
  deleteMaterials,
  exportMaterials,
  getMaterials,
  updateMaterial,
} from "../../../api";
import TemNVL from "../Warehouse/TemNVL";
import { useReactToPrint } from "react-to-print";
import { exportWarehouseTicket } from "../../../api/ui/warehouse";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import { useProfile } from "../../../components/hooks/UserHooks";
import EditableTable from "../../../components/Table/EditableTable";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const Materials = () => {
  document.title = "Quản lý nguyên vật liệu";
  const [listCheck, setListCheck] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [params, setParams] = useState();
  const [loading, setLoading] = useState(false);
  const [openMdlEdit, setOpenMdlEdit] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const onUpdate = async (record) => {
    const res = await updateMaterial(record);
    btn_click(page, pageSize);
  };
  const onCreate = async (record) => {
    var res = await createMaterial(record);
    btn_click();
  };
  const onDelete = async (ids) => {
    var res = await deleteMaterials(ids);
    btn_click(page, pageSize);
  }
  const columns = [
    {
      title: "Mã cuộn TBDX",
      dataIndex: "id",
      key: "id",
      align: "center",
      editable: true,
    },
    {
      title: "Mã vật tư",
      dataIndex: "ma_vat_tu",
      key: "ma_vat_tu",
      align: "center",
      editable: true,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "ten_ncc",
      key: "ten_ncc",
      align: "center",
    },
    {
      title: "Mã cuộn nhà cung cấp",
      dataIndex: "ma_cuon_ncc",
      key: "ma_cuon_ncc",
      align: "center",
      editable: true,
    },
    {
      title: "Số kg",
      dataIndex: "so_kg",
      key: "so_kg",
      align: "center",
      editable: true,
    },
    {
      title: "Loại giấy",
      dataIndex: "loai_giay",
      key: "loai_giay",
      align: "center",
      editable: true,
    },
    {
      title: "Khổ giấy",
      dataIndex: "kho_giay",
      key: "kho_giay",
      align: "center",
      editable: true,
    },
    {
      title: "Định lượng",
      dataIndex: "dinh_luong",
      key: "dinh_luong",
      align: "center",
      editable: true,
    },
    {
      title: "FSC",
      dataIndex: "fsc",
      key: "fsc",
      align: "center",
      editable: true,
      render: (value, item, index) => (value ? "X" : ""),
    },
    {
      title: "Vị trí",
      dataIndex: "locator_id",
      key: "locator_id",
      align: "center",
      editable: true,
    }
  ];

  function btn_click(page = 1, pageSize = 20) {
    setPage(page);
    setPageSize(pageSize)
    loadListTable({ ...params, page, pageSize });
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getMaterials(params);
    setTotalPage(res.totalPage);
    setData(
      res.data.map((e) => {
        return { ...e, key: e.id };
      })
    );
    setListCheck([]);
    setLoading(false);
  };
  useEffect(() => {
    btn_click()
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  const componentRef1 = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef1.current,
  });
  const tableRef = useRef();
  const onInsert = () => {
    tableRef.current.create();
  };
  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };
  
  const { userProfile } = useProfile();
  const header = document.querySelector('.custom-card .ant-table-header');
  const pagination = document.querySelector('.custom-card .ant-pagination');
  const card = document.querySelector('.custom-card .ant-card-body');
  const [tableHeight, setTableHeight] = useState((card?.offsetHeight ?? 0) - 48 - (header?.offsetHeight ?? 0) - (pagination?.offsetHeight ?? 0));
  useEffect(() => {
    const handleWindowResize = () => {
      const header = document.querySelector('.custom-card .ant-table-header');
      const pagination = document.querySelector('.custom-card .ant-pagination');
      const card = document.querySelector('.custom-card .ant-card-body');
      setTableHeight((card?.offsetHeight ?? 0) - 48 - (header?.offsetHeight ?? 0) - (pagination?.offsetHeight ?? 0));
    };
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [data]);
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }} className="custom-card scroll" actions={[
              <Button
                type="primary"
                onClick={() => btn_click()}
                style={{ width: "80%" }}
              >
                Tìm kiếm
              </Button>
            ]}>
              <Divider>Điều kiện truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Form.Item label={"Mã cuộn TBDX"} className="mb-3">
                    <Input
                      placeholder={"Nhập mã cuộn TBDX"}
                      onChange={(e) =>
                        setParams({ ...params, id: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label={"Mã cuộn NCC"} className="mb-3">
                    <Input
                      placeholder={"Nhập mã cuộn NCC"}
                      onChange={(e) =>
                        setParams({ ...params, ma_cuon_ncc: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label={"Loại giấy"} className="mb-3">
                    <Input
                      placeholder={"Nhập loại giấy"}
                      onChange={(e) =>
                        setParams({ ...params, loai_giay: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label={"Vị trí"} className="mb-3">
                    <Input
                      placeholder={"Nhập vị trí"}
                      onChange={(e) =>
                        setParams({ ...params, locator_id: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label={"Phân loại"} className="mb-3">
                    <Select
                      placeholder={"Chọn phân loại"}
                      onChange={(value) =>
                        setParams({ ...params, phan_loai: value })
                      }
                      onSelect={(value) =>
                        setParams({ ...params, phan_loai: value })
                      }
                      allowClear
                      options={[{ value: 0, label: 'Chưa nhập kho' }, { value: 1, label: 'Đã nhập kho' }]}
                    />
                  </Form.Item>
                  <Button hidden htmlType="submit"></Button>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            className="custom-card"
            title="Quản lý nguyên vật liệu"
            extra={
              <Space>
                {/* <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  Xuất phiếu nhập kho
                </Button>
                <Upload
                  showUploadList={false}
                  name="file"
                  action={baseURL + "/api/upload-nhap-kho-nvl"}
                  headers={{
                    authorization: "Bearer " + userProfile.token,
                  }}
                  onChange={(info) => {
                    setExportLoading1(true);
                    if (info.file.status === "error") {
                      error();
                      setExportLoading1(false);
                    } else if (info.file.status === "done") {
                      if (info.file.response.success === true) {
                        loadListTable();
                        success();
                        setExportLoading1(false);
                      } else {
                        loadListTable();
                        message.error(info.file.response.message);
                        setExportLoading1(false);
                      }
                    }
                  }}
                >
                  <Button type="primary" loading={exportLoading1}>
                    Upload excel
                  </Button>
                </Upload>
                <Button type="primary" onClick={onInsert}>
                  Thêm NVL
                </Button> */}
                <Button type="primary" onClick={handlePrint}>
                  In tem NVL
                </Button>
                <Button type="primary" onClick={onInsert}>
                  Thêm
                </Button>
                <Popconfirm
                  title="Xoá bản ghi"
                  description={
                    "Bạn có chắc xoá " + listCheck.length + " bản ghi đã chọn?"
                  }
                  onConfirm={() => onDelete(data.reduce(function (filtered, option, index) {
                    if (listCheck.includes(index)) {
                      var someNewValue = option.id
                      filtered.push(someNewValue);
                    }
                    return filtered;
                  }, []))}
                  okText="Có"
                  cancelText="Không"
                  placement="bottomRight"
                >
                  <Button type="primary" disabled={listCheck.length <= 0}>
                    Xoá
                  </Button>
                </Popconfirm>
                <div className="report-history-invoice">
                  <TemNVL
                    listCheck={data
                      .filter((e, i) => listCheck.includes(i))
                      .map((e) => ({ ...e, material_id: e.id }))}
                    ref={componentRef1}
                  />
                </div>
              </Space>
            }
          >
            <EditableTable
              ref={tableRef}
              loading={loading}
              bordered
              columns={columns}
              dataSource={data}
              setDataSource={setData}
              className="h-100"
              rowSelection={rowSelection}
              size="small"
              pagination={{
                current: page,
                size: "small",
                pageSize: pageSize,
                total: totalPage,
                onChange: (page, pageSize) => {
                  btn_click(page, pageSize);
                },
              }}
              onDelete={(record) => onDelete([record.id])}
              onUpdate={onUpdate}
              onCreate={onCreate}
              scroll={{ y: tableHeight }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withRouter(Materials);
