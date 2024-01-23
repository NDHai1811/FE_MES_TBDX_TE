import axios from "axios";

export const getTablesNvl = async () => {
  return await axios.get("/oi/warehouse/mlt/import/log");
};

export const getScanList = async (params) => {
  return await axios.get("/oi/warehouse/mlt/import/scan", { params });
};

export const sendResultScan = async (data) => {
  return await axios.post("/oi/warehouse/mlt/import/save", data);
};

export const sendResultPrint = async (data) => {
  return await axios.post("/oi/warehouse/mlt/import/retype", data);
};

export const handleNGMaterial = async (data) => {
  return await axios.post("/oi/warehouse/mlt/import/warehouse13", data);
};

export const getWarehouseOverall = async () => {
  return await axios.get("oi/warehouse/mlt/import/overall");
};

export const getWarehouseFGOverall = async () => {
  return await axios.get("oi/warehouse/fg/overall");
};

export const getSuggestPallet = async () => {
  return await axios.get("/oi/warehouse/fg/suggest-pallet");
};

export const getQuantityLot = async (params) => {
  return await axios.get("/oi/warehouse/fg/quantity-lot", { params });
};

export const sendStorePallet = async (params) => {
  return await axios.post("/oi/warehouse/fg/store-pallet", params);
};

export const importData = async (params) => {
  return await axios.post("/oi/warehouse/fg/import/save", params);
};

export const getExportNvlLogs = async () => {
  return await axios.get("oi/warehouse/mlt/export/list");
};

export const exportNvlData = async (data) => {
  return await axios.post("/oi/warehouse/mlt/export/save", data);
};

export const getExportsNVL = async (params) => {
  return await axios.get("/oi/warehouse/mlt/export/log-list", { params });
};
export const scanExportsNVL = async (params) => {
  return await axios.get("/oi/warehouse/mlt/export/scan", { params });
};
export const saveExportsNVL = async (params) => {
  return await axios.get("/oi/warehouse/mlt/export/result", { params });
};

export const getWarehouseTpLogs = async () => {
  return await axios.get("oi/warehouse/fg/import/logs");
};
