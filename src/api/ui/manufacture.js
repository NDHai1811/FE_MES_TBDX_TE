import axios from "axios";

export async function getProduceOverall(params) {
    const res = await axios.get('ui/manufacture/produce-overall', {params});
    return res;
}
export async function getProducePercent(params) {
    const res = await axios.get('ui/manufacture/produce-percent', {params});
    return res;
}
export async function getProduceTable(params) {
    const res = await axios.get('ui/manufacture/produce-table', {params});
    return res;
}
export async function getListProductPlan(params) {
    const res = await axios.get("ui/manufacture/production-plan/list", { params });
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