import axios from "axios";

export async function kpiTyLeKeHoach(params) {
    const res = await axios.get('kpi-ty-le-ke-hoach', {params});
    return res;
}

export async function kpiTonKhoNVL(params) {
    const res = await axios.get('kpi-ton-kho-nvl', {params});
    return res;
}

export async function kpiTyLeNGPQC(params) {
    const res = await axios.get('kpi-ty-le-ng-pqc', {params});
    return res;
}

export async function kpiTyLeVanHanh(params) {
    const res = await axios.get('kpi-ty-le-vanh-hanh-thiet-bi', {params});
    return res;
}

export async function kpiTyLeKeHoachIn(params) {
    const res = await axios.get('kpi-ty-le-ke-hoach-in', {params});
    return res;
}

export async function kpiTyLeLoiMay(params) {
    const res = await axios.get('kpi-ty-le-loi-may', {params});
    return res;
}