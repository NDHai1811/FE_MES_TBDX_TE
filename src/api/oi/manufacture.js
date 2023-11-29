import axios from "axios";

export async function getLine(params) {
  return await axios.get("/line/list", { params });
}

export async function getPallet(params) {
  return await axios.get("/lot/list", { params: params });
}

export async function scanPallet(params) {
  return await axios.post("/lot/scanPallet", params);
}

export async function getInfoPallet(params) {
  return await axios.get("/lot/info", { params: params });
}

export async function updatePallet(params) {
  return await axios.post("/lot/input", params);
}

export async function getLineOverall(params) {
  return await axios.get("/line/overall", { params: params });
}

export async function getTable(params) {
  return await axios.get("/line/table/list", { params: params });
}

export async function getLineUser(params) {
  return await axios.get("/line/user", { params: params });
}

export async function setAssignLineUser(params) {
  return await axios.post("/line/assign", params);
}

export async function setAssignTableUserWork(params) {
  return await axios.post("/line/table/work", params);
}

export async function inTem(params) {
  return await axios.post("/lot/intem", params);
}

export async function getTableChon(params) {
  return await axios.get("/lot/table-data-chon", { params });
}

export async function updateSanLuong(params) {
  return await axios.post("/lot/update-san-luong", params);
}

export async function checkSanLuong(params) {
  return await axios.get("/lot/check-san-luong", { params });
}

export async function batDauTinhSanLuong(params) {
  return await axios.post("/lot/bat-dau-tinh-dan-luong", params);
}

export const getOverAll = async (params) => {
  return await axios.get("/oi/manufacture/overall", {params});
};
export async function getLotByMachine(params) {
  return await axios.get("/oi/manufacture/list-lot", { params });
}
export async function checkMaterialPosition(params) {
  return await axios.get("/oi/manufacture/check-material-position", { params });
}
export async function getManufactureOverall(params) {
  return await axios.get("/oi/manufacture/overall", { params: params });
}
export async function getInfoTem(params){
  return await axios.get("/oi/manufacture/intem", { params: params });
}
