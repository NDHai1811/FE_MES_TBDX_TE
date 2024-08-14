import axios from "axios";

export async function getListMachine(params) {
  const res = await axios.get("/oi/machine/list", {params});
  return res.data;
}
export async function storePallet(params) {
  const res = await axios.post("/lot/store", params);
  return res;
}
export async function getListLot(params) {
  const res = await axios.get("/lot/list-table", { params: params });
  return res.data;
}
export async function getListWarehouseMLTImport(params) {
  const res = await axios.get("/ui/warehouse/list-material-import", { params });
  return res.data;
}
export async function getListProductPlan(params) {
  const res = await axios.get("/production-plan/list", { params });
  return res.data;
}
export async function getProposeWareHouse(params) {
  const res = await axios.get("/warehouse/propose-import", { params: params });
  return res.data;
}
export async function importWareHouse(params) {
  const res = await axios.post("/warehouse/import", params);
  return res.data;
}
export async function getListImportWareHouse() {
  const res = await axios.get("/warehouse/list-import");
  return res.data;
}
export async function getInfoImportWareHouse() {
  const res = await axios.get("/warehouse/info-import");
  return res.data;
}
export async function getListCustomerExport() {
  const res = await axios.get("/warehouse/list-customer");
  return res.data;
}
export async function getProposeExportWareHouse(params) {
  const res = await axios.get("/warehouse/propose-export", { params: params });
  return res.data;
}
export async function exportWareHouse(params) {
  const res = await axios.post("/warehouse/export", params);
  return res.data;
}
export async function getInfoExportWareHouse() {
  const res = await axios.get("/warehouse/info-export");
  return res.data;
}
export async function getListMaterialLog(params) {
  const res = await axios.get("/material/list-log", { params });
  return res.data;
}
export async function updateMaterialLog(params) {
  const res = await axios.post("/material/update-log", params);
  return res.data;
}
export async function getListLsxUseMaterial(params) {
  const res = await axios.get("/material/list-lsx", { params: params });
  return res.data;
}
export async function splitBarrel(params) {
  const res = await axios.post("/barrel/split", params);
  return res.data;
}
export async function deletePallet(params) {
  const res = await axios.delete("/pallet/destroy", { params: params });
  return res.data;
}
export async function updateMaterialLogRecord(params) {
  const res = await axios.post("/material/update-log-record", params);
  return res.data;
}
export async function storeMaterialLog(params) {
  const res = await axios.post("/material/store-log", params);
  return res.data;
}
export async function deleteRecordProductPlan(params) {
  const res = await axios.delete("/product_plan/destroy", { params: params });
  return res.data;
}
export async function updateProductPlan(params) {
  const res = await axios.post("/product_plan/update", params);
  return res.data;
}
export async function storeProductPlan(params) {
  const res = await axios.post("/product_plan/store", params);
  return res.data;
}
export async function deleteWareHouseExport(params) {
  const res = await axios.delete("/warehouse-export/destroy", {
    params: params,
  });
  return res.data;
}
export async function updateWareHouseExport(params) {
  const res = await axios.post("/warehouse-export/update", params);
  return res.data;
}
export async function createWareHouseExport(params) {
  const res = await axios.post("/warehouse-export/create", params);
  return res.data;
}
export async function testUpdateTable(params) {
  const res = await axios.post("/update/test", params);
  return res.data;
}

export async function getListScenario() {
  const res = await axios.get("/scenario/list");
  return res.data;
}

export async function updateScenario(params) {
  const res = await axios.post("/scenario/update", params);
  return res.data;
}
export async function getHistoryMonitor(params) {
  const res = await axios.get("/monitor/history", { params: params });
  return res.data;
}
export async function getDetailLot(params) {
  const res = await axios.get("/lot/detail", { params: params });
  return res.data;
}
export async function getInfoChon(params) {
  const res = await axios.get("/info/chon", { params: params });
  return res;
}
export async function exportSummaryWarehouse(params) {
  const res = await axios.get("export/warehouse/summary", { params: params });
  return res;
}
export async function exportBMCardWarehouse(params) {
  const res = await axios.get("export/warehouse/bmcard", { params: params });
  return res;
}
export async function getStatusIOT() {
  const res = await axios.get("/iot/status");
  return res.data;
}
export async function prepareGT(params) {
  const res = await axios.get("/warehouse-export/get-thung", { params });
  return res.data;
}
export async function gopThung(params) {
  const res = await axios.post("/warehouse-export/gop-thung", params);
  return res.data;
}
export async function exportHistoryMonitors(params) {
  const res = await axios.get("/export/history-monitors", { params });
  return res;
}
export async function taoTem(params) {
  const res = await axios.post("/tao-tem", params);
  return res.data;
}
export async function listProduct() {
  const res = await axios.get("/list-product");
  return res.data;
}

