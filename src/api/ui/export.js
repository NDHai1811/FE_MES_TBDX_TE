import axios from "axios";

export async function exportProduceHistory(params) {
    const res = await axios.get('/export/produce/history', {params});
    return res;
}

export async function exportThongSoMay(params) {
    const res = await axios.get('/export/thong-so-may', {params});
    return res;
}

export async function exportMachineError(params) {
    const res = await axios.get('/export/machine_error', {params});
    return res;
}
export async function exportMachineParameter(params) {
    const res = await axios.get('/export/machine_parameter', {params});
    return res;
}
export async function exportWarehouse(params) {
    const res = await axios.get('/export/warehouse/history', {params});
    return res;
}

export async function exportPQC(params) {
    const res = await axios.get('/export/pqc', {params});
    return res;
}
export async function exportOQC(params) {
    const res = await axios.get('/export/oqc', {params});
    return res;
}
export async function exportReportProduceHistory(params) {
    const res = await axios.get('/export/report-produce-history', {params});
    return res;
}
export async function exportQCHistory(params) {
    const res = await axios.get('/export/qc-history', {params});
    return res;
}
export async function exportReportQC(params) {
    const res = await axios.get('/export/report-qc', {params});
    return res;
}
