import {
  Col,
  Row,
  Table,
  Divider,
  Button,
  Form,
  Input,
  Space,
  Select,
  DatePicker,
  Modal,
  Tabs,
  Badge,
  Collapse,
  ConfigProvider,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import { getOrders, getUsers, getVehicles } from "../../api";
import { getCustomers } from "../../api/ui/main";
import { createDeliveryNote, createWareHouseFGExport, getDeliveryNoteList, getWarehouseFGExportPlan } from "../../api/ui/warehouse";
import { DeleteOutlined } from "@ant-design/icons";

const PopupCreateExportPlanFG = (props) => {
	const {listUsers = [], listCustomers = [], listVehicles = [], onAfterCreate = null} = props;
	const [open, setOpen] = useState(false);
	const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [tableParams, setTableParams] = useState({ page: 1, pageSize: 20, totalPage: 1})
	const [selectedRows, setSelectedRows] = useState([]);
  const [planParams, sePlanParams] = useState({ngay_xuat: dayjs()});
  const [messageApi, contextHolder] = message.useMessage();
	const columns = [
    {
      title: "Khách hàng",
      dataIndex: "short_name",
      key: "short_name",
      align: "center",
      width: 100,
      isSearch: true,
      input_type: 'select',
      options: listCustomers
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: 100,
      isSearch: true,
      mode: 'tags',
      input_type: 'select',
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      align: "center",
      width: 100,
      isSearch: true,
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: 50,
    },
    {
      title: "L",
      dataIndex: "length",
      key: "length",
      align: "center",
      width: 50,
      isSearch: true,
    },
    {
      title: "W",
      dataIndex: "width",
      key: "width",
      align: "center",
      width: 50,
      isSearch: true,
    },
    {
      title: "H",
      dataIndex: "height",
      key: "height",
      align: "center",
      width: 50,
      isSearch: true,
    },
    {
      title: "Kích thước",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      align: "center",
      width: 160,
      isSearch: true,
    },
    {
      title: "Số lượng",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      width: 70,
    },
    {
      title: "TMO",
      dataIndex: "tmo",
      key: "tmo",
      align: "center",
      isSearch: true,
    },
    {
      title: "PO",
      dataIndex: "po",
      key: "po",
      align: "center",
      isSearch: true,
    },
    {
      title: "STYLE",
      dataIndex: "style",
      key: "style",
      align: "center",
      isSearch: true,
    },
    {
      title: "STYLE NO",
      dataIndex: "style_no",
      key: "style_no",
      align: "center",
      isSearch: true,
    },
    {
      title: "COLOR",
      dataIndex: "color",
      key: "color",
      align: "center",
      isSearch: true,
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      align: "center",
      isSearch: true,
    },
    {
      title: "RM",
      dataIndex: "rm",
      key: "rm",
      align: "center",
      isSearch: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
    },
    {
      title: "Đợt",
      dataIndex: "dot",
      key: "dot",
      align: "center",
      width: 60,
      isSearch: true,
    },
    {
      title: "Fac",
      dataIndex: "xuong_giao",
      key: "xuong_giao",
      align: "center",
      width: 60,
      isSearch: true,
    },
    {
      title: "Hạn giao",
      dataIndex: "han_giao",
      key: "han_giao",
      align: "center",
      width: 100,
      isSearch: true,
      input_type: 'date',
    },
  ];
	const rowSelection = {
    selectedRowKeys: [].concat(selectedRows).map(e => e.key),
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(prev => {
        const newArray = [...prev, ...selectedRows];
        return newArray.filter((e, index) => {
          return index === newArray.findIndex(o => e.key === o.key);
        });
      });
    },
    optionFilterProp: 'label',
    onSelectAll: (selected, selectedRows, changeRows) => !selected && onDeselectOrders(changeRows),
    onSelect: (record, selected, selectedRows, nativeEvent) => !selected && onDeselectOrders([record])
  };
	const selectedRowsColumns = [...columns, {
    title: 'Tác vụ',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 60,
    render: (_, record) => <DeleteOutlined style={{ color: "red", fontSize: 18 }} onClick={() => onDeselectOrders([record])} />
  }];

	async function loadData(params){
		setLoading(true);
		var res = await getOrders(params);
		setData(res.data.map(e=>({...e, key: e.id})));
    setTableParams({...tableParams, totalPage: res.totalPage})
		setLoading(false);
	}
	useEffect(()=>{
    if(Object.keys(params).length > 0){
      loadData({...params, page: 1, pageSize: 20});
      setTableParams({...tableParams, page: 1, pageSize: 20});
    }
	}, [params]);
	useEffect(()=>{
    if(open){
      loadData({...params, page: 1, pageSize: 20});
      setTableParams({...tableParams, page: 1, pageSize: 20});
    }else{
      setParams({});
      setData()
      setTableParams({ page: 1, pageSize: 20, totalPage: 1});
    }
	}, [open]);
	const onDeselectOrders = (rows) => {
    setSelectedRows(prev => {
      const newArray = [...prev];
      return newArray.filter((e, index) => {
        return !rows.some(o => o.key === e.key)
      });
    });
  }
  const onCreate = async () => {
    if(!planParams.ngay_xuat){
      messageApi.warning('Chưa chọn ngày xuất!');
      return 0;
    }
    if(!selectedRows.length){
      messageApi.warning('Chưa chọn đơn hàng!');
      return 0;
    }
    var res = await createWareHouseFGExport({ ngay_xuat: planParams.ngay_xuat, orders: selectedRows });
    if (res.success) {
      setOpen(false);
      setSelectedRows([]);
      setParams({});
      setTableParams({ page: 1, pageSize: 20, totalPage: 1});
      onAfterCreate();
    }
  }
	const items = [
    {
      label: 'Danh sách đơn hàng',
      key: 1,
      children: <Table size='small' bordered
        loading={loading}
        pagination={{
          current: tableParams.page,
          size: "small",
          total: tableParams?.totalPage ?? 1,
          pageSize: tableParams.pageSize,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setTableParams({ ...tableParams, page: page, pageSize: pageSize });
            loadData({...params, page: page, pageSize: pageSize})
          },
        }}
        scroll={
          {
            x: '170vw',
            y: '70vh'
          }
        }
        tableLayout="fixed"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data} />
    },
    {
      label: <Space>{'Đơn hàng đã chọn'}<Badge count={selectedRows.length} showZero color="#1677ff" overflowCount={999} /></Space>,
      key: 2,
      children: <Table size='small' bordered
        pagination={false}
        scroll={
          {
            x: '260vw',
            y: '70vh'
          }
        }
        tableLayout="fixed"
        columns={selectedRowsColumns}
        dataSource={selectedRows}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              {selectedRowsColumns.map((e, index) => {
                if (index === 0) {
                  return <Table.Summary.Cell align="center" index={index}>Tổng số lượng</Table.Summary.Cell>
                } else if (index === 10) {
                  return <Table.Summary.Cell align="center" index={index}>{
                    selectedRows.reduce((sum, { sl }) => sum + parseInt(sl), 0)
                  }</Table.Summary.Cell>
                } else {
                  return <Table.Summary.Cell index={index} />
                }
              })}
            </Table.Summary.Row>
          </Table.Summary>
        )} />
    }
  ];
	const extraTab = {
    right: <Button type="primary" className="tabs-extra-demo-button" onClick={() => onCreate()}>Tạo KHXK</Button>,
  };
	return (
		<React.Fragment>
      {contextHolder}
			<Button type="primary" onClick={()=>setOpen(true)}>Tạo KHXK từ ĐH</Button>
			<Modal
				open={open}
				onCancel={() => setOpen(false)}
				footer={null}
				title="Tạo KHXK từ đơn hàng"
				width={'98vw'}
				height={'100vh'}
				style={{
					// position: 'fixed',
					left: '0',
					right: '0',
					top: '5px',
				}}
			>
				<Form layout="vertical">
					<Row gutter={[8, 0]}>
						<Col span={8}>
							<Form.Item
								label="Ngày xuất"
								className="mb-2"
							>
								<DatePicker
                  allowClear={false}
                  showTime
                  placeholder="Ngày xuất"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    value.isValid() && sePlanParams({ ...planParams, ngay_xuat: value });
                  }}
                  needConfirm={false}
                  onSelect={(value) => {
                    sePlanParams({ ...planParams, ngay_xuat: value });
                  }}
                  value={planParams.ngay_xuat}
                />
							</Form.Item>
						</Col>
					</Row>
					<ConfigProvider
						theme={{
							components: {
								Collapse: {
									headerPadding: 0,
									contentPadding: 0
								},
							},
						}}>
						<Collapse
							collapsible="header"
							defaultActiveKey={['1']}
							ghost
							items={[
								{
									key: '1',
									label: <Divider orientation="left" orientationMargin="0" plain style={{ margin: 0 }}>Truy vấn</Divider>,
									children: <Row gutter={[8, 0]}>
										{columns.filter(e=>e.isSearch).map(e => {
											let item = null;
											if (e?.input_type === 'select') {
												item = <Select
													mode={e?.mode}
													options={e?.options}
													showSearch
													maxTagCount={'responsive'}
													allowClear
                          optionFilterProp="label"
													placeholder={'Nhập ' + e.title.toLowerCase()}
													onChange={(value) => setParams({ ...params, [e.dataIndex]: value })}
													value={params[e.dataIndex]}
												/>
											}
											else if (['date', 'date_time'].includes(e?.input_type)) {
												item = <DatePicker
													className="w-100"
													showTime={e?.input_type === 'date_time'}
													needConfirm={false}
													placeholder={'Nhập ' + e.title.toLowerCase()}
													onChange={(value) => (!value || value.isValid()) && setParams({ ...params, [e.dataIndex]: value })}
													onSelect={(value) => setParams({ ...params, [e.dataIndex]: value })}
													value={params[e.dataIndex]}
												/>;
											} else {
												item = <Input
													allowClear
													placeholder={'Nhập ' + e.title.toLowerCase()}
													onChange={(value) => setParams({ ...params, [e.dataIndex]: value.target.value })}
													value={params[e.dataIndex]}
												/>
											}
											return e.isSearch && <Col span={2}>
												<Form.Item label={e.title} style={{ marginBottom: 8 }}>
													{item}
												</Form.Item>
											</Col>
										})}
									</Row>,
								},
							]}
						/>
					</ConfigProvider>
				</Form>
				<Tabs
					className="mt-1"
					type="card"
					items={items}
					tabBarExtraContent={extraTab}
				/>
			</Modal>
		</React.Fragment>
	);
};

export default PopupCreateExportPlanFG;