//InfoCongDoan
export async function getInfoCongDoan(params) {
  const res = await axios.get("/info-cong-doan/list", { params });
  return res.data;
}
export async function updateInfoCongDoan(params) {
  const res = await axios.post("/info-cong-doan/update", params);
  return res.data;
}
export async function exportInfoCongDoan(params) {
  const res = await axios.get("/info-cong-doan/export", { params });
  return res;
}

//Machine
export async function getMachines(params) {
  const res = await axios.get("/machines/list", { params });
  return res.data;
}
export async function createMachine(params) {
  const res = await axios.post("/machines/create", params);
  return res.data;
}
export async function updateMachine(params) {
  const res = await axios.patch("/machines/update", params);
  return res.data;
}
export async function deleteMachines(params) {
  const res = await axios.post("/machines/delete", params);
  return res.data;
}
export async function exportMachines(params) {
  const res = await axios.get("/machines/export", { params });
  return res;
}

//Spec
export async function getSpecProduct(params) {
  const res = await axios.get("/spec-product/list", { params });
  return res.data;
}
export async function createSpecProduct(params) {
  const res = await axios.post("/spec-product/create", params);
  return res.data;
}
export async function updateSpecProduct(params) {
  const res = await axios.patch("/spec-product/update", params);
  return res.data;
}
export async function deleteSpecProduct(params) {
  const res = await axios.post("/spec-product/delete", params);
  return res.data;
}
export async function exportSpecProduct(params) {
  const res = await axios.get("/spec-product/export", { params });
  return res;
}

//Errors
export async function getErrors(params) {
  const res = await axios.get("/errors/list", { params });
  return res.data;
}
export async function createErrors(params) {
  const res = await axios.post("/errors/create", params);
  return res.data;
}
export async function updateErrors(params) {
  const res = await axios.patch("/errors/update", params);
  return res.data;
}
export async function deleteErrors(params) {
  const res = await axios.post("/errors/delete", params);
  return res.data;
}
export async function exportErrors(params) {
  const res = await axios.get("/errors/export", { params });
  return res;
}

//TestCriteria
export async function getTestCriteria(params) {
  const res = await axios.get("/test_criteria/list", { params });
  return res.data;
}
export async function createTestCriteria(params) {
  const res = await axios.post("/test_criteria/create", params);
  return res.data;
}
export async function updateTestCriteria(params) {
  const res = await axios.patch("/test_criteria/update", params);
  return res.data;
}
export async function deleteTestCriteria(params) {
  const res = await axios.post("/test_criteria/delete", params);
  return res.data;
}
export async function exportTestCriteria(params) {
  const res = await axios.get("/test_criteria/export", { params });
  return res;
}

//Line
export async function getLine(params) {
  const res = await axios.get("/cong-doan/list", { params });
  return res.data;
}
export async function createLine(params) {
  const res = await axios.post("/cong-doan/create", params);
  return res.data;
}
export async function updateLine(params) {
  const res = await axios.patch("/cong-doan/update", params);
  return res.data;
}
export async function deleteLine(params) {
  const res = await axios.post("/cong-doan/delete", params);
  return res.data;
}
export async function exportLine(params) {
  const res = await axios.get("/cong-doan/export", { params });
  return res;
}

//Users
export async function getUsers(params) {
  const res = await axios.get("/users/list", { params });
  return res.data;
}
export async function getUserRoles(params) {
  const res = await axios.get("/users/roles", { params });
  return res.data;
}
export async function createUsers(params) {
  const res = await axios.post("/users/create", params);
  return res.data;
}
export async function updateUsers(params) {
  const res = await axios.patch("/users/update", params);
  return res.data;
}
export async function deleteUsers(params) {
  const res = await axios.post("/users/delete", params);
  return res.data;
}
export async function exportUsers(params) {
  const res = await axios.get("/users/export", { params });
  return res;
}

