import axios from "axios";

export async function getListMachine(params) {
    const res = await axios.get('/machine/list', params);
    return res.data;
}
export async function storePallet(params) {
    const res = await axios.post('/lot/store', params);
    return res;
}
export async function getListLot(params) {
    const res = await axios.get('/lot/list-table', { params: params });
    return res.data;
}
export async function getListWarehouseExportPlan(params) {
    const res = await axios.get('/warehouse/list-export-plan', {params});
    return res.data;
}
export async function getListProductPlan(params) {
    const res = await axios.get('/production-plan/list', {params});
    return res.data;
}
export async function getProposeWareHouse(params) {
    const res = await axios.get('/warehouse/propose-import', { params: params });
    return res.data;
}
export async function importWareHouse(params) {
    const res = await axios.post('/warehouse/import', params);
    return res.data;
}
export async function getListImportWareHouse() {
    const res = await axios.get('/warehouse/list-import');
    return res.data;
}
export async function getInfoImportWareHouse() {
    const res = await axios.get('/warehouse/info-import');
    return res.data;
}
export async function getListCustomerExport() {
    const res = await axios.get('/warehouse/list-customer');
    return res.data;
}
export async function getProposeExportWareHouse(params) {
    const res = await axios.get('/warehouse/propose-export', { params: params });
    return res.data;
}
export async function exportWareHouse(params) {
    const res = await axios.post('/warehouse/export', params);
    return res.data;
}
export async function getInfoExportWareHouse() {
    const res = await axios.get('/warehouse/info-export');
    return res.data;
}
export async function getListMaterialLog() {
    const res = await axios.get('/material/list-log');
    return res.data;
}
export async function updateMaterialLog(params) {
    const res = await axios.post('/material/update-log', params);
    return res.data;
}
export async function getListLsxUseMaterial(params) {
    const res = await axios.get('/material/list-lsx', { params: params });
    return res.data;
}
export async function splitBarrel(params) {
    const res = await axios.post('/barrel/split', params);
    return res.data;
}
export async function getHistoryWareHouse(params) {
    const res = await axios.get('/warehouse/history', { params: params });
    return res.data;
}
export async function deletePallet(params) {
    const res = await axios.delete('/pallet/destroy', { params: params });
    return res.data;
}
export async function updateMaterialLogRecord(params) {
    const res = await axios.post('/material/update-log-record', params);
    return res.data;
}
export async function storeMaterialLog(params) {
    const res = await axios.post('/material/store-log', params);
    return res.data;
}
export async function deleteRecordProductPlan(params){
    const res = await axios.delete('/product_plan/destroy', { params: params });
    return res.data;
}
export async function updateProductPlan(params){
    const res = await axios.post('/product_plan/update', params);
    return res.data;
}
export async function storeProductPlan(params){
    const res = await axios.post('/product_plan/store', params);
    return res.data;
}
export async function deleteWareHouseExport(params){
    const res = await axios.delete('/warehouse-export/destroy', {params: params});
    return res.data;
}

export async function testUpdateTable(params){
    const res = await axios.post('/update/test', params);
    return res.data;
}

export async function getListScenario(){
    const res = await axios.get('/scenario/list');
    return res.data;
}

export async function updateScenario(params){
    const res = await axios.post('/scenario/update',params);
    return res.data;
}
export async function getHistoryMonitor(params){
    const res = await axios.get('/monitor/history', {params: params});
    return res.data;
}
export async function getDetailLot(params){
    const res = await axios.get('/lot/detail', {params: params});
    return res.data;
}
export async function getInfoChon(params){
    const res = await axios.get('/info/chon', {params: params});
    return res;
}
export async function exportSummaryWarehouse(params){
    const res = await axios.get('export/warehouse/summary', {params: params});
    return res;
}
export async function exportBMCardWarehouse(params){
    const res = await axios.get('export/warehouse/bmcard', {params: params});
    return res;
}
export async function getStatusIOT(){
    const res = await axios.get('/iot/status');
    return res.data;
}
