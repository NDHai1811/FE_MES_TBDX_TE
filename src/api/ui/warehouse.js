import axios from "axios";

export const getListPlanMaterialImport = async () => {
  return await axios.get("/ui/warehouse/list-material-import");
};

export const getListPlanMaterialExport = async () => {
  return await axios.get("/ui/warehouse/list-material-export");
};

export const updateWarehouseImport = async (params) => {
  return await axios.patch("/ui/warehouse/update-material-import", params);
};

export const createWarehouseImport = async (params) => {
  return await axios.post("/ui/warehouse/create-material-import", params);
};

export const deleteWarehouseImport = async (params) => {
  return await axios.post("/ui/warehouse/delete-material-import",params);
};