//Roles
export async function getRolesTree(params) {
  const res = await axios.get("/roles/tree", { params });
  return res.data;
}
export async function getRolesList(params) {
  const res = await axios.get("/roles/list", { params });
  return res.data;
}
export async function getRolePermissions(params) {
  const res = await axios.get("/roles/permissions", { params });
  return res.data;
}
export async function createRoles(params) {
  const res = await axios.post("/roles/create", params);
  return res.data;
}
export async function updateRoles(params) {
  const res = await axios.patch("/roles/update", params);
  return res.data;
}
export async function deleteRoles(params) {
  const res = await axios.post("/roles/delete", params);
  return res.data;
}
export async function exportRoles(params) {
  const res = await axios.get("/roles/export", { params });
  return res;
}

//Permissions
export async function getPermissions(params) {
  const res = await axios.get("/permissions/list", { params });
  return res.data;
}
export async function createPermissions(params) {
  const res = await axios.post("/permissions/create", params);
  return res.data;
}
export async function updatePermissions(params) {
  const res = await axios.patch("/permissions/update", params);
  return res.data;
}
export async function deletePermissions(params) {
  const res = await axios.post("/permissions/delete", params);
  return res.data;
}
export async function exportPermissions(params) {
  const res = await axios.get("/permissions/export", { params });
  return res;
}

//ErrorMachines
export async function getErrorMachines(params) {
  const res = await axios.get("/error-machines/list", { params });
  return res.data;
}
export async function createErrorMachines(params) {
  const res = await axios.post("/error-machines/create", params);
  return res.data;
}
export async function updateErrorMachines(params) {
  const res = await axios.patch("/error-machines/update", params);
  return res.data;
}
export async function deleteErrorMachines(params) {
  const res = await axios.post("/error-machines/delete", params);
  return res.data;
}
export async function exportErrorMachines(params) {
  const res = await axios.get("/error-machines/export", { params });
  return res;
}

//Materials
export async function getMaterials(params) {
  const res = await axios.get("/material/list", { params });
  return res.data;
}
export async function createMaterial(params) {
  const res = await axios.post("/material/create", params);
  return res.data;
}
export async function updateMaterial(params) {
  const res = await axios.patch("/material/update", params);
  return res.data;
}
export async function deleteMaterials(params) {
  const res = await axios.post("/material/delete", params);
  return res.data;
}
export async function exportMaterials(params) {
  const res = await axios.get("/material/export", { params });
  return res;
}

//Warehouses
export async function getWarehouses(params) {
  const res = await axios.get("/warehouses/list", { params });
  return res.data;
}
export async function createWarehouse(params) {
  const res = await axios.post("/warehouses/create", params);
  return res.data;
}
export async function updateWarehouse(params) {
  const res = await axios.patch("/warehouses/update", params);
  return res.data;
}
export async function deleteWarehouses(params) {
  const res = await axios.post("/warehouses/delete", params);
  return res.data;
}
export async function exportWarehouses(params) {
  const res = await axios.get("/warehouses/export", { params });
  return res;
}


//Cells
export async function getCells(params) {
  const res = await axios.get("/cells/list", { params });
  return res.data;
}
export async function createCell(params) {
  const res = await axios.post("/cells/create", params);
  return res.data;
}
export async function updateCell(params) {
  const res = await axios.patch("/cells/update", params);
  return res.data;
}
export async function deleteCells(params) {
  const res = await axios.post("/cells/delete", params);
  return res.data;
}
export async function exportCells(params) {
  const res = await axios.get("/cells/export", { params });
  return res;
}

//Khuon
export async function getKhuon(params) {
  const res = await axios.get("/khuon/list", { params });
  return res.data;
}
export async function createKhuon(params) {
  const res = await axios.post("/khuon/create", params);
  return res.data;
}
export async function updateKhuon(params) {
  const res = await axios.patch("/khuon/update", params);
  return res.data;
}
export async function deleteKhuon(params) {
  const res = await axios.post("/khuon/delete", params);
  return res.data;
}
export async function exportKhuon(params) {
  const res = await axios.get("/khuon/export", { params });
  return res;
}

//Jig
export async function getJig(params) {
  const res = await axios.get("/jig/list", { params });
  return res.data;
}
export async function createJig(params) {
  const res = await axios.post("/jig/create", params);
  return res.data;
}
export async function updateJig(params) {
  const res = await axios.patch("/jig/update", params);
  return res.data;
}
export async function deleteJig(params) {
  const res = await axios.post("/jig/delete", params);
  return res.data;
}
export async function exportJig(params) {
  const res = await axios.get("/jig/export", { params });
  return res;
}

