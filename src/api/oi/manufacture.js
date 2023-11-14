import axios from "axios";

export async function getLine(params) {
    const res = await axios.get('/line/list', {params});
    return res;
}

export async function getPallet(params) {
    const res = await axios.get('/lot/list', {params: params});
    return res;
}

export async function scanPallet(params) {
    const res = await axios.post('/lot/scanPallet', params);
    return res;
}

export async function getInfoPallet(params) {
    const res = await axios.get('/lot/info', {params: params});
    return res;
}

export async function updatePallet(params) {
    const res = await axios.post('/lot/input', params);
    return res;
}

export async function getLineOverall(params) {
    const res = await axios.get('/line/overall', {params: params});
    return res;
}

export async function getTable(params) {
    const res = await axios.get('/line/table/list', {params: params});
    return res;
}

export async function getLineUser(params) {
    const res = await axios.get('/line/user', {params: params});
    return res;
}

export async function setAssignLineUser(params) {
    const res = await axios.post('/line/assign', params);
    return res;
}

export async function setAssignTableUserWork(params) {
    const res = await axios.post('/line/table/work', params);
    return res;
}

export async function inTem(params) {
    const res = await axios.post('/lot/intem', params);
    return res;
}

export async function getTableChon(params) {
    const res = await axios.get('/lot/table-data-chon', {params});
    return res;
}

export async function updateSanLuong(params) {
    const res = await axios.post('/lot/update-san-luong', params);
    return res;
}

export async function checkSanLuong(params) {
    const res = await axios.get('/lot/check-san-luong', {params});
    return res;
}

export async function batDauTinhSanLuong(params) {
    const res = await axios.post('/lot/bat-dau-tinh-dan-luong', params);
    return res;
}

export async function getLotByMachine(params) {
    const res = await axios.get('/oi/manufacture/list-lot', {params});
    return res;
}
export async function checkMaterialPosition(params) {
    const res = await axios.get('/oi/manufacture/check-material-position', {params});
    return res;
}