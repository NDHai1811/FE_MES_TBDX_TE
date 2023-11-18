import axios from "axios";

export async function getLine(params) {
  const res = await axios.get("/line/list", { params });
  return res;
}
export async function getListMachineOfLine(params) {
  const res = await axios.get("/line/list-machine", { params: params });
  return res;
}

export async function getCheckSheetOfMachine(params) {
  const res = await axios.get("/line/machine/check-sheet", { params: params });
  return res;
}

export async function updateCheckSheetLog(params) {
  const res = await axios.post("/line/check-sheet-log/save", params);
  return res;
}

export async function getErrorOfLine(params) {
  const res = await axios.get("/line/error", { params: params });
  return res;
}

export async function getMachineLog(params) {
  const res = await axios.get("/machine/logs", { params: params });
  return res;
}

export async function updateMachineLog(params) {
  const res = await axios.post("/machine/machine-log/save", params);
  return res;
}

export async function getMachineParamtersData(params) {
  const res = await axios.get("/machine/parameters", { params });
  return res;
}

export async function updateMachineParamtersData(params) {
  const res = await axios.post("/machine/parameters/update", params);
  return res;
}

export async function getMachineOverall(params) {
  const res = await axios.get("/machine/overall", { params });
  return res;
}

export const getMachines = async () => {
  return await axios.get("/machine/list");
};
