import axios from "axios";

export async function scanPalletQC(params) {
  return await axios.post("/pqc/scanPallet", params);
}

export async function getQCLine(params) {
  return await axios.get("oi/qc/line", {params});
}

export async function getLotQCList(params) {
  return await axios.get("oi/pqc/lot/list", { params });
}

export async function getChecksheetList(params) {
  return await axios.get("/oi/pqc/checksheet/list", { params: params });
}

export async function scanError(params) {
  return await axios.get("oi/pqc/error/list", { params: params });
}

export async function getErrorList(params) {
  return await axios.get("oi/pqc/error/list", { params: params });
}

export async function getQCOverall(params) {
  return await axios.get("oi/pqc/overall", { params });
}

export async function sendQCResult(params) {
  return await axios.post("oi/pqc/save-result", params);
}
export async function checkUserPermission(params) {
  return await axios.get("oi/qc/check-permission", params);
}
