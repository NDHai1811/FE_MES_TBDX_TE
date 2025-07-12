import axios from "axios";

export async function getErrorDetailList(params) {
    const res = await axios.get('ui/quality/table-error-detail', {params});
    return res.data;
}
export async function getQualityOverall(params) {
    const res = await axios.get('ui/quality/overall', {params});
    return res;
}
export async function getTopError(params) {
    const res = await axios.get('ui/quality/top-error', {params});
    return res;
}
export async function getTrendingError(params) {
    const res = await axios.get('ui/quality/error-trending', {params});
    return res;
}
export async function recheckQC(params) {
    const res = await axios.post("ui/quality/recheck", params );
    return res;
}
export async function getQCHistory(params) {
    const res = await axios.get("ui/quality/qc-history", {params} );
    return res.data;
}
export async function exportQCHistory(params) {
    const res = await axios.get("ui/quality/qc-history/export", { params });
    return res;
}
export async function exportPQCHistory(params) {
    const res = await axios.get("ui/quality/pqc-history/export", { params });
    return res;
}
export async function getIQCHistory(params) {
    const res = await axios.get("ui/quality/iqc-history", {params} );
    return res.data;
}
export async function exportIQCHistory(params) {
    const res = await axios.get("ui/quality/iqc-history/export", { params });
    return res;
}
export async function getQCDetailHistory(params) {
    const res = await axios.get("ui/quality/qc-history/detail", { params });
    return res;
}