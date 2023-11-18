import axios from "axios";

export async function scanPalletQC(params) {
  const res = await axios.post("/qc/scanPallet", params);
  return res;
}

export async function getLotQCList(params) {
  const res = await axios.get("oi/qc/lot/list", { params });
  return res.data;
}

export async function getChecksheetList(params) {
  const res = await axios.get("/oi/qc/checksheet/list", { params: params });
  return res;
}

export async function scanError(params) {
  const res = await axios.get("/qc/error/list", { params: params });
  return res;
}


export async function getErrorList(params) {
  const res = await axios.get("oi/qc/error/list", { params: params });
  return res;
}

export async function getQCOverall(params) {
  const res = await axios.get("oi/qc/overall", { params });
  return res.data;
}

export async function sendQCResult(params) {
  const res = await axios.post("oi/qc/save-result", params);
  return res;
}
