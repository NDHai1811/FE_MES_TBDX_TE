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
