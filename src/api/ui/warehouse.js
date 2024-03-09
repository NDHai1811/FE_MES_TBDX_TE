import axios from "axios";

export const getListPlanMaterialImport = async (params) => {
  return await axios.get("/ui/warehouse/list-material-import", { params });
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
  return await axios.post("/ui/warehouse/delete-material-import", params);
};

export const exportWarehouseTicket = async (params) => {
  return await axios.get("/ui/warehouse/import-material-ticket/export", { params });
};
export const exportVehicleWeightTicket = async (params) => {
  return await axios.get("/ui/warehouse/vehicle-weight-ticket/export", { params });
};

export async function getWarehouseFGExportList(params) {
  const res = await axios.get("/ui/warehouse/fg/export/list", { params });
  return res.data;
}

export async function getTemPallet(params) {
  const res = await axios.get("/ui/warehouse/list-pallet", { params });
  return res.data;
}

export async function updateWarehouseFGExport(params) {
  const res = await axios.post("/ui/warehouse/fg/export/update", params);
  return res.data;
}

export async function getGoodsReceiptNote(params) {
  const res = await axios.get("/ui/warehouse/mtl/goods-receipt-note", {params});
  return res.data;
}

export async function updateGoodsReceiptNote(params) {
  const res = await axios.patch("/ui/goods-receipt-note/update", params);
  return res.data;
}

export async function deleteGoodsReceiptNote(params) {
  const res = await axios.delete("/ui/goods-receipt-note/delete", {params});
  return res.data;
}

export async function getHistoryWareHouseMLT(params) {
  const res = await axios.get("/ui/warehouse/mlt/log", { params: params });
  return res.data;
}
export async function getHistoryWareHouseFG(params) {
  const res = await axios.get("/ui/warehouse/fg/log", { params: params });
  return res.data;
}
export async function createWareHouseFGExport(params) {
  const res = await axios.post("/ui/warehouse/fg/export/create", params);
  return res;
}
