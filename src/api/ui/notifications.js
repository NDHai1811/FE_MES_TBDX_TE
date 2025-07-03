import axios from "axios";

export async function getNotifications(params) {
    const res = await axios.get("/notifications", { params });
    return res;
}
export async function readNotifications(params, id) {
    if(!id){
        return;
    }
    const res = await axios.post(`notifications/${id}/read`, params );
    return res;
}