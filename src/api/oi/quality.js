import axios from "axios";

export async function scanPallet(params) {
    const res = await axios.post('/qc/scanPallet', params);
    return res;
}

export async function getChecksheetList(params) {
    const res = await axios.get('/qc/test/list', {params: params});
    return res;
}

export async function scanError(params) {
    const res = await axios.get('/qc/error/list', {params: params});
    return res;
}

export async function sendResultChecksheet(params) {
    const res = await axios.post('/qc/test/result', params);
    return res;
}

export async function sendResultError(params) {
    const res = await axios.post('/qc/error/result', params);
    return res;
}

export async function getQCOverall(params) {
    const res = await axios.get('/qc/overall', {params});
    return res;
}

export async function inTemVang(params) {
    const res = await axios.post('/qc/intemvang', params);
    return res;
}

export async function getInfoPalletQC(params) {
    const res = await axios.get('/qc/pallet/info', {params});
    return res;
}

export async function getLoSXDetail(params) {
    const res = await axios.get('/qc/losx/detail', {params});
    return res;
}

export async function updateSoLuongTemVang(params) {
    const res = await axios.post('/qc/update-temvang', params);
    return res;
}