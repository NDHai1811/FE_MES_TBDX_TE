import {
  Col,
  Row,
  Card,
  Table,
  Divider,
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Spin,
  Typography,
  Popconfirm,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect, useRef } from "react";
import { getListLayout } from "../../../api/ui/manufacture";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { createLayouts, deleteLayouts, updateLayouts } from "../../../api";
import TemLayout from "./TemLayout";
import { useReactToPrint } from "react-to-print";
import "../style.scss";
import { useProfile } from "../../../components/hooks/UserHooks";
import { render } from "@testing-library/react";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          initialValue={record?.[dataIndex]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Layout = () => {
  const componentRef1 = useRef();
  const { userProfile } = useProfile();
  const [listCheck, setListCheck] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [type, setType] = useState("");
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
  });
  const tableRef = useRef(null);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keys, setKeys] = useState([
    "machine_layout_id",
    "customer_id",
    "toc_do",
    "tg_doi_model",
    "machine_id",
    "layout_id",
    "ma_film_1",
    "ma_muc_1",
    "do_nhot_1",
    "vi_tri_film_1",
    "al_film_1",
    "al_muc_1",
    "ma_film_2",
    "ma_muc_2",
    "do_nhot_2",
    "vi_tri_film_2",
    "al_film_2",
    "al_muc_2",
    "ma_film_3",
    "ma_muc_3",
    "do_nhot_3",
    "vi_tri_film_3",
    "al_film_3",
    "al_muc_3",
    "ma_film_4",
    "ma_muc_4",
    "do_nhot_4",
    "vi_tri_film_4",
    "al_film_4",
    "al_muc_4",
    "ma_film_5",
    "ma_muc_5",
    "do_nhot_5",
    "vi_tri_film_5",
    "al_film_5",
    "al_muc_5",
    "ma_khuon",
    "vt_khuon",
    "al_khuon",
    "vi_tri_khuon",
    "vt_lo_bat_khuon",
  ]);
  const isEditing = (record) => record.key === editingKey;

  const hasEditColumn = (value) => {
    return keys.some((val) => val === value);
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (type === "update") {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          key: row.id,
        });
        row.id = item.id;
        await updateLayouts(row);
        setData(newData);
        setEditingKey("");
      } else {
        await createLayouts(row);
        const items = [row, ...data.filter((val) => val.key !== key)];
        setData(items);
        setEditingKey("");
      }
      form.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const deleteItem = async (key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      await deleteLayouts({ id: newData[index].id });
      newData.splice(index, 1);
      setData(newData);
    }
  };
  const qr_arr = [
    "ma_film_1",
    "ma_film_2",
    "ma_film_3",
    "ma_film_4",
    "ma_film_5",
    "ma_muc_1",
    "ma_muc_2",
    "ma_muc_3",
    "ma_muc_4",
    "ma_muc_5",
    "ma_khuon",
  ];
  const printQR = (record) => {
    const arr = [];
    for (const [key, value] of Object.entries(record)) {
      if (qr_arr.includes(key) && value) {
        arr.push(value);
      }
    }
    setListCheck(arr);
  };
  const col_detailTable = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      align: "center",
      width: "50px",
      fixed: "left",
      render: (value, record, index) => ((page - 1) * pageSize) + index + 1,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      align: "center",
      width: "170px",
      editable: hasEditColumn("customer_id"),
      fixed: "left",
    },
    {
      title: "Mã máy in và mã layout",
      dataIndex: "machine_layout_id",
      key: "machine_layout_id",
      align: "center",
      width: "170px",
      editable: hasEditColumn("machine_layout_id"),
      fixed: "left",
    },
    {
      title: "Tên máy",
      dataIndex: "machine_id",
      key: "machine_id",
      align: "center",
      editable: hasEditColumn("machine_id"),
      width: "80px",
      fixed: "left",
    },
    {
      title: "Mã layout",
      dataIndex: "layout_id",
      key: "layout_id",
      align: "center",
      width: "4%",
      editable: hasEditColumn("layout_id"),
      fixed: "left",
    },
    {
      title: "Tốc độ",
      dataIndex: "toc_do",
      key: "toc_do",
      align: "center",
      editable: hasEditColumn("toc_do"),
    },
    {
      title: "TG đổi model(phút)",
      dataIndex: "tg_doi_model",
      key: "tg_doi_model",
      align: "center",
      width: "100px",
      editable: hasEditColumn("tg_doi_model"),
    },
    {
      title: "Lô in 1",
      dataIndex: "lo_in_1",
      key: "lo_in_1",
      align: "center",
      children: [
        {
          title: "Mã film",
          dataIndex: "ma_film_1",
          key: "ma_film_1",
          align: "center",
          width: "190px",
          editable: hasEditColumn("ma_film_1"),
        },
        {
          title: "Mã mực",
          dataIndex: "ma_muc_1",
          key: "ma_muc_1",
          align: "center",
          width: "100px",
          editable: hasEditColumn("ma_muc_1"),
        },
        {
          title: "Độ nhớt",
          dataIndex: "do_nhot_1",
          key: "do_nhot_1",
          align: "center",
          editable: hasEditColumn("do_nhot_1"),
        },
        {
          title: "Vị trí film",
          dataIndex: "vi_tri_film_1",
          key: "vi_tri_film_1",
          align: "center",
          editable: hasEditColumn("vi_tri_film_1"),
        },
        {
          title: "Áp lực lô film",
          dataIndex: "al_film_1",
          key: "al_film_1",
          align: "center",
          editable: hasEditColumn("al_film_1"),
        },
        {
          title: "Áp lực lô mực",
          dataIndex: "al_muc_1",
          key: "al_muc_1",
          align: "center",
          editable: hasEditColumn("al_muc_1"),
        },
      ],
    },
    {
      title: "Lô in 2",
      dataIndex: "lo_in_2",
      key: "lo_in_2",
      align: "center",
      children: [
        {
          title: "Mã film",
          dataIndex: "ma_film_2",
          key: "ma_film_2",
          align: "center",
          width: "190px",
          editable: hasEditColumn("ma_film_2"),
        },
        {
          title: "Mã mực",
          dataIndex: "ma_muc_2",
          key: "ma_muc_2",
          align: "center",
          width: "120px",
          editable: hasEditColumn("ma_muc_2"),
        },
        {
          title: "Độ nhớt",
          dataIndex: "do_nhot_2",
          key: "do_nhot_2",
          align: "center",
          editable: hasEditColumn("do_nhot_2"),
        },
        {
          title: "Vị trí film",
          dataIndex: "vi_tri_film_2",
          key: "vi_tri_film_2",
          align: "center",
          editable: hasEditColumn("vi_tri_film_2"),
        },
        {
          title: "Áp lực lô film",
          dataIndex: "al_film_2",
          key: "al_film_2",
          align: "center",
          editable: hasEditColumn("al_film_2"),
        },
        {
          title: "Áp lực lô mực",
          dataIndex: "al_muc_2",
          key: "al_muc_2",
          align: "center",
          editable: hasEditColumn("al_muc_2"),
        },
      ],
    },
    {
      title: "Lô in 3",
      dataIndex: "lo_in_3",
      key: "lo_in_3",
      align: "center",
      children: [
        {
          title: "Mã film",
          dataIndex: "ma_film_3",
          key: "ma_film_3",
          align: "center",
          width: "190px",
          editable: hasEditColumn("ma_film_3"),
        },
        {
          title: "Mã mực",
          dataIndex: "ma_muc_3",
          key: "ma_muc_3",
          align: "center",
          width: "120px",
          editable: hasEditColumn("ma_muc_3"),
        },
        {
          title: "Độ nhớt",
          dataIndex: "do_nhot_3",
          key: "do_nhot_3",
          align: "center",
          editable: hasEditColumn("do_nhot_3"),
        },
        {
          title: "Vị trí film",
          dataIndex: "vi_tri_film_3",
          key: "vi_tri_film_3",
          align: "center",
          editable: hasEditColumn("vi_tri_film_3"),
        },
        {
          title: "Áp lực lô film",
          dataIndex: "al_film_3",
          key: "al_film_3",
          align: "center",
          editable: hasEditColumn("al_film_3"),
        },
        {
          title: "Áp lực lô mực",
          dataIndex: "al_muc_3",
          key: "al_muc_3",
          align: "center",
          editable: hasEditColumn("al_muc_3"),
        },
      ],
    },
    {
      title: "Lô in 4",
      dataIndex: "lo_in_4",
      key: "lo_in_4",
      align: "center",
      children: [
        {
          title: "Mã film",
          dataIndex: "ma_film_4",
          key: "ma_film_4",
          align: "center",
          width: "190px",
          editable: hasEditColumn("ma_film_4"),
        },
        {
          title: "Mã mực",
          dataIndex: "ma_muc_4",
          key: "ma_muc_4",
          align: "center",
          width: "120px",
          editable: hasEditColumn("ma_muc_4"),
        },
        {
          title: "Độ nhớt",
          dataIndex: "do_nhot_4",
          key: "do_nhot_4",
          align: "center",
          editable: hasEditColumn("do_nhot_4"),
        },
        {
          title: "Vị trí film",
          dataIndex: "vi_tri_film_4",
          key: "vi_tri_film_4",
          align: "center",
          editable: hasEditColumn("vi_tri_film_4"),
        },
        {
          title: "Áp lực lô film",
          dataIndex: "al_film_4",
          key: "al_film_4",
          align: "center",
          editable: hasEditColumn("al_film_4"),
        },
        {
          title: "Áp lực lô mực",
          dataIndex: "al_muc_4",
          key: "al_muc_4",
          align: "center",
          editable: hasEditColumn("al_muc_4"),
        },
      ],
    },
    {
      title: "Lô in 5",
      dataIndex: "lo_in_5",
      key: "lo_in_5",
      align: "center",
      children: [
        {
          title: "Mã film",
          dataIndex: "ma_film_5",
          key: "ma_film_5",
          align: "center",
          width: "190px",
          editable: hasEditColumn("ma_film_5"),
        },
        {
          title: "Mã mực",
          dataIndex: "ma_muc_5",
          key: "ma_muc_5",
          align: "center",
          width: "120px",
          editable: hasEditColumn("ma_muc_5"),
        },
        {
          title: "Độ nhớt",
          dataIndex: "do_nhot_5",
          key: "do_nhot_5",
          align: "center",
          editable: hasEditColumn("do_nhot_5"),
        },
        {
          title: "Vị trí film",
          dataIndex: "vi_tri_film_5",
          key: "vi_tri_film_5",
          align: "center",
          editable: hasEditColumn("vi_tri_film_5"),
        },
        {
          title: "Áp lực lô film",
          dataIndex: "al_film_5",
          key: "al_film_5",
          align: "center",
          editable: hasEditColumn("al_film_5"),
        },
        {
          title: "Áp lực lô mực",
          dataIndex: "al_muc_5",
          key: "al_muc_5",
          align: "center",
          editable: hasEditColumn("al_muc_5"),
        },
      ],
    },
    {
      title: "Khối bế",
      dataIndex: "",
      key: "lo_in_5",
      align: "center",
      children: [
        {
          title: "Mã khuôn",
          dataIndex: "ma_khuon",
          key: "ma_khuon",
          align: "center",
          editable: hasEditColumn("ma_khuon"),
        },
        {
          title: "Vị trí lô bắt khuôn",
          dataIndex: "vt_lo_bat_khuon",
          key: "vt_lo_bat_khuon",
          align: "center",
          editable: hasEditColumn("vt_lo_bat_khuon"),
        },
        {
          title: "Vị trí khuôn",
          dataIndex: "vt_khuon",
          key: "vt_khuon",
          align: "center",
          editable: hasEditColumn("vt_khuon"),
        },
      ],
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
      width: 150,
      render: (value) =>
        value && dayjs(value).isValid()
          ? dayjs(value).format("DD/MM/YYYY HH:mm:ss")
          : "",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      align: "center",
      fixed: "right",
      width: "2.5%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </Typography.Link>
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy?"
              onConfirm={() => cancel(record)}
              placement="topRight"
            >
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <PrinterOutlined
              style={{ color: "#1677ff", fontSize: 20 }}
              onClick={() => printQR(record)}
            />
            <EditOutlined
              style={{ color: "#1677ff", fontSize: 20, marginLeft: 8 }}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => deleteItem(record.key)}
            >
              <DeleteOutlined
                style={{
                  color: "red",
                  marginLeft: 8,
                  fontSize: 20,
                }}
              />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const onAdd = () => {
    form.resetFields();
    const newData = [
      {
        key: data.length + 1,
        id: "",
        customer_id: "",
        toc_do: "",
        tg_doi_model: "",
        layout_id: "",
        ma_film_1: "",
        ma_film_2: "",
        ma_film_3: "",
        ma_film_4: "",
        ma_film_5: "",
        ma_khuon: "",
        ma_muc_1: "",
        ma_muc_2: "",
        ma_muc_3: "",
        ma_muc_4: "",
        ma_muc_5: "",
        do_nhot_1: "",
        do_nhot_2: "",
        do_nhot_3: "",
        do_nhot_4: "",
        do_nhot_5: "",
        vi_tri_film_1: "",
        vi_tri_film_2: "",
        vi_tri_film_3: "",
        vi_tri_film_4: "",
        vi_tri_film_5: "",
        al_film_1: "",
        al_film_2: "",
        al_film_3: "",
        al_film_4: "",
        al_film_5: "",
        al_muc_1: "",
        al_muc_2: "",
        al_muc_3: "",
        al_muc_4: "",
        al_muc_5: "",
        vt_lo_bat_khuon: "",
        vt_khuon: "",
        al_khuon: "",
        machine_id: "",
        machine_layout_id: "",
        isAdd: true,
      },
      ...data,
    ];
    setData(newData);
    setEditingKey(data.length + 1);
    setType("add");
    tableRef.current?.scrollTo({ key: 0 });
  };

  const cancel = (record) => {
    if (record.isAdd) {
      const newData = [...data];
      newData.shift();
      setData(newData);
    }
    setEditingKey("");
  };

  const print = useReactToPrint({
    content: () => componentRef1.current,
  });

  const mergedColumns = col_detailTable.map((col) => {
    if (!col.editable && !col.children) {
      return col;
    }

    if (col.children) {
      const children = col.children.map((childCol) => {
        if (!childCol.editable) {
          return childCol;
        }

        return {
          ...childCol,
          onCell: (record) => ({
            record,
            dataIndex: childCol.dataIndex,
            title: childCol.title,
            editing: isEditing(record),
          }),
        };
      });

      return { ...col, children };
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const edit = async (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
    setType("update");
  };

  function btn_click() {
    loadListTable(params);
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getListLayout(params);
    setData(res.data.map((val, index) => ({ ...val, key: index })));
    setTotalPage(res.totalPage);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      loadListTable(params);
    })();
  }, [params]);
  useEffect(() => {
    if (listCheck.length > 0) {
      print();
    }
  }, [listCheck]);

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

  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const header = document.querySelector(".custom-card .ant-table-header");
  const pagination = document.querySelector(".custom-card .ant-pagination");
  const card = document.querySelector(".custom-card .ant-card-body");
  const [tableHeight, setTableHeight] = useState(
    (card?.offsetHeight ?? 0) -
      48 -
      (header?.offsetHeight ?? 0) -
      (pagination?.offsetHeight ?? 0)
  );
  useEffect(() => {
    const handleWindowResize = () => {
      const header = document.querySelector(".custom-card .ant-table-header");
      const pagination = document.querySelector(".custom-card .ant-pagination");
      const card = document.querySelector(".custom-card .ant-card-body");
      setTableHeight(
        (card?.offsetHeight ?? 0) -
          48 -
          (header?.offsetHeight ?? 0) -
          (pagination?.offsetHeight ?? 0)
      );
    };
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [data]);
  return (
    <>
      {contextHolder}
      <Row
        style={{ padding: "8px", marginRight: 0, height: "calc(100vh - 70px)" }}
        gutter={[8, 8]}
      >
        <Col span={4}>
          <div className="slide-bar">
            <Card
              bodyStyle={{
                paddingInline: 0,
                paddingTop: 0,
                height: "calc(100vh - 145px)",
              }}
              className="custom-card scroll"
              actions={[
                <div layout="vertical">
                  <Button
                    type="primary"
                    style={{ width: "80%" }}
                    onClick={() => btn_click()}
                  >
                    Truy vấn
                  </Button>
                </div>,
              ]}
            >
              <Divider>Điều kiện truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Form.Item label="Máy" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          machine_id: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập máy"
                    />
                  </Form.Item>
                  <Form.Item label="Khách hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          customer_id: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="Mã layout" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, layout_id: e.target.value });
                        setPage(1);
                      }}
                      placeholder="Nhập mã layout"
                    />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Quản lý thông tin layout"
            className="custom-card"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/upload-layout"}
                  headers={{
                    authorization: "Bearer " + userProfile.token,
                  }}
                  onChange={(info) => {
                    setLoadingExport(true);
                    if (info.file.status === "error") {
                      setLoadingExport(false);
                      error();
                    } else if (info.file.status === "done") {
                      if (info.file.response.success === true) {
                        loadListTable();
                        success();
                        setLoadingExport(false);
                      } else {
                        loadListTable(params);
                        message.error(info.file.response.message);
                        setLoadingExport(false);
                      }
                    }
                  }}
                >
                  <Button
                    style={{ marginLeft: "15px" }}
                    type="primary"
                    loading={loadingExport}
                  >
                    Upload Excel
                  </Button>
                </Upload>
                <Button type="primary" onClick={onAdd}>
                  Thêm layout
                </Button>
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Form form={form} component={false}>
                <Table
                  ref={tableRef}
                  size="small"
                  bordered
                  pagination={{
                    current: page,
                    size: "small",
                    total: totalPage,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                      setPage(page);
                      setPageSize(pageSize);
                      setParams({ ...params, page: page, pageSize: pageSize });
                    },
                  }}
                  scroll={{
                    x: "280vw",
                    y: "calc(100vh - 340px)",
                  }}
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  columns={mergedColumns}
                  dataSource={data}
                />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
      <div className="report-history-invoice">
        <TemLayout listCheck={listCheck} ref={componentRef1} />
      </div>
    </>
  );
};

export default Layout;
