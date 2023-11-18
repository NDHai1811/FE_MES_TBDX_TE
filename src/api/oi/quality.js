import axios from "axios";

export async function scanPalletQC(params) {
  const res = await axios.post("/qc/scanPallet", params);
  return res;
}

export async function getChecksheetList(params) {
  const res = await axios.get("/qc/checksheet/list", { params: params });
  return res;
}

export async function scanError(params) {
  const res = await axios.get("/qc/error/list", { params: params });
  return res;
}

export async function getQCOverall(params) {
  const res = await axios.get("/qc/overall", { params });
  return res;
}

export async function sendQCResult(params) {
  const res = await axios.post("/qc/save-result", params);
  return res;
}
