import axios from "axios";

export async function getProduceOverall(params) {
    const res = await axios.get("ui/manufacture/produce-overall", { params });
    return res;
}
export async function getProducePercent(params) {
    const res = await axios.get("ui/manufacture/produce-percent", { params });
    return res;
}
export async function getProduceTable(params) {
    const res = await axios.get("ui/manufacture/produce-table", { params });
    return res;
}
export async function getListProductPlan(params) {
    const res = await axios.get("ui/manufacture/production-plan/list", {
        params,
    });
    return res.data;
}

export async function handlePlan(params) {
    const res = await axios.post("ui/manufacture/handle-plan", params);
    return res;
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
export async function createProductPlan(params) {
    const res = await axios.post("ui/manufacture/create-plan", params);
    return res;
}

export async function getBuyers(params) {
    const res = await axios.get("/ui/manufacture/buyer/list", { params });
    return res.data;
}

export async function getListLayout(params) {
    const res = await axios.get('ui/manufacture/layout/list', { params });
    return res.data;
}

export async function getListDRC(params) {
    const res = await axios.get('ui/manufacture/drc/list', { params });
    return res.data;
}

export async function handleOrder(params) {
    const res = await axios.post("ui/manufacture/handle-order", params);
    return res;
}

export async function getOrderList(params) {
    const res = await axios.get("ui/manufacture/order/list", {params});
    return res;
}