//Maintenance
export async function getMaintenance(params) {
  const res = await axios.get("/maintenance/list", { params });
  return res.data;
}
export async function getMaintenanceDetail(params) {
  const res = await axios.get("/maintenance/detail", { params });
  return res.data;
}
export async function createMaintenance(params) {
  const res = await axios.post("/maintenance/create", params);
  return res.data;
}
export async function updateMaintenance(params) {
  const res = await axios.patch("/maintenance/update", params);
  return res.data;
}
export async function deleteMaintenance(params) {
  const res = await axios.post("/maintenance/delete", params);
  return res.data;
}
export async function exportMaintenance(params) {
  const res = await axios.get("/maintenance/export", { params });
  return res;
}

//Orders
export async function getOrders(params) {
  const res = await axios.get('/orders/list', { params });
  return res.data;
}
export async function createOrder(params) {
  const res = await axios.post('/orders/create', params);
  return res.data;
}
export async function updateOrder(params) {
  const res = await axios.patch('/orders/update', params);
  return res.data;
}
export async function deleteOrders(params) {
  const res = await axios.delete('/orders/delete', { params });
  return res;
}
export async function exportOrders(params) {
  const res = await axios.get('/orders/export', { params });
  return res;
}
export async function splitOrders(params) {
  const res = await axios.post('/orders/split', params);
  return res;
}
export async function restoreOrders(params) {
  const res = await axios.post('/orders/restore', params);
  return res;
}

//Buyers
export async function getBuyers(params) {
  const res = await axios.get('/buyers/list', { params });
  return res.data;
}
export async function createBuyers(params) {
  const res = await axios.post('/buyers/create', params);
  return res.data;
}
export async function updateBuyers(params) {
  const res = await axios.patch('/buyers/update', params);
  return res.data;
}
export async function deleteBuyers(params) {
  const res = await axios.delete('/buyers/delete', { params });
  return res.data;
}
export async function exportBuyers(params) {
  const res = await axios.get('/buyers/export', { params });
  return res;
}

//Layouts
export async function getLayouts(params) {
  const res = await axios.get('/layouts/list', { params });
  return res.data;
}
export async function createLayouts(params) {
  const res = await axios.post('/layouts/create', params);
  return res.data;
}
export async function updateLayouts(params) {
  const res = await axios.patch('/layouts/update', params);
  return res.data;
}
export async function deleteLayouts(params) {
  const res = await axios.delete('/layouts/delete', { params });
  return res.data;
}

//Customer
export async function getCustomer(params) {
  const res = await axios.get('/customer/list', { params });
  return res.data;
}
export async function createCustomer(params) {
  const res = await axios.post('/customer/create', params);
  return res.data;
}
export async function updateCustomer(params) {
  const res = await axios.patch('/customer/update', params);
  return res.data;
}
export async function deleteCustomer(params) {
  const res = await axios.delete('/customer/delete', { params });
  return res.data;
}
export async function exportCustomer(params) {
  const res = await axios.get('/customer/export', { params });
  return res;
}
export async function getRealCustomerList(params){
  const res = await axios.get('/real-customer-list', {params});
  return res.data
}

//Vehicles
export async function getVehicles(params) {
  const res = await axios.get('/vehicles/list', { params });
  return res.data;
}
export async function createVehicles(params) {
  const res = await axios.post('/vehicles/create', params);
  return res.data;
}
export async function updateVehicles(params) {
  const res = await axios.patch('/vehicles/update', params);
  return res.data;
}
export async function deleteVehicles(params) {
  const res = await axios.delete('/vehicles/delete', { params });
  return res.data;
}
export async function exportVehicles(params) {
  const res = await axios.get('/vehicles/export', { params });
  return res;
}

export async function getTem(params) {
  const res = await axios.get('/intem', { params });
  return res.data;
}

//MachineAssignment
export async function getMachineAssignment(params) {
  const res = await axios.get('/machine-assignment/list', { params });
  return res.data;
}
export async function createMachineAssignment(params) {
  const res = await axios.post('/machine-assignment/create', params);
  return res.data;
}
export async function updateMachineAssignment(params) {
  const res = await axios.patch('/machine-assignment/update', params);
  return res.data;
}
export async function deleteMachineAssignment(params) {
  const res = await axios.post('/machine-assignment/delete', params);
  return res.data;
}
