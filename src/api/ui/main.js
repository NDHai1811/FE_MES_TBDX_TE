import axios from "axios";

export async function getLines(params) {
  const res = await axios.get("ui/manufacture/line");
  return res;
}

export async function getMachineOfLine(params) {
  const res = await axios.get("ui/line/list-machine", { params: params });
  return res;
}

export async function getAllMachine(params) {
  const res = await axios.get("ui/machines");
  return res;
}

export async function getCustomers(params) {
  const res = await axios.get("ui/customers");
  return res;
}

export async function getOrders(params) {
  const res = await axios.get("ui/orders");
  return res;
}

export async function getProducts(params) {
  const res = await axios.get("ui/products");
  return res;
}
export async function getStaffs(params) {
  const res = await axios.get("ui/staffs");
  return res;
}
export async function getLoSanXuat(params) {
  const res = await axios.get("ui/lo_sx");
  return res;
}
export async function getWarehouses(params) {
  const res = await axios.get("ui/warehouses");
  return res;
}
export async function getCaSanXuats(params) {
  const res = await axios.get("ui/ca-san-xuat-s");
  return res;
}
export async function getUIItemMenu(params) {
  const res = await axios.get("ui/item-menu");
  return res;
}
//Lỗi QC
export async function getErrors(params) {
  const res = await axios.get("ui/errors");
  return res;
}

export async function getErrorsMachine(params) {
  const res = await axios.get("ui/errors-machine");
  return res;
}

// api - nối api của Quân
export async function getProduceHistory(params) {
  const res = await axios.get("produce/history", { params: params });
  return res;
}

export async function getPQCHistory(params) {
  const res = await axios.get("qc/history", { params: params });
  return res;
}

export async function getMachineError(params) {
  const res = await axios.get("machine/error", { params: params });
  return res;
}

// export async function postStaffs(params) {
//   const res = await axios.post('/ui/staffs', params);
//   return res;
// }

export async function getThongSoMay(params) {
  const res = await axios.get("ui/thong-so-may", { params: params });
  return res;
}

export async function getKpi(params) {
  const res = await axios.get("kpi", { params });
  return res;
}

export async function getOQC(params) {
  const res = await axios.get("oqc", { params });
  return res;
}

export async function getDataFilterUI(params) {
  const res = await axios.get("ui/data-filter", { params });
  return res;
}

export async function getDetailDataError(params) {
  const res = await axios.get("qc/detail-data-error", { params });
  return res;
}

export async function exportKPI(params) {
  const res = await axios.get("export/kpi", { params });
  return res;
}


