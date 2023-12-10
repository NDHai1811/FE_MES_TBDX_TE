import axios from "axios";

export async function getErrorDetailList(params) {
    const res = await axios.get('ui/quality/table-error-detail', {params});
    return res;
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