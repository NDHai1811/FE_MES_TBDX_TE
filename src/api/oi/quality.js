import axios from "axios";

export async function scanPalletQC(params) {
  return await axios.post("/qc/scanPallet", params);
}

export async function getLotQCList(params) {
  return await axios.get("oi/qc/lot/list", { params });
}

export async function getChecksheetList(params) {
  return await axios.get("/oi/qc/checksheet/list", { params: params });
}

export async function scanError(params) {
  return await axios.get("/qc/error/list", { params: params });
}

export async function getErrorList(params) {
  return await axios.get("oi/qc/error/list", { params: params });
}

export async function getQCOverall(params) {
  return await axios.get("oi/qc/overall", { params });
}

export async function sendQCResult(params) {
  return await axios.post("oi/qc/save-result", params);
}
