import axios from "axios";

export async function getLine(params) {
  return await axios.get("/line/list", { params });
}
export async function getListMachineOfLine(params) {
  return await axios.get("/line/list-machine", { params: params });
}

export async function getCheckSheetOfMachine(params) {
  return await axios.get("/line/machine/check-sheet", { params: params });
}

export async function updateCheckSheetLog(params) {
  return await axios.post("/line/check-sheet-log/save", params);
}

export async function getErrorOfLine(params) {
  return await axios.get("/line/error", { params: params });
}

export async function getMachineLog(params) {}

export async function updateMachineLog(params) {
  return await axios.post("/machine/machine-log/save", params);
}

export async function getMachineParamtersData(params) {
  return await axios.get("/machine/parameters", { params });
}

export async function updateMachineParamtersData(params) {
  return await axios.post("/machine/parameters/update", params);
}

export async function getMachineOverall(params) {
  return await axios.get("/machine/overall", { params });
}

export const getMachines = async () => {
  return await axios.get("/machine/list");
};

export const updateErrorStatus = async (params) => {
  return await axios.post("/oi/equipment/error/result", params);
};

export const getErrorList = async (params) => {
  return await axios.get("/oi/equipment/error/list", { params });
};

export const getErrorLogs = async (params) => {
  return await axios.get("/oi/equipment/error/log", { params });
};

export const getEquipmentOverall = async (params) => {
  return await axios.get("/oi/equipment/overall", { params });
};

export const getParamaters = async (params) => {
  return await axios.get("/oi/equipment/parameters", { params });
};

export const sendErrorInputResults = async (data) => {
  return await axios.post("/oi/equipment/parameters/save", data);
};

export const getEquipmentLogs = async (params) => {
  return await axios.get("/oi/equipment/mapping-list", { params });
};

export const getEquipmentMappingList = async () => {
  return await axios.get("oi/equipment/mapping/list");
};

export const mappingCheckMaterial = async (params) => {
  const res = await axios.get("/oi/equipment/mapping/check-material", { params });
  return res.data;
};